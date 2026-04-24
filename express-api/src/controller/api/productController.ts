import { Request, Response } from "express";

import * as productService from "../../service/api/productService";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const cursor = req.query.cursor as string | undefined;
    const userId = (req as any).session?.user?.id;

    const result = await productService.getPaginatedProducts(
      limit,
      cursor,
      userId,
    );
    res.json({
      status: "success",
      data: result.products,
      nextCursor: result.nextCursor,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).session?.user?.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await productService.toggleFavorite(userId, productId);
    res.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
