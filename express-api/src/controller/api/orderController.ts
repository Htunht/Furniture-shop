import { Request, Response } from "express";
import { sendEmail } from "../../lib/email";
import { getOrderConfirmationEmailHtml } from "../../lib/order-template";
import prisma from "../../lib/prisma";

export const sendOrderConfirmation = async (req: Request, res: Response) => {
  const { email, customerName, orderNumber, items, total, address, paymentMethod, orderTime } = req.body;
  const userId = (req as any).session?.user?.id;

  if (!email || !customerName || !orderNumber || !items || !total) {
    return res.status(400).json({ error: "Missing required order information" });
  }

  try {
    // 1. Save to Database
    await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        totalAmount: total,
        paymentMethod: paymentMethod || "COD",
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
      orderTime || new Date().toLocaleString()
    );

    await sendEmail({
      to: email,
      subject: `Order Confirmation #${orderNumber} - Tiger Balm`,
      text: `Thank you for your order, ${customerName}! Your order #${orderNumber} has been received.`,
      html: htmlContent,
    });

    res.status(200).json({ message: "Order placed and confirmation email sent successfully" });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Failed to process order" });
  }
};

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error tracking order:", error);
    res.status(500).json({ error: "Failed to track order" });
  }
};
