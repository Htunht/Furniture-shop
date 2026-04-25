import * as Dialog from "@radix-ui/react-dialog";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/auth-client";

export function CartSheet() {
  const { data: session } = useSession();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalItems = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content className="fixed inset-y-0 right-0 z-50 h-full w-full border-l bg-background p-6 shadow-2xl transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out sm:max-w-md data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <Dialog.Title className="text-lg font-bold">
                Your Cart ({totalItems})
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>

          <Separator className="my-6" />

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4 opacity-50">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Wait, your cart is empty!
              </h3>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Explore our collections and find something perfect for your
                home.
              </p>
              <Dialog.Close asChild>
                <Link to="/shop">
                  <Button className="mt-8 rounded-full px-8">
                    Start Shopping
                  </Button>
                </Link>
              </Dialog.Close>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold line-clamp-1">
                            {item.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ${item.discount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border p-1 bg-muted/30">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-bold">
                          ${(item.discount * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-xl font-bold">
                    ${getTotalPrice().toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>
                {session ? (
                  <Dialog.Close asChild>
                    <Link to="/checkout" className="w-full">
                      <Button className="w-full h-14 rounded-full text-base font-bold shadow-lg shadow-primary/20">
                        Order Now
                      </Button>
                    </Link>
                  </Dialog.Close>
                ) : (
                  <div className="space-y-3">
                     <p className="text-[10px] text-center text-red-500 font-bold uppercase tracking-widest">Login required to place order</p>
                     <Dialog.Close asChild>
                      <Link to="/login" className="w-full">
                        <Button variant="outline" className="w-full h-14 rounded-full text-base font-bold border-2">
                          Sign In to Order
                        </Button>
                      </Link>
                    </Dialog.Close>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
