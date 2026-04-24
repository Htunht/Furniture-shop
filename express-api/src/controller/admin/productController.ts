import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createProductService } from "../../service/admin/productCreateService";

export const createProduct = [
  body("name", "Product name is required").trim().notEmpty(),
  body("description", "Product description is required").trim().notEmpty(),
  body("price")
    .isFloat({ gt: 0 })
    .isDecimal({ decimal_digits: "1,2" })
    .withMessage("Price must be a positive number"),
  body("discount")
    .isFloat({ gt: 0 })
    .isDecimal({ decimal_digits: "1,2" })
    .withMessage("Discount must be a positive number"),
  body("inventory", "Inventory must be a positive integer").isInt({ min: 0 }),
  body("category", "Category is required").trim().notEmpty(),
  body("type", "Type is required").trim().notEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, discount, inventory, category, type } =
      req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Call the service to create the product
    const createdProductId = createProductService({
      name,
      description,
      price: parseFloat(price),
      discount: parseFloat(discount),
      inventory: parseInt(inventory, 10),
      category,
      type,
      imageUrl,
    });

    res.status(201).json({
      message: "Product created successfully",
      productId: createdProductId,
    });
  },
];
