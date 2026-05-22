import { Star, Heart, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore"; // Import Wishlist
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { getImageSrc } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: string | number;
    discount: string | number;
    rating: number;
    images: { url: string }[];
    category: { name: string };
    type: { name: string };
    isFavorite: boolean;
    imageUrl?: string | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);

  // --- Wishlist Zustand Logic ---
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFavoriteLocal = isInWishlist(product.id);
  // ------------------------------

  const rawImageUrl = product.images?.[0]?.url || product.imageUrl;
  const imageUrl = getImageSrc(rawImageUrl);

  const hasDiscount = Number(product.discount) < Number(product.price);

  // Existing Mutation for Database Sync
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post("/products/favorite", { productId });
      return response.data;
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products"]);
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: any) =>
              p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p,
            ),
          })),
        };
      });
      return { previousProducts };
    },
    onError: (_err, _productId, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      toast.error("Failed to sync favorites with server.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      discount: Number(product.discount),
      image: imageUrl,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Update Local Zustand Store (Persists in LocalStorage)
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.discount,
      imageUrl: imageUrl,
      category: product.category.name,
    });

    // 2. Update Database via React Query
    toggleFavoriteMutation.mutate(product.id);
  };

  return (
    <div className="relative group h-full">
      {/* Shadow layer offset */}
      <div className="absolute inset-0 bg-[#E5E0D8] translate-x-2 translate-y-2 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />

      {/* Main Card */}
      <article className="relative bg-[#F9F8F6] border border-[#2C2926]/10 p-3 h-full flex flex-col justify-between transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">

        {/* Image wrapper */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#EBE7DF] border border-[#2C2926]/5">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <span className="bg-[#F9F8F6]/90 backdrop-blur-sm px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#2C2926] border border-[#2C2926]/10">
              {product.type.name}
            </span>
            {hasDiscount && (
              <span className="bg-[#2C2926] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#F9F8F6]">
                Sale
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 z-10 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 border border-[#2C2926]/10 shadow-sm ${isFavoriteLocal
              ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600"
              : "bg-[#F9F8F6]/90 backdrop-blur-sm text-[#2C2926] hover:bg-[#2C2926] hover:text-white"
              }`}
            aria-label={isFavoriteLocal ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${isFavoriteLocal ? "fill-current" : ""}`} />
          </button>

          {/* Image Overlay Hover Button (Desktop) */}
          <div className="absolute inset-0 bg-[#2C2926]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 hidden md:flex">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-[#F9F8F6] text-[#2C2926] hover:bg-[#2C2926] hover:text-[#F9F8F6] font-bold text-[10px] uppercase tracking-[0.2em] py-3.5 border border-[#2C2926]/10 shadow-lg transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Content details */}
        <div className="pt-4 pb-1 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8B857A]">
                {product.category.name}
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < product.rating
                      ? "fill-[#2C2926] text-[#2C2926]"
                      : "fill-transparent text-[#E5E0D8]"
                      }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="font-outfit text-base font-bold uppercase tracking-tight text-[#2C2926] line-clamp-1 group-hover:text-[#8B857A] transition-colors">
              {product.name}
            </h3>

            <p className="text-[11px] text-[#5C574F] font-medium line-clamp-2 leading-relaxed mt-1.5">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5E0D8]">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-[10px] font-bold text-[#8B857A] line-through leading-none mb-1">
                  ${Number(product.price).toLocaleString()}
                </span>
              )}
              <span className="text-base font-extrabold text-[#2C2926] font-outfit leading-none">
                ${Number(product.discount).toLocaleString()}
              </span>
            </div>

            {/* Quick Add Button (visible on mobile, and falls back to reveal on hover/focus if desired, but hidden on desktop by default) */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-8 px-3 bg-[#2C2926] text-[#F9F8F6] hover:bg-stone-700 text-[10px] font-bold uppercase tracking-widest transition-all md:hidden items-center justify-center flex gap-1.5"
            >
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
          </div>
        </div>

      </article>
    </div>
  );
}
