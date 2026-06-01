import { Request, Response } from "express";
import { sendEmail } from "../../lib/email";
import { getOrderConfirmationEmailHtml } from "../../lib/order-template";
import prisma from "../../lib/prisma";
import config from "../../config";

const getAbsoluteImageUrl = (product: any) => {
  const rawUrl = product?.images?.[0]?.url || product?.imageUrl;
  if (!rawUrl) return null;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }
  return `${config.backendUrl}${rawUrl.startsWith("/") ? rawUrl : "/" + rawUrl}`;
};

export const sendOrderConfirmation = async (req: Request, res: Response) => {
  let {
    email,
    customerName,
    orderNumber,
    items,
    total,
    address,
    paymentMethod,
    orderTime,
  } = req.body;
  const userId = (req as any).session?.user?.id;

  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch (e) {
      return res.status(400).json({ error: "Invalid items format" });
    }
  }

  const parsedTotal = parseFloat(total);

  if (!email || !customerName || !orderNumber || !items || isNaN(parsedTotal)) {
    return res
      .status(400)
      .json({ error: "Missing required order information" });
  }

  try {
    // 1. Save to Database
    await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        totalAmount: parsedTotal,
        paymentMethod: paymentMethod || "COD",
        paymentDetails: req.file
          ? JSON.stringify({ slipUrl: `/uploads/${req.file.filename}` })
          : null,
        address: address || "Address not specified",
        customerName,
        customerEmail: email,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || "unknown", // Make sure to pass productId from frontend
            name: item.name,
            quantity: item.quantity,
            price: item.discount,
          })),
        },
      },
    });

    // Update inventory
    for (const item of items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    const htmlContent = getOrderConfirmationEmailHtml(
      customerName,
      orderNumber,
      items,
      total,
      address || "Address not specified",
      paymentMethod || "COD",
      orderTime || new Date().toLocaleString(),
    );

    await sendEmail({
      to: email,
      subject: `Order Confirmation #${orderNumber} - Tiger Balm`,
      text: `Thank you for your order, ${customerName}! Your order #${orderNumber} has been received.`,
      html: htmlContent,
    });

    res
      .status(200)
      .json({
        message: "Order placed and confirmation email sent successfully",
      });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Failed to process order" });
  }
};

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    if (!orderNumber || typeof orderNumber !== "string") {
      return res.status(400).json({ error: "Invalid order number" });
    }
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const normalizedItems = order.items.map((item) => ({
      ...item,
      image: getAbsoluteImageUrl(item.product),
    }));

    res.json({
      ...order,
      items: normalizedItems,
    });
  } catch (error) {
    console.error("Error tracking order:", error);
    res.status(500).json({ error: "Failed to track order" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).session?.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const normalizedOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        image: getAbsoluteImageUrl(item.product),
      })),
    }));

    res.json(normalizedOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
