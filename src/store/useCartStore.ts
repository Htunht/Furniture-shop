import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i: CartItem) => i.id === item.id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            state.items.push({ ...item, quantity: 1 });
          }
        }),

      removeItem: (id) =>
        set((state) => {
          state.items = state.items.filter((i: CartItem) => i.id !== id);
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const item = state.items.find((i: CartItem) => i.id === id);
          if (item) {
            item.quantity = Math.max(0, quantity);
          }
          // Remove if 0
          if (item?.quantity === 0) {
            state.items = state.items.filter((i: CartItem) => i.id !== id);
          }
        }),

      clearCart: () =>
        set((state) => {
          state.items = [];
        }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.discount * item.quantity,
          0,
        );
      },
    })),
    {
      name: "furniture-cart",
    },
  ),
);
