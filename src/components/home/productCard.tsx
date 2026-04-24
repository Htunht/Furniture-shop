import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Heart, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore"; // Import Wishlist
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

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
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);

  // --- Wishlist Zustand Logic ---
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFavoriteLocal = isInWishlist(product.id);
  // ------------------------------

  const imageUrl =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";
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
    <Card className="group overflow-hidden rounded-3xl border-none bg-card shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span className="rounded-full bg-background/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            {product.type.name}
          </span>
          {hasDiscount && (
            <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              Sale
            </span>
          )}
        </div>

        {/* Fixed Favorite Button: Merged Logic */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 z-10 h-10 w-10 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 ${
            isFavoriteLocal
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-background/60 text-foreground hover:bg-background hover:text-red-500"
          }`}
        >
          <Heart
            className={`h-5 w-5 ${isFavoriteLocal ? "fill-current" : ""}`}
          />
        </Button>

        {/* Overlay Add Button (Desktop) */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-all duration-500 group-hover:opacity-100 hidden md:flex">
          <Button
            onClick={handleAddToCart}
            className="rounded-full bg-primary px-8 py-6 font-bold shadow-2xl"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
            {product.category.name}
          </span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < product.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
              />
            ))}
          </div>
        </div>
        <h3 className="text-lg font-bold leading-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-2.5 text-[13px] text-muted-foreground/80 line-clamp-2">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          {hasDiscount && (
            <span className="text-[11px] font-bold text-muted-foreground line-through opacity-60">
              ${Number(product.price).toLocaleString()}
            </span>
          )}
          <span className="text-xl font-black text-foreground">
            ${Number(product.discount).toLocaleString()}
          </span>
        </div>
        <Button
          size="icon"
          onClick={handleAddToCart}
          className="h-12 w-12 rounded-2xl bg-secondary md:hidden group-hover:md:flex"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </CardFooter>
    </Card>
  );
}
