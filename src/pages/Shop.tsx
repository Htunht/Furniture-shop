import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const shopCategories = [
  {
    id: "living-room",
    title: "Living Room",
    subtitle: "Sanctuaries of Comfort",
    image: "/living-room-hero.png",
    description:
      "From plush sofas to artisanal coffee tables, discover pieces designed for the heart of your home.",
    count: 24,
    color: "bg-[#F9F8F6]",
  },
  {
    id: "bedroom",
    title: "Bedroom",
    subtitle: "Dream in Serenity",
    image: "/bedroom-hero.png",
    description:
      "Create your private retreat with our hand-crafted beds, soft linens, and tranquil storage solutions.",
    count: 18,
    color: "bg-[#F0F4F8]",
  },
  {
    id: "dining",
    title: "Dining",
    subtitle: "The Art of Gathering",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80",
    description:
      "Elegant tables and supportive seating that set the stage for unforgettable meals and conversations.",
    count: 12,
    color: "bg-[#FFF9F0]",
  }, 
  {
    id: "workspace",
    title: "Workspace",
    subtitle: "Precision & Focus",
    image: "/workspace-hero.png",
    description:
      "Elevate your productivity with desks and ergonomic chairs that blend professional functionality with home warmth.",
    count: 15,
    color: "bg-[#F4F4F4]",
  },
  {
    id: "accessories",
    title: "Accessories",
    subtitle: "The Finishing Touch",
    image:
      "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80",
    description:
      "Curated accents, rugs, and lighting to add that final layer of personality and warmth to any room.",
    count: 42,
    color: "bg-[#FAF5FF]",
  },
];

export default function ShopPage() {
  return (
    <div className="bg-[#F9F8F6] text-[#2C2926]">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-[#EBE7DF] border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm tracking-[0.4em] uppercase mb-4 font-bold text-[#8B857A]">Tiger Balm Collections</p>
          <h1 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter mb-8 font-outfit leading-none">
            Our Shop
          </h1>
          <p className="max-w-2xl mx-auto text-[#5C574F] text-lg md:text-xl leading-relaxed">
            Every piece is a testament to craftsmanship and comfort. Explore our curated collections designed for every corner of your life.
          </p>
        </div>
      </section>

      {/* Category List */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-24">
            {shopCategories.map((cat, idx) => (
              <Link 
                key={cat.id} 
                to={`/shop/${cat.id}`}
                className="group relative overflow-hidden"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20 p-8 md:p-16 ${cat.color} transition-all duration-700 hover:shadow-2xl`}>
                  <div className={`${idx % 2 !== 0 ? 'lg:order-last' : ''} relative aspect-[4/3] overflow-hidden`}>
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 border-[20px] border-white/10 group-hover:border-white/20 transition-all pointer-events-none" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-4 mb-6 text-[#8B857A]">
                      <span className="text-sm font-bold uppercase tracking-[0.3em]">{cat.subtitle}</span>
                      <div className="h-px w-12 bg-[#8B857A]/30" />
                      <span className="text-xs font-bold uppercase tracking-widest">{cat.count} Items</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 leading-none">
                      {cat.title}.
                    </h2>
                    <p className="text-xl text-[#5C574F] leading-relaxed mb-10 max-w-md">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-4 text-[#2C2926] font-bold uppercase tracking-widest text-sm border-b-2 border-[#2C2926] pb-2 w-fit transition-all group-hover:gap-8 group-hover:text-stone-500 group-hover:border-stone-500">
                      Explore Collection <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Promo */}
      <section className="py-24 bg-[#2C2926] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-8">The Autumn Edit</h2>
            <p className="text-stone-400 text-lg mb-12">Our limited edition seasonal pieces are here. Warm textures, deep palettes, and unmatched comfort for the cooler months.</p>
            <Button className="h-14 px-12 bg-white text-[#2C2926] hover:bg-stone-200 rounded-none uppercase font-bold tracking-widest text-xs">
              View Seasonal Collection
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
