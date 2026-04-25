import {
  Newspaper,
  ExternalLink,
  Download,
  MessageSquare,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const pressReleases = [
  {
    date: "April 12, 2026",
    title:
      "Tiger Balm Unveils 'The Zen Collection' - A New Era of Minimalist Living",
    category: "Product Launch",
    excerpt:
      "The latest collection focuses on sustainable materials and modular designs that adapt to any urban living space.",
  },
  {
    date: "March 05, 2026",
    title: "Tiger Balm Named Top Sustainable Furniture Brand of the Year",
    category: "Award",
    excerpt:
      "Recognized for our commitment to zero-waste manufacturing and ethical sourcing practices across our global supply chain.",
  },
  {
    date: "February 18, 2026",
    title:
      "Expanding the Horizon: Tiger Balm Opens New Design Studio in Copenhagen",
    category: "Company News",
    excerpt:
      "A new hub for Scandinavian design influence and collaborative craftsmanship in the heart of Denmark.",
  },
];

const featuredIn = [
  {
    name: "Vogue Living",
    logo: "VOGUE",
    quote: "Redefining the modern home with soul and sustainability.",
  },
  {
    name: "Architectural Digest",
    logo: "AD",
    quote: "The perfect balance of form, function, and eco-consciousness.",
  },
  {
    name: "Dwell",
    logo: "dwell",
    quote: "Furniture that tells a story of craftsmanship and heritage.",
  },
  {
    name: "Elle Decor",
    logo: "ELLE",
    quote: "Timeless pieces that feel both contemporary and classic.",
  },
];

export default function PressPage() {
  return (
    <div className="bg-[#F9F8F6] text-[#2C2926]">
      {/* Hero Section */}
      <section className="py-24 md:py-40 bg-[#EBE7DF] border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <p className="text-sm tracking-[0.4em] uppercase mb-6 font-bold text-[#8B857A]">
              Newsroom
            </p>
            <h1 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter mb-10 font-outfit leading-none">
              Press
            </h1>
            <p className="text-2xl md:text-3xl text-[#5C574F] leading-tight font-light">
              Stories of craftsmanship, sustainability, and the evolution of
              modern living.
            </p>
          </div>
        </div>
      </section>

      {/* Featured In / Logos */}
      <section className="py-20 border-b border-[#E5E0D8] bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-60">
            {featuredIn.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <span className="text-3xl md:text-4xl font-black tracking-tighter mb-4 group-hover:text-[#2C2926] transition-colors">
                  {item.logo}
                </span>
                <p className="text-xs uppercase tracking-widest font-bold text-[#8B857A]">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-bold uppercase tracking-tight">
              Latest Releases
            </h2>
            <div className="h-px bg-[#E5E0D8] flex-1 mx-8 hidden md:block" />
            <Button
              variant="outline"
              className="rounded-none border-[#2C2926] text-xs uppercase font-bold tracking-widest px-8"
            >
              Archive
            </Button>
          </div>

          <div className="grid gap-12">
            {pressReleases.map((release, idx) => (
              <div
                key={idx}
                className="group grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-8 pb-12 border-b border-[#E5E0D8] last:border-0 last:pb-0"
              >
                <div className="text-[#8B857A] font-bold text-sm uppercase tracking-widest pt-1">
                  {release.date}
                </div>
                <div>
                  <div className="inline-block px-3 py-1 bg-[#EBE7DF] text-[10px] font-bold uppercase tracking-widest mb-4">
                    {release.category}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 group-hover:text-stone-600 transition-colors leading-tight">
                    {release.title}
                  </h3>
                  <p className="text-[#5C574F] text-lg leading-relaxed mb-6 max-w-3xl">
                    {release.excerpt}
                  </p>
                  <button className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs border-b-2 border-[#2C2926] pb-1 hover:text-[#8B857A] hover:border-[#8B857A] transition-all">
                    Read Story <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Assets Section */}
      <section className="py-24 bg-[#2C2926] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-8">
                Media Assets.
              </h2>
              <p className="text-stone-400 text-lg mb-12 leading-relaxed">
                Access our high-resolution imagery, brand guidelines, and
                executive bios. For specific media inquiries, please reach out
                to our PR team.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button className="h-16 bg-white text-[#2C2926] hover:bg-stone-200 rounded-none uppercase font-bold tracking-widest text-xs flex items-center justify-center gap-3">
                  <Download className="w-4 h-4" /> Download Brand Kit
                </Button>
                <Button
                  variant="outline"
                  className="h-16 border-stone-700 text-white hover:bg-stone-800 rounded-none uppercase font-bold tracking-widest text-xs flex items-center justify-center gap-3"
                >
                  <Newspaper className="w-4 h-4" /> Image Library
                </Button>
              </div>
            </div>
            <div className="bg-stone-800 p-12 relative overflow-hidden group">
              <Quote className="absolute -top-10 -left-10 w-40 h-40 text-white/5" />
              <h3 className="text-2xl font-bold uppercase mb-6 relative z-10">
                Press Inquiry
              </h3>
              <p className="text-stone-400 mb-8 relative z-10 leading-relaxed">
                Are you a journalist or editor working on a story? We'd love to
                provide you with everything you need.
              </p>
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center gap-4 p-4 border border-stone-700 hover:border-stone-500 transition-colors">
                  <MessageSquare className="w-5 h-5 text-stone-500" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
                      Contact
                    </p>
                    <p className="text-sm font-medium">press@tigerbalm.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
