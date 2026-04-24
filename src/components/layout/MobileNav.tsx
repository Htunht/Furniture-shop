import * as Dialog from "@radix-ui/react-dialog";
import { X, Home, ShoppingBag, Info, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function MobileNav() {
  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "#", icon: ShoppingBag },
    { name: "About", href: "#", icon: Info },
    { name: "Contact", href: "#", icon: Phone },
  ];

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content className="fixed inset-y-0 left-0 z-50 h-full w-[85%] border-r bg-background p-6 shadow-2xl transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out sm:max-w-sm data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                H
              </div>
              <span className="text-lg font-bold">Havenly</span>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>

          <Separator className="my-8" />

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Dialog.Close key={link.name} asChild>
                <Link
                  to={link.href}
                  className="group flex items-center justify-between rounded-xl px-4 py-4 text-base font-semibold hover:bg-primary/5 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <link.icon className="h-5 w-5" />
                    </div>
                    <span>{link.name}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              </Dialog.Close>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-2xl bg-muted/40 p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Support
              </p>
              <p className="text-sm font-medium">
                Have a question? Our team is here to help you 24/7.
              </p>
              <Button variant="link" className="px-0 h-auto mt-2 text-primary">
                Get in Touch
              </Button>
            </div>
            <p className="text-center text-[10px] text-muted-foreground font-medium">
              &copy; 2026 Technortal Furniture Store.
            </p>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
