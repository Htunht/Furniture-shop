import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ProductCard } from "@/components/home/productCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ArrowRight,
} from "lucide-react";

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

const categoryThemes: Record<string, any> = {
  "living-room": {
    title: "Living Room",
    subtitle: "Sanctuaries of Comfort",
    description:
      "Designed for the moments that matter. From morning coffees to late-night conversations.",
    bgColor: "bg-[#F9F8F6]",
    accentColor: "text-[#2C2926]",
    heroImage: "/living-room-hero.png",
    layout: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
  bedroom: {
    title: "Bedroom",
    subtitle: "Dream in Serenity",
    description:
      "Your private retreat for rest and rejuvenation. Soft textures and calming aesthetics.",
    bgColor: "bg-[#F0F4F8]",
    accentColor: "text-[#1A365D]",
    heroImage:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80",
    layout: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
  dining: {
    title: "Dining",
    subtitle: "The Art of Gathering",
    description:
      "Where meals become memories. Elegant tables and seating for the perfect host.",
    bgColor: "bg-[#FFF9F0]",
    accentColor: "text-[#4A3728]",
    heroImage: "/dining-hero.png",
    layout: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
  workspace: {
    title: "Workspace",
    subtitle: "Elevate Your Focus",
    description:
      "Precision-engineered furniture for the modern professional. Productivity meets design.",
    bgColor: "bg-[#F4F4F4]",
    accentColor: "text-[#2D3748]",
    heroImage: "/workspace-hero.png",
    layout: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
  accessories: {
    title: "Accessories",
    subtitle: "The Final Touch",
    description:
      "Small details that make a big impact. Curated accents to personalize your space.",
    bgColor: "bg-[#FAF5FF]",
    accentColor: "text-[#44337A]",
    heroImage:
      "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80",
    layout: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
};

export default function ShopCategoryPage() {
  const { category } = useParams();
  const theme =
    categoryThemes[category || "living-room"] || categoryThemes["living-room"];

  const categoryMap: Record<string, string> = {
    "living-room": "Living Room",
    bedroom: "Bedroom",
    dining: "Dining",
    workspace: "Office",
    accessories: "Kitchen",
  };

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const response = await api.get("/products", {
        params: {
          limit: 50,
          category: categoryMap[category || "living-room"],
        },
      });
      return response.data.data as Product[];
    },
  });

  // Fetch related products (other categories)
  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", category],
    queryFn: async () => {
      const response = await api.get("/products", {
        params: { limit: 8 },
      });
      return response.data.data.filter(
        (p: Product) => p.category.name !== categoryMap[category || ""],
      ) as Product[];
    },
  });

  return (
    <div
      className={`${theme.bgColor} min-h-screen transition-colors duration-700`}
    >
      {/* Dynamic Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={theme.heroImage}
            alt={theme.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Back Link */}
        <div className="absolute top-10 left-10 z-20">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs bg-black/20 backdrop-blur-md px-6 py-3 border border-white/20 hover:bg-white hover:text-[#2C2926] transition-all"
          >
            <ArrowRight className="rotate-180 w-4 h-4" /> Back to Shop
          </Link>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl bg-white/10 backdrop-blur-md p-8 md:p-12 border border-white/20 text-white">
            <p className="text-sm tracking-[0.4em] uppercase mb-4 font-bold opacity-80">
              {theme.subtitle}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 font-outfit">
              {theme.title}.
            </h1>
            <p className="text-lg opacity-90 leading-relaxed max-w-lg">
              {theme.description}
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-stone-500 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <div className="h-4 w-px bg-[#E5E0D8]" />
            <p className="text-xs font-medium text-[#8B857A]">
              Showing {products?.length || 0} Results
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#F9F8F6] rounded-full transition-colors">
              <LayoutGrid size={18} />
            </button>
            <button className="p-2 hover:bg-[#F9F8F6] rounded-full transition-colors">
              <List size={18} />
            </button>
            <div className="h-4 w-px bg-[#E5E0D8]" />
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-stone-500 transition-colors">
              Sort By <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Spinner className="h-8 w-8 text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive font-bold">
                Failed to load collection.
              </p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : products && products.length > 0 ? (
            <div className={`grid gap-8 md:gap-12 ${theme.layout}`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border-2 border-dashed border-[#E5E0D8]">
              <h3 className="text-2xl font-bold uppercase mb-4 opacity-20">
                Collection Coming Soon
              </h3>
              <p className="text-[#8B857A] mb-8">
                We're currently curating the perfect pieces for this category.
              </p>
              <Link to="/shop">
                <Button
                  variant="outline"
                  className="rounded-none uppercase font-bold tracking-widest text-xs"
                >
                  Return to Shop
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8B857A] mb-4 text-center">
              Complete your space
            </p>
            <h2 className="text-4xl font-bold uppercase tracking-tight text-center">
              You might also like.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection CTA */}
      <section className="py-24 border-t border-[#E5E0D8] bg-[#F9F8F6]">
        <div className="container mx-auto px-4">
          <div className="bg-[#2C2926] text-white p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
            <div className="max-w-xl relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
                Complete the look.
              </h2>
              <p className="text-stone-400 text-lg mb-10 leading-relaxed">
                Save 15% when you purchase a full room set. Our designers have
                curated the perfect pairings to make styling your home
                effortless.
              </p>
              <Button className="h-14 px-12 bg-white text-[#2C2926] hover:bg-stone-200 rounded-none uppercase font-bold tracking-widest text-xs">
                View Bundles
              </Button>
            </div>
            <div className="relative z-10 w-full md:w-1/3 aspect-square border-8 border-stone-800 rotate-3 overflow-hidden">
              <img
                src={theme.heroImage}
                className="w-full h-full object-cover scale-150"
              />
            </div>
            <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      </section>
    </div>
  );
}
