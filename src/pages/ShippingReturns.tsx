import { Truck, Package, RefreshCcw, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

const shippingSteps = [
  {
    icon: <Package className="w-8 h-8" />,
    title: "Order Processing",
    time: "24-48 Hours",
    description: "Our workshop team carefully prepares and quality-checks your piece for its journey."
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "In Transit",
    time: "3-7 Business Days",
    description: "Real-time tracking updates sent via SMS and email as your order moves through our network."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "White Glove Delivery",
    time: "Scheduled Window",
    description: "Premium delivery including room-of-choice placement and removal of all packaging."
  }
];

const shippingRates = [
  { region: "Domestic (US)", small: "$15", furniture: "$149", threshold: "$2,500+" },
  { region: "Canada & Mexico", small: "$25", furniture: "$249", threshold: "$3,500+" },
  { region: "Europe & UK", small: "$35", furniture: "$349", threshold: "$5,000+" }
];

export default function ShippingReturnsPage() {
  return (
    <div className="bg-[#F9F8F6] text-[#2C2926]">
      {/* Header */}
      <section className="py-24 bg-[#EBE7DF] border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-8 font-outfit">
              Delivery & <br /> Returns
            </h1>
            <p className="text-xl md:text-2xl text-[#5C574F] leading-relaxed">
              We've refined our logistics to ensure your new furniture arrives safely, swiftly, and with zero hassle.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Process */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-sm tracking-[0.4em] uppercase mb-16 font-bold text-[#8B857A] text-center">The Journey of Your Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 relative">
            <div className="absolute top-1/3 left-0 w-full h-px bg-[#E5E0D8] hidden md:block -z-10" />
            {shippingSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center bg-[#F9F8F6] px-4">
                <div className="w-20 h-20 bg-white border border-[#E5E0D8] flex items-center justify-center mb-8 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold uppercase mb-2 tracking-tight">{step.title}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8B857A] mb-4">{step.time}</p>
                <p className="text-[#5C574F] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Rates Table */}
      <section className="py-24 bg-white border-y border-[#E5E0D8]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold uppercase tracking-tight mb-4">Shipping Rates</h2>
            <p className="text-[#5C574F]">Transparent pricing for every destination.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#2C2926]">
                  <th className="py-6 text-xs font-bold uppercase tracking-widest text-[#8B857A]">Region</th>
                  <th className="py-6 text-xs font-bold uppercase tracking-widest text-[#8B857A]">Small Items</th>
                  <th className="py-6 text-xs font-bold uppercase tracking-widest text-[#8B857A]">Furniture</th>
                  <th className="py-6 text-xs font-bold uppercase tracking-widest text-[#8B857A]">Free Over</th>
                </tr>
              </thead>
              <tbody>
                {shippingRates.map((rate, idx) => (
                  <tr key={idx} className="border-b border-[#E5E0D8] group hover:bg-[#F9F8F6] transition-colors">
                    <td className="py-8 font-bold uppercase tracking-tight">{rate.region}</td>
                    <td className="py-8 text-[#5C574F]">{rate.small}</td>
                    <td className="py-8 text-[#5C574F]">{rate.furniture}</td>
                    <td className="py-8">
                      <span className="bg-[#EBE7DF] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                        {rate.threshold}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Returns Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex items-center gap-4 mb-8 text-orange-600">
                <RefreshCcw className="w-8 h-8" />
                <span className="text-sm font-bold uppercase tracking-[0.3em]">30-Day Guarantee</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-8">Not quite right? <br /> No problem.</h2>
              <p className="text-[#5C574F] text-lg mb-10 leading-relaxed">
                We want you to love your space. If your piece doesn't feel like home, you have 30 days to return it in its original condition. We'll handle the pick-up and processing for a flat fee.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 shrink-0 text-[#2C2926]" />
                  <p className="font-bold uppercase tracking-tight">Full refund to original payment method</p>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 shrink-0 text-[#2C2926]" />
                  <p className="font-bold uppercase tracking-tight">Easy scheduled pick-up for large items</p>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 shrink-0 text-[#2C2926]" />
                  <p className="font-bold uppercase tracking-tight">Free exchanges for items of equal value</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#2C2926] text-white p-12 md:p-20 relative overflow-hidden">
              <h3 className="text-3xl font-bold uppercase mb-8 relative z-10">Start a Return</h3>
              <p className="text-stone-400 mb-10 relative z-10">
                Have your order number and email address ready. Our automated portal will guide you through the next steps.
              </p>
              <div className="space-y-4 relative z-10">
                <input 
                  type="text" 
                  placeholder="Order Number (e.g. #TB-12345)"
                  className="w-full h-14 bg-stone-800 border-none px-6 text-sm focus:ring-1 focus:ring-white outline-none"
                />
                <button className="w-full h-14 bg-white text-[#2C2926] uppercase font-bold tracking-widest text-xs hover:bg-stone-200 transition-colors">
                  Check Eligibility
                </button>
              </div>
              <div className="mt-12 flex items-center gap-2 text-stone-500 text-xs uppercase tracking-widest font-bold">
                <Clock className="w-4 h-4" /> Average Processing: 3-5 Days
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
