import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { X } from "lucide-react";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlistStore();
  const [hydrated, setHydrated] = useState(false);

  // Fix Hydration for Vite/SSR
  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;
 
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Wishlist</h1>
      <div className="border-t border-gray-200">
        {items.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            Your wishlist is empty.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center gap-6 py-6 border-b border-gray-100 group"
            >
              <button
                onClick={() => toggleWishlist(item)}
                className="text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>

              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-32 object-cover bg-gray-50"
              />

              <div className="flex-1 text-center md:text-left">
                <h3 className="font-medium text-lg uppercase tracking-tight">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-400">{item.category}</p>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
                <span className="font-semibold text-gray-700">
                  Ks {Number(item.price).toLocaleString()}
                </span>
                <span className="text-green-600 text-xs font-bold border border-green-600 px-3 py-1 rounded-full uppercase">
                  In Stock
                </span>
                <button className="bg-black text-white px-8 py-3 text-sm font-bold uppercase transition-transform active:scale-95">
                  Select options
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
