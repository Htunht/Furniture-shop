import { createProduct } from "../../repository/productRepository";

interface Product {
  name: string;
  description: string;
  price: number;
  discount: number;
  inventory: number;
  category: string;
  type: string;
  imageUrl?: string | undefined;
}

export const createProductService = async (product: Product) => {
  let createdProduct;
  try {
    createdProduct = await createProduct(product);
  } catch (error) {
    throw new Error("Failed to create product: " + (error as Error).message);
  }

  return createdProduct.id;
};
