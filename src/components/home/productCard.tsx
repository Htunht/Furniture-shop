import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Heart, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
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
  const imageUrl =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";
  const hasDiscount = Number(product.discount) < Number(product.price);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post("/products/favorite", { productId });
      return response.data;
    },
    onMutate: async (productId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(["products"]);

      // Optimistically update to the new value
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

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onError: (_err, _productId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      toast.error("Failed to update favorites. Please sign in.");
    },
    onSettled: () => {
      // Always refetch after error or success to keep server and client in sync
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

    toast.success(`${product.name} added to cart!`, {
      description: "Your item is waiting for you in the cart.",
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMutation.mutate(product.id);
  };

  return (
    <Card className="group overflow-hidden rounded-3xl border-none bg-card shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-in fade-in zoom-in duration-700">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Overlay Add Button (Desktop Only) */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-all duration-500 group-hover:opacity-100 hidden md:flex">
          <Button
            onClick={handleAddToCart}
            className="rounded-full bg-primary px-8 py-6 text-base font-bold shadow-2xl shadow-primary/40 transform translate-y-8 transition-all duration-500 group-hover:translate-y-0 active:scale-95"
          >
            Add to Cart
          </Button>
        </div>

        {/* Badges (Moved here to stay on top) */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span className="rounded-full bg-background/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm border border-primary/10">
            {product.type.name}
          </span>
          {hasDiscount && (
            <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20">
              Sale
            </span>
          )}
        </div>

        {/* Favorite Button (Moved here to stay on top) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 z-10 h-10 w-10 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 ${
            product.isFavorite
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-background/60 text-foreground hover:bg-background hover:text-red-500"
          }`}
        >
          <Heart
            className={`h-5 w-5 ${product.isFavorite ? "fill-current" : ""}`}
          />
        </Button>
      </div>

      <CardContent className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">
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
        <h3 className="text-lg font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <p className="mt-2.5 text-[13px] text-muted-foreground/80 line-clamp-2 leading-relaxed font-medium">
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
          <span className="text-xl font-black tracking-tight text-foreground">
            ${Number(product.discount).toLocaleString()}
          </span>
        </div>

        {/* Mobile/Footer Add Button */}
        <Button
          size="icon"
          onClick={handleAddToCart}
          className="h-12 w-12 rounded-2xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm transition-all duration-300 active:scale-90 md:hidden group-hover:md:flex"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </CardFooter>
    </Card>
  );
}
