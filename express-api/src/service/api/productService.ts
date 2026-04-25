import * as productRepository from "../../repository/productRepository";

export const getPaginatedProducts = async (
  limit: number,
  cursor?: string,
  userId?: string,
  category?: string,
) => {
  return await productRepository.getPaginatedProducts(limit, cursor, userId, category);
};

export const toggleFavorite = async (userId: string, productId: string) => {
  return await productRepository.toggleFavorite(userId, productId);
};
