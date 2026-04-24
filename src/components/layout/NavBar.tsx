import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { ShoppingCart, LogOut, Menu } from "lucide-react";
import { Link } from "react-router";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CartSheet } from "../cart/CartSheet";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  const { data: session } = useSession();
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for persisted state
  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCount = mounted ? cartCount : 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </Dialog.Trigger>
            <MobileNav />
          </Dialog.Root>

          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
              H
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block font-outfit">
              Havenly
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Shop
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative transition-transform active:scale-95"
              >
                <ShoppingCart className="h-5 w-5" />
                {displayCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground animate-in zoom-in">
                    {displayCount}
                  </span>
                )}
              </Button>
            </Dialog.Trigger>
            <CartSheet />
          </Dialog.Root>

          {session ? (
            <div className="flex items-center gap-2 border-l pl-2 ml-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-medium leading-none">
                  {session.user.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {session.user.role || "User"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button
                size="sm"
                className="rounded-full px-6 shadow-md transition-all hover:shadow-lg active:scale-95"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
