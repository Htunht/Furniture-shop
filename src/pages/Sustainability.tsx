import { Leaf, Recycle, Wind, TreePine, Globe } from "lucide-react";

const commitments = [
  {
    icon: <TreePine className="w-8 h-8" />,
    title: "Sustainably Sourced Wood",
    description:
      "100% of our wood is FSC-certified, ensuring it comes from responsibly managed forests that provide environmental, social, and economic benefits.",
  },
  {
    icon: <Recycle className="w-8 h-8" />,
    title: "Circular Design",
    description:
      "We design for longevity and easy disassembly. At the end of its life, every Tiger Balm piece can be recycled or repurposed.",
  },
  {
    icon: <Wind className="w-8 h-8" />,
    title: "Carbon Neutral Shipping",
    description:
      "We offset the carbon emissions of every delivery by investing in verified reforestation and renewable energy projects worldwide.",
  },
];

const materials = [
  {
    name: "Organic Linen",
    origin: "Belgium",
    benefit:
      "Requires 60% less water than cotton and zero synthetic pesticides.",
  },
  {
    name: "Recycled Steel",
    origin: "USA",
    benefit:
      "Sourced from 85% post-consumer scrap, reducing energy use by 75%.",
  },
  {
    name: "Water-Based Finishes",
    origin: "Italy",
    benefit:
      "Ultra-low VOC emissions for healthier indoor air quality in your home.",
  },
];

export default function SustainabilityPage() {
  return (
    <div className="bg-[#F9F8F6] text-[#2C2926]">
      {/* Immersive Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/sustainability-hero.png"
            alt="Forest"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <p className="text-sm tracking-[0.5em] uppercase mb-6 font-bold text-stone-300">
            Our Responsibility
          </p>
          <h1 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter mb-8 font-outfit leading-none">
            Kind to <br /> the Earth
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl font-light text-stone-200">
            We believe that beautiful design shouldn't come at the cost of the
            planet.
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/60 animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
            Scroll to Explore
          </span>
          <div className="w-px h-12 bg-white/20" />
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Leaf className="w-12 h-12 mx-auto mb-10 text-green-800" />
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-12">
              Built to last, <br /> not to be replaced.
            </h2>
            <p className="text-2xl text-[#5C574F] leading-relaxed font-light italic">
              "Our philosophy is simple: create furniture that lasts for
              generations, using materials that respect the ecosystem they came
              from. We aren't just making furniture; we're protecting the future
              of home."
            </p>
            <div className="mt-12 font-bold uppercase tracking-widest text-sm text-[#8B857A]">
              — The Tiger Balm Design Collective
            </div>
          </div>
        </div>
      </section>

      {/* Commitments Grid */}
      <section className="py-24 bg-[#EBE7DF]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {commitments.map((item, idx) => (
              <div key={idx} className="group">
                <div className="mb-8 text-[#2C2926] group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold uppercase mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[#5C574F] leading-relaxed text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-12 leading-none">
                Transparency <br /> in every fiber.
              </h2>
              <div className="space-y-12">
                {materials.map((material, idx) => (
                  <div key={idx} className="border-l-4 border-[#2C2926] pl-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#8B857A]">
                        {material.origin}
                      </span>
                      <Globe className="w-3 h-3 text-[#8B857A]" />
                    </div>
                    <h4 className="text-2xl font-bold uppercase tracking-tight mb-2">
                      {material.name}
                    </h4>
                    <p className="text-[#5C574F] text-lg">{material.benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <img
                src="/sustainability-materials.png"
                alt="Materials"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute -bottom-10 -left-10 bg-[#2C2926] text-white p-12 hidden md:block">
                <div className="text-5xl font-bold font-outfit mb-2">0%</div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400">
                  Waste Policy by 2028
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-[#2C2926] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-bold font-outfit mb-2">
                50k+
              </div>
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500">
                Trees Planted
              </p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold font-outfit mb-2">
                100%
              </div>
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500">
                Renewable Energy
              </p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold font-outfit mb-2">
                0
              </div>
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500">
                Single-Use Plastics
              </p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold font-outfit mb-2">
                30yr
              </div>
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500">
                Avg. Product Life
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
