import * as productRepository from "../../repository/productRepository";

export const getPaginatedProducts = async (
  limit: number,
  cursor?: string,
  userId?: string,
) => {
  return await productRepository.getPaginatedProducts(limit, cursor, userId);
};

export const toggleFavorite = async (userId: string, productId: string) => {
  return await productRepository.toggleFavorite(userId, productId);
};
