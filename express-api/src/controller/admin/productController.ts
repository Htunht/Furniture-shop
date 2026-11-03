import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { createProductService } from "../../service/admin/productCreateService";
import prisma from "../../lib/prisma";
import { deleteLocalUploads, getLocalUploadUrl } from "../../lib/localUpload";


export const createProduct = [
  body("name", "Product name is required").trim().notEmpty(),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("inventory", "Inventory must be a positive integer").isInt({ min: 0 }),
  body("category", "Category is required").trim().notEmpty(),
  body("type", "Type is required").trim().notEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        try {
          await deleteLocalUploads([getLocalUploadUrl(req.file)]);
        } catch (error) {
          console.error("INVALID PRODUCT UPLOAD CLEANUP ERROR:", error);
        }
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description = "",
      price,
      discount,
      inventory,
      category,
      type,
    } = req.body;

    try {
      let imageUrl: string | undefined = undefined;
      if (req.file) {
        imageUrl = getLocalUploadUrl(req.file) ?? undefined;
      }

      const createdProductId = await createProductService({
        name,
        description,
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : parseFloat(price),
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
      if (req.file) {
        try {
          await deleteLocalUploads([getLocalUploadUrl(req.file)]);
        } catch (cleanupError) {
          console.error("LOCAL UPLOAD CLEANUP ERROR:", cleanupError);
        }
      }
      res.status(500).json({ error: "Failed to establish new entry." });
    }
  },
];

import { Prisma } from "../../generated/prisma";

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, description, price, discount, inventory, category, type } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required for revisions." });
  }

  try {
    const existingProduct = req.file
      ? await prisma.product.findUnique({
          where: { id },
          select: {
            imageUrl: true,
            images: { select: { url: true } },
          },
        })
      : null;

    let imageUrl: string | undefined = undefined;
    if (req.file) {
      imageUrl = getLocalUploadUrl(req.file) ?? undefined;
    }
    // Correctly parse and validate inputs
    const parsedPrice = price !== undefined ? new Prisma.Decimal(price) : undefined;
    const parsedDiscount = discount !== undefined ? new Prisma.Decimal(discount) : undefined;
    const parsedInventory = inventory !== undefined ? parseInt(inventory, 10) : undefined;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
        ...(parsedPrice !== undefined ? { price: parsedPrice } : {}),
        ...(parsedDiscount !== undefined ? { discount: parsedDiscount } : {}),
        ...(parsedInventory !== undefined && !isNaN(parsedInventory)
          ? { inventory: parsedInventory }
          : {}),
        ...(imageUrl
          ? {
              imageUrl,
              images: {
                deleteMany: {}, // Clean up existing image references
                create: [{ url: imageUrl }], // Add the new image reference
              },
            }
          : {}),
        ...(category
          ? {
              category: {
                connectOrCreate: {
                  where: { name: category },
                  create: { name: category },
                },
              },
            }
          : {}),
        ...(type
          ? {
              type: {
                connectOrCreate: {
                  where: { name: type },
                  create: { name: type },
                },
              },
            }
          : {}),
      },
    });

    let imageCleanupFailed = false;
    if (existingProduct && imageUrl) {
      try {
        await deleteLocalUploads([
          existingProduct.imageUrl ?? "",
          ...existingProduct.images.map((image) => image.url),
        ]);
      } catch (error) {
        imageCleanupFailed = true;
        console.error("LOCAL IMAGE REPLACEMENT CLEANUP ERROR:", error);
      }
    }

    res.json({
      message: imageCleanupFailed
        ? "Design updated, but its previous local image could not be removed."
        : "Design revision successful.",
      imageCleanupFailed,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    if (req.file) {
      try {
        await deleteLocalUploads([getLocalUploadUrl(req.file)]);
      } catch (cleanupError) {
        console.error("LOCAL UPLOAD CLEANUP ERROR:", cleanupError);
      }
    }
    res.status(500).json({
      error: "Transaction failed: Check your database constraints or ID.",
    });
  }
};
