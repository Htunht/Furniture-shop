import prisma from "../lib/prisma";

export const getProducts = async () => {
  return await prisma.product.findMany({
    include: {
      category: true,
      type: true,
      images: true,
    },
  });
};

export const getPaginatedProducts = async (
  limit: number,
  cursor?: string,
  userId?: string,
) => {
  const query: any = {
    take: limit,
    orderBy: { id: "asc" },
    include: {
      category: true,
      type: true,
      images: true,
      ...(userId ? { favorites: { where: { userId } } } : {}),
    },
  };

  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1;
  }

  const products = await prisma.product.findMany(query);

  const nextCursor =
    products.length === limit ? products[products.length - 1]?.id : null;

  return {
    products: products.map((p: any) => ({
      ...p,
      isFavorite: p.favorites?.length > 0,
    })),
    nextCursor: nextCursor || null,
  };
};

export const createProduct = async (data: any) => {
  const productData: any = {
    name: data.name,
    description: data.description,
    price: data.price,
    discount: data.discount,
    inventory: data.inventory,
    category: {
      connectOrCreate: {
        where: { name: data.category },
        create: { name: data.category },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: data.type },
        create: { name: data.type },
      },
    },
    images: {
      create: data.images?.map((url: string) => ({ url })) || [],
    },
  };

  return await prisma.product.create({
    data: productData,
    include: {
      category: true,
      type: true,
      images: true,
    },
  });
};

export const toggleFavorite = async (userId: string, productId: string) => {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: { id: existing.id },
    });
    return { favorited: false };
  } else {
    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
    return { favorited: true };
  }
};
