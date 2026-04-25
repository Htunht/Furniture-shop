import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MapPin, Play } from "lucide-react";
import { Link } from "react-router";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-[#F9F8F6] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EBE7DF] hidden lg:block -z-0" />
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 h-full min-h-screen flex flex-col lg:flex-row items-center relative z-10 py-20 lg:py-0">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 lg:pr-12 flex flex-col justify-center items-start text-left order-2 lg:order-1 mt-12 lg:mt-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2C2926]/10 bg-white/50 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold text-[#2C2926] shadow-sm mb-8 animate-in fade-in slide-in-from-left-4 duration-1000 uppercase tracking-[0.3em]">
            <Sparkles className="h-3 w-3" />
            <span>Curated Collection 2026</span>
          </div>

          <h1 className="text-6xl md:text-8xl xl:text-9xl font-bold tracking-tighter mb-8 leading-[0.85] animate-in fade-in slide-in-from-left-6 duration-1000 delay-100 uppercase font-outfit text-[#2C2926]">
            Comfort <br />
            <span className="font-serif italic lowercase font-normal text-[#8B857A] ml-4 md:ml-12">
              Redefined.
            </span>
          </h1>

          <p className="max-w-md text-base md:text-lg text-[#5C574F] mb-12 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200 leading-relaxed font-medium">
            We believe your home should be a reflection of your soul. Discover
            furniture that blends artisanal heritage with modern living.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-left-10 duration-1000 delay-300">
            <Link to="/shop">
              <Button
                size="lg"
                className="h-16 px-10 rounded-none bg-[#2C2926] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-2xl transition-all hover:bg-stone-700 active:scale-95 group"
              >
                Shop Now
                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button
                size="lg"
                variant="ghost"
                className="h-16 px-10 rounded-none border border-[#2C2926]/20 text-[#2C2926] text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-[#2C2926] hover:text-white active:scale-95 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
                  <Play className="h-3 w-3 fill-current ml-0.5" />
                </div>
                The Story
              </Button>
            </Link>
          </div>

          <div className="mt-20 flex items-center gap-12 border-t border-[#2C2926]/10 pt-12 opacity-60">
            <div>
              <p className="text-2xl font-bold font-outfit">12k+</p>
              <p className="text-[10px] uppercase tracking-widest font-bold">
                Happy Homes
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold font-outfit">4.9/5</p>
              <p className="text-[10px] uppercase tracking-widest font-bold">
                Client Rating
              </p>
            </div>
          </div>
        </div>

        {/* Right Image Content */}
        <div className="w-full lg:w-1/2 relative order-1 lg:order-2 h-[50vh] lg:h-[80vh]">
          <div className="absolute inset-0 bg-[#E5E0D8] rotate-3 translate-x-4 translate-y-4 -z-10" />
          <div className="relative w-full h-full overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80"
              alt="Home Hero"
              className="h-full w-full object-cover transition-transform duration-[20s] hover:scale-110"
            />
            {/* Floating Badge */}
            <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-6 shadow-xl border border-stone-100 animate-bounce duration-[3000ms]">
              <MapPin className="w-6 h-6 mb-4 text-[#2C2926]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B857A] mb-1">
                Our Showroom
              </p>
              <p className="text-sm font-bold text-[#2C2926]">SoHo, New York</p>
            </div>
          </div>

          {/* Decorative Lines */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#2C2926]/20 -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-[#2C2926]/20 translate-y-8 -translate-x-8" />
        </div>
      </div>

      {/* Side Vertical Text */}
      <div className="absolute right-0 bottom-4 hidden xl:block">
        <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-[#8B857A]">
          Est. 1994 — Tiger Balm Design Studio
        </p>
      </div>
    </section>
  );
}
