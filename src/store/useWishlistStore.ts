import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface WishlistItem {
  id: string;
  name: string;
  price: number | string;
  imageUrl: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    immer((set, get) => ({
      items: [],
      toggleWishlist: (item) =>
        set((state) => {
          const index = state.items.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            state.items.splice(index, 1);
          } else {
            state.items.push(item);
          }
        }),
      isInWishlist: (id) => get().items.some((i) => i.id === id),
    })),
    {
      name: "havenly-wishlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
