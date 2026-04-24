import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Hero } from "@/components/home/hero";
import { ProductCard } from "@/components/home/productCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Loader2, LayoutGrid, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  discount: string;
  rating: number;
  images: { url: string }[];
  category: { name: string };
  type: { name: string };
  isFavorite: boolean;
}

interface ApiResponse {
  status: string;
  data: Product[];
  nextCursor: string | null;
}

function App() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: async ({ pageParam }) => {
      const response = await api.get<ApiResponse>("/products", {
        params: {
          limit: 8,
          cursor: pageParam,
        },
      });
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="pb-20">
      <Hero />

      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 flex flex-col md:flex-row items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Featured Collections
            </h2>
            <p className="text-muted-foreground">
              Our latest arrivals are designed with comfort and style in mind.
              Each piece is handcrafted using sustainable materials to ensure
              quality that lasts.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full font-semibold"
            >
              All Products
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : status === "error" ? (
          <div className="flex h-60 flex-col items-center justify-center gap-4">
            <p className="text-destructive font-medium">
              Failed to load products.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-20 flex justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="group h-14 rounded-full px-12 text-base font-bold shadow-sm transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/20"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Products
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {!hasNextPage && products.length > 0 && (
              <div className="mt-20 flex flex-col items-center justify-center text-muted-foreground">
                <LayoutGrid className="h-10 w-10 mb-4 opacity-20" />
                <p className="text-sm font-medium">
                  You've reached the end of our curated collection.
                </p>
              </div>
            )}

            {products.length === 0 && !isLoading && (
              <div className="mt-20 flex flex-col items-center justify-center text-muted-foreground">
                <LayoutGrid className="h-10 w-10 mb-4 opacity-20" />
                <p className="text-sm font-medium">No products found.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default App;
