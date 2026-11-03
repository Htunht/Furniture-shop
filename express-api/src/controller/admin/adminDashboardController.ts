import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { sendEmail } from "../../lib/email";
import { getTransitEmailHtml, getDeliveredEmailHtml } from "../../lib/order-template";
import { deleteLocalUploads } from "../../lib/localUpload";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Fetch stats in parallel for better performance
    const [totalProducts, totalOrders, products, todayStats, yesterdayStats] =
      await Promise.all([
        prisma.product.count({ where: { status: { not: "ARCHIVED" } } }),
        prisma.order.count(),
        prisma.product.findMany({
          where: { status: { not: "ARCHIVED" } },
          select: { inventory: true },
        }),
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

    // Flatten customer fields for dashboard UI compatibility.
    const normalizedOrders = orders.map((order) => ({
      ...order,
      customerName: order.customerName || order.user?.name || "Unknown Customer",
      customerEmail: order.customerEmail || order.user?.email || "",
    }));

    res.json(normalizedOrders);
  } catch {
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
    // Fetch the existing order to check its current status
    const existingOrder = await prisma.order.findUnique({
      where: { id: id as string }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = await prisma.order.update({
      where: { id: id as string },
      data: { status, paymentStatus },
    });

    // Send emails if status changed
    if (existingOrder.status !== status) {
      if (status === "TRANSIT" && order.customerEmail) {
        await sendEmail({
          to: order.customerEmail,
          subject: `Order In Transit #${order.orderNumber} - Heavenly`,
          text: `Your order #${order.orderNumber} is now in transit.`,
          html: getTransitEmailHtml(order.customerName, order.orderNumber),
        });
      } else if (status === "DELIVERED" && order.customerEmail) {
        await sendEmail({
          to: order.customerEmail,
          subject: `Order Delivered #${order.orderNumber} - Heavenly`,
          text: `Your order #${order.orderNumber} has been delivered. Thank you for shopping with us!`,
          html: getDeliveredEmailHtml(order.customerName, order.orderNumber),
        });
      }
    }

    res.json(order);
  } catch (err) {
    console.error("Failed to update order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: { not: "ARCHIVED" } },
      include: { category: true, type: true, images: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(
      products.map((product) => {
        const imagePath = product.imageUrl?.startsWith("/uploads/")
          ? path.join(process.cwd(), "uploads", path.basename(product.imageUrl))
          : null;
        const hasLocalImage = imagePath && fs.existsSync(imagePath);
        const fallbackImage = product.images.find((image) =>
          /^https?:\/\//i.test(image.url),
        );

        return {
          ...product,
          imageUrl:
            product.imageUrl && (!imagePath || hasLocalImage)
              ? product.imageUrl
              : (fallbackImage?.url ?? product.imageUrl),
        };
      }),
    );
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const [product, orderItemsCount] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          imageUrl: true,
          images: { select: { url: true } },
        },
      }),
      prisma.orderItem.count({ where: { productId: id } }),
    ]);

    if (!product) {
      return res.status(404).json({ error: "Design not found" });
    }

    if (orderItemsCount > 0) {
      await prisma.product.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });
      return res.json({
        archived: true,
        message: "Design archived (retains transaction history).",
      });
    }

    await prisma.product.delete({ where: { id } });

    let imageCleanupFailed = false;
    try {
      await deleteLocalUploads([
        product.imageUrl ?? "",
        ...product.images.map((image) => image.url),
      ]);
    } catch (error) {
      imageCleanupFailed = true;
      console.error("LOCAL IMAGE CLEANUP ERROR:", error);
    }

    res.json({
      archived: false,
      imageCleanupFailed,
      message: imageCleanupFailed
        ? "Design deleted, but its local image could not be removed."
        : "Design and local images deleted.",
    });
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
  } catch {
    res.status(500).json({ error: "Failed to fetch architects" });
  }
};
