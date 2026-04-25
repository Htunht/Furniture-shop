import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Fetch stats in parallel for better performance
    const [totalProducts, totalOrders, products, todayStats, yesterdayStats] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.product.findMany({ select: { inventory: true } }),
        prisma.order.aggregate({
          where: { createdAt: { gte: today } },
          _sum: { totalAmount: true },
          _count: { id: true },
        }),
        prisma.order.aggregate({
          where: { createdAt: { gte: yesterday, lt: today } },
          _sum: { totalAmount: true },
          _count: { id: true },
        }),
      ]);

    // Calculate Total In-Stock Items
    const totalInventory = products.reduce((acc, p) => acc + (p.inventory || 0), 0);

    // Calculate Growth Percentage
    const todayRevenue = Number(todayStats._sum.totalAmount || 0);
    const yesterdayRevenue = Number(yesterdayStats._sum.totalAmount || 0);
    
    let growthPercentage = 0;
    if (yesterdayRevenue > 0) {
      growthPercentage = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    } else if (todayRevenue > 0) {
      growthPercentage = 100; // 100% growth if we had 0 yesterday and something today
    }

    res.json({
      totalProducts,
      totalOrders,
      totalInventory,
      todayRevenue,
      yesterdayRevenue,
      growthPercentage: parseFloat(growthPercentage.toFixed(2)),
    });
  } catch (error) {
    console.error("STATS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch dashboard intelligence" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    const order = await prisma.order.update({
      where: { id: id as string },
      data: { status, paymentStatus },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, type: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    // 1. Find product to get its image path for cleanup
    const product = await prisma.product.findUnique({ where: { id } });
    
    if (!product) {
      return res.status(404).json({ error: "Design not found" });
    }

    // 2. Delete associated image file from disk
    if (product.imageUrl) {
      const fileName = product.imageUrl.split("/").pop();
      if (fileName) {
        const filePath = path.join(process.cwd(), "uploads", fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`PURGE: Deleted image file ${fileName}`);
        }
      }
    }

    // 3. Delete from database
    await prisma.product.delete({ where: { id } });
    
    res.json({ message: "Design decommissioned and physical files purged." });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ error: "Failed to decommission design" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch architects" });
  }
};
