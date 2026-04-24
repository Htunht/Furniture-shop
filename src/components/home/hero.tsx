import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-accent/10 blur-[80px]" />

      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-medium text-primary shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Collection 2026</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
          Crafting the <span className="text-primary italic">Perfect</span>{" "}
          Space for You
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Discover our curated collection of artisanal furniture designed to
          blend timeless elegance with modern functionality for your
          contemporary lifestyle.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <Button
            size="lg"
            className="h-14 px-8 rounded-full text-base font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            Explore Collection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 rounded-full text-base font-semibold transition-all hover:bg-muted active:scale-95"
          >
            View Showroom
          </Button>
        </div>
      </div>
    </section>
  );
}
