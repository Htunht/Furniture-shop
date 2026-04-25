import { useState } from "react";
import {
  Droplets,
  Sun,
  Wind,
  Sparkles,
  ShieldCheck,
  PenTool as Tool,
} from "lucide-react";

const guides = [
  {
    id: "wood",
    title: "Solid Wood",
    description:
      "Our wood furniture is crafted to last generations. Natural variations in grain and color are part of its unique beauty.",
    tips: [
      {
        icon: <Sun className="w-5 h-5" />,
        title: "Avoid Direct Sunlight",
        content:
          "Prolonged exposure can cause wood to fade or crack. Position pieces away from windows or use curtains.",
      },
      {
        icon: <Droplets className="w-5 h-5" />,
        title: "Manage Humidity",
        content:
          "Wood breathes. Maintain a consistent indoor humidity level (40-50%) to prevent warping or splitting.",
      },
      {
        icon: <Sparkles className="w-5 h-5" />,
        title: "Dust Regularly",
        content:
          "Use a soft, dry lint-free cloth. Dusting prevents build-up that can scratch the finish over time.",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80",
  },
  {
    id: "fabric",
    title: "Upholstery",
    description:
      "From performance linens to plush velvets, our fabrics are selected for durability and comfort.",
    tips: [
      {
        icon: <Wind className="w-5 h-5" />,
        title: "Vacuum Weekly",
        content:
          "Use a soft brush attachment to remove dust and allergens that can break down fabric fibers.",
      },
      {
        icon: <Droplets className="w-5 h-5" />,
        title: "Blot, Don't Rub",
        content:
          "For spills, blot immediately with a clean, white cloth. Rubbing can push the stain deeper.",
      },
      {
        icon: <Tool className="w-5 h-5" />,
        title: "Rotate Cushions",
        content:
          "Flip and rotate seat and back cushions regularly to ensure even wear and maintain shape.",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80",
  },
  {
    id: "leather",
    title: "Top-Grain Leather",
    description:
      "Leather develops a beautiful patina over time. It's a natural material that evolves with use.",
    tips: [
      {
        icon: <ShieldCheck className="w-5 h-5" />,
        title: "Condition Bi-annually",
        content:
          "Apply a high-quality leather conditioner every 6-12 months to keep it supple and prevent drying.",
      },
      {
        icon: <Sun className="w-5 h-5" />,
        title: "Keep Cool",
        content:
          "Heat sources like radiators or fireplaces can dry out leather. Keep at least 2 feet of distance.",
      },
      {
        icon: <Sparkles className="w-5 h-5" />,
        title: "Gentle Cleaning",
        content:
          "Wipe with a clean, dry cloth. For deeper cleans, use only products specifically for top-grain leather.",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1549497538-301288c8533a?auto=format&fit=crop&q=80",
  },
];

export default function CareGuidePage() {
  const [activeTab, setActiveTab] = useState("wood");

  const activeGuide = guides.find((g) => g.id === activeTab) || guides[0];

  return (
    <div className="bg-[#F9F8F6] text-[#2C2926]">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-[#EBE7DF] border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm tracking-[0.4em] uppercase mb-4 font-bold text-[#8B857A]">
            Product Longevity
          </p>
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-8 font-outfit">
            Care Guide
          </h1>
          <p className="max-w-2xl mx-auto text-[#5C574F] text-lg md:text-xl leading-relaxed">
            Protect your investment and keep your Tiger Balm pieces looking
            beautiful for years to come with our expert maintenance tips.
          </p>
        </div>
      </section>

      {/* Guide Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="w-full">
            <div className="flex justify-center mb-16">
              <div className="bg-[#EBE7DF] p-1 flex">
                {guides.map((guide) => (
                  <button
                    key={guide.id}
                    onClick={() => setActiveTab(guide.id)}
                    className={`px-8 py-4 uppercase font-bold tracking-widest text-xs transition-all ${
                      activeTab === guide.id
                        ? "bg-[#2C2926] text-white"
                        : "text-[#2C2926] hover:bg-[#D6D0C4]"
                    }`}
                  >
                    {guide.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative group overflow-hidden">
                  <img
                    src={activeGuide.image}
                    alt={activeGuide.title}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none" />
                </div>

                <div>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
                    {activeGuide.title} Care.
                  </h2>
                  <p className="text-[#5C574F] text-xl leading-relaxed mb-12 border-l-4 border-[#2C2926] pl-6">
                    {activeGuide.description}
                  </p>

                  <div className="grid gap-10">
                    {activeGuide.tips.map((tip, idx) => (
                      <div key={idx} className="flex gap-6 items-start">
                        <div className="bg-[#EBE7DF] p-4 shrink-0 text-[#2C2926]">
                          {tip.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold uppercase tracking-tight mb-2">
                            {tip.title}
                          </h4>
                          <p className="text-[#5C574F] leading-relaxed">
                            {tip.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-16 pt-10 border-t border-[#E5E0D8]">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B857A] mb-4">
                      Need specific advice?
                    </p>
                    <button className="text-[#2C2926] font-bold underline hover:text-stone-600 transition-colors">
                      Download Detailed PDF Guide →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* General Maintenance Section */}
      <section className="py-24 bg-[#2C2926] text-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-12">
              Universal Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <div className="text-4xl font-bold text-stone-500 mb-4 font-outfit">
                  01
                </div>
                <h4 className="text-xl font-bold uppercase mb-4 tracking-tight">
                  Lift, Don't Drag
                </h4>
                <p className="text-stone-400">
                  Always lift furniture when moving it to avoid damage to the
                  legs and your flooring.
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-stone-500 mb-4 font-outfit">
                  02
                </div>
                <h4 className="text-xl font-bold uppercase mb-4 tracking-tight">
                  Use Coasters
                </h4>
                <p className="text-stone-400">
                  Protect surfaces from heat and moisture rings by always using
                  felt-backed coasters.
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-stone-500 mb-4 font-outfit">
                  03
                </div>
                <h4 className="text-xl font-bold uppercase mb-4 tracking-tight">
                  Avoid Chemicals
                </h4>
                <p className="text-stone-400">
                  Stick to water or mild soaps. Harsh chemicals can strip
                  finishes and damage fibers.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </section>
    </div>
  );
}
