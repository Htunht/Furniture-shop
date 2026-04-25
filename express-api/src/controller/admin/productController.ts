import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createProductService } from "../../service/admin/productCreateService";
import prisma from "../../lib/prisma";

export const createProduct = [
  body("name", "Product name is required").trim().notEmpty(),
  body("description", "Product description is required").trim().notEmpty(),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("inventory", "Inventory must be a positive integer").isInt({ min: 0 }),
  body("category", "Category is required").trim().notEmpty(),
  body("type", "Type is required").trim().notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, discount, inventory, category, type } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
      const createdProductId = await createProductService({
        name,
        description,
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : 0,
        inventory: parseInt(inventory, 10),
        category,
        type,
        imageUrl,
      });

      res.status(201).json({
        message: "Product created successfully",
        productId: createdProductId,
      });
    } catch (error) {
      console.error("CREATE ERROR:", error);
      res.status(500).json({ error: "Failed to establish new entry." });
    }
  },
];

import { Prisma } from "../../generated/prisma";

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, description, price, discount, inventory, category, type } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required for revisions." });
  }

  try {
    // Correctly parse and validate inputs
    const parsedPrice = price !== undefined ? new Prisma.Decimal(price) : undefined;
    const parsedDiscount = discount !== undefined ? new Prisma.Decimal(discount) : undefined;
    const parsedInventory = inventory !== undefined ? parseInt(inventory, 10) : undefined;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        price: parsedPrice,
        discount: parsedDiscount,
        inventory: (parsedInventory !== undefined && !isNaN(parsedInventory)) ? parsedInventory : undefined,
        imageUrl: imageUrl || undefined,
        category: category
          ? {
              connectOrCreate: {
                where: { name: category },
                create: { name: category },
              },
            }
          : undefined,
        type: type
          ? {
              connectOrCreate: {
                where: { name: type },
                create: { name: type },
              },
            }
          : undefined,
      },
    });

    res.json({
      message: "Design revision successful.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({
      error: "Transaction failed: Check your database constraints or ID.",
    });
  }
};
