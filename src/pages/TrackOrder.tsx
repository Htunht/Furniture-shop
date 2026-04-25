import { useState } from "react";
import {
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Box,
  ChevronRight,
  Search,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const orderSteps = [
  {
    status: "Order Placed",
    date: "April 22, 2026",
    time: "10:30 AM",
    completed: true,
  },
  {
    status: "Processing",
    date: "April 23, 2026",
    time: "02:15 PM",
    completed: true,
  },
  {
    status: "Shipped",
    date: "April 24, 2026",
    time: "09:00 AM",
    completed: true,
  },
  {
    status: "In Transit",
    date: "In Progress",
    time: "Updating",
    completed: false,
    active: true,
  },
  {
    status: "Delivered",
    date: "Estimated April 28",
    time: "By 8:00 PM",
    completed: false,
  },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) setShowResult(true);
  };

  return (
    <div className="bg-[#F9F8F6] text-[#2C2926] min-h-screen">
      {/* Search Hero */}
      <section className="py-20 md:py-32 bg-[#EBE7DF] border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm tracking-[0.4em] uppercase mb-4 font-bold text-[#8B857A]">
            Real-Time Logistics
          </p>
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-12 font-outfit">
            Track Order
          </h1>

          <form
            onSubmit={handleTrack}
            className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B857A]" />
              <Input
                placeholder="Enter Order ID (e.g. #TB-88291)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="bg-white border-[#E5E0D8] pl-12 h-14 rounded-none focus-visible:ring-[#2C2926] shadow-sm text-lg"
              />
            </div>
            <Button
              type="submit"
              className="h-14 px-10 bg-[#2C2926] text-white hover:bg-stone-700 rounded-none uppercase font-bold tracking-widest text-xs transition-all"
            >
              Track Status
            </Button>
          </form>
          <p className="mt-6 text-sm text-[#5C574F]">
            Check your confirmation email for the tracking number.
          </p>
        </div>
      </section>

      {showResult ? (
        <section className="py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Tracking View */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white border border-[#E5E0D8] p-8 md:p-12 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-[#E5E0D8]">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#8B857A] mb-1">
                        Order ID
                      </p>
                      <h2 className="text-2xl font-bold font-outfit">
                        {orderId}
                      </h2>
                    </div>
                    <div className="flex gap-12">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#8B857A] mb-1">
                          Estimated Delivery
                        </p>
                        <p className="font-bold">April 28, 2026</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#8B857A] mb-1">
                          Carrier
                        </p>
                        <p className="font-bold">Tiger Express</p>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="relative space-y-12">
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#EBE7DF]" />

                    {orderSteps.map((step, idx) => (
                      <div key={idx} className="relative flex gap-8 group">
                        <div
                          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${
                            step.completed
                              ? "bg-[#2C2926] text-white"
                              : step.active
                                ? "bg-white border-4 border-[#2C2926]"
                                : "bg-[#EBE7DF] text-[#8B857A]"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 size={16} />
                          ) : step.active ? (
                            <Truck size={14} className="text-[#2C2926]" />
                          ) : (
                            <Box size={14} />
                          )}
                        </div>

                        <div className="flex-1 pb-2">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <h3
                              className={`text-xl font-bold uppercase tracking-tight ${step.active ? "text-[#2C2926]" : step.completed ? "text-[#2C2926]" : "text-[#8B857A]"}`}
                            >
                              {step.status}
                            </h3>
                            <div className="text-sm">
                              <span className="font-bold text-[#2C2926]">
                                {step.date}
                              </span>
                              <span className="mx-2 text-[#8B857A]">•</span>
                              <span className="text-[#8B857A]">
                                {step.time}
                              </span>
                            </div>
                          </div>
                          {step.active && (
                            <div className="mt-4 p-4 bg-[#F9F8F6] border-l-4 border-[#2C2926]">
                              <p className="text-sm text-[#5C574F] leading-relaxed">
                                Your package is currently at our regional
                                distribution center in New Jersey and is being
                                prepared for local delivery.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Mockup */}
                <div className="relative h-96 bg-[#EBE7DF] overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80"
                    alt="Map"
                    className="w-full h-full object-cover opacity-40 grayscale"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#2C2926] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                        Driver is 12 miles away
                      </div>
                      <div className="w-12 h-12 bg-[#2C2926] rounded-full flex items-center justify-center text-white shadow-2xl animate-pulse">
                        <Truck size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 bg-white p-6 shadow-xl border border-[#E5E0D8]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <MapPin className="text-[#8B857A]" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B857A]">
                            Last Seen
                          </p>
                          <p className="text-sm font-bold">
                            Trenton Logistics Hub, NJ
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="text-[#EBE7DF]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Summary & Contact */}
              <div className="space-y-8">
                <div className="bg-[#2C2926] text-white p-10">
                  <h3 className="text-xl font-bold uppercase mb-6 tracking-tight">
                    Order Summary
                  </h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-stone-800 shrink-0 border border-stone-700">
                        <img
                          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight">
                          Oak Dining Chair
                        </p>
                        <p className="text-xs text-stone-500">
                          Qty: 4 • Natural Finish
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-stone-800 shrink-0 border border-stone-700">
                        <img
                          src="https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight">
                          Minimalist Side Table
                        </p>
                        <p className="text-xs text-stone-500">
                          Qty: 1 • Solid Walnut
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-stone-800 flex justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
                      Total
                    </span>
                    <span className="font-bold">$1,429.00</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E0D8] p-10">
                  <h3 className="text-xl font-bold uppercase mb-6 tracking-tight">
                    Need Help?
                  </h3>
                  <p className="text-sm text-[#5C574F] mb-8 leading-relaxed">
                    If you have questions about your delivery or need to
                    reschedule, our logistics team is standing by.
                  </p>
                  <div className="space-y-4">
                    <button className="w-full h-12 border border-[#E5E0D8] flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest hover:bg-[#F9F8F6] transition-colors">
                      <Phone size={14} /> Call Support
                    </button>
                    <button className="w-full h-12 border border-[#E5E0D8] flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest hover:bg-[#F9F8F6] transition-colors">
                      <Mail size={14} /> Email Us
                    </button>
                  </div>
                </div>

                <div className="p-8 bg-[#EBE7DF] border-l-4 border-[#2C2926]">
                  <Clock className="w-6 h-6 mb-4" />
                  <h4 className="font-bold uppercase text-xs mb-2 tracking-widest">
                    Delivery Hours
                  </h4>
                  <p className="text-xs text-[#5C574F] leading-relaxed">
                    Mon - Sat: 8:00 AM - 8:00 PM
                    <br />
                    Sun: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-12 border border-[#E5E0D8] bg-white group hover:border-[#2C2926] transition-all cursor-pointer">
                <Mail className="w-10 h-10 mb-8 text-[#8B857A] group-hover:text-[#2C2926] transition-colors" />
                <h3 className="text-2xl font-bold uppercase mb-4 tracking-tight">
                  Check Confirmation
                </h3>
                <p className="text-[#5C574F] leading-relaxed">
                  We sent a tracking number to your email as soon as your order
                  was shipped. Search "Tiger Balm Order" in your inbox.
                </p>
              </div>
              <div className="p-12 border border-[#E5E0D8] bg-white group hover:border-[#2C2926] transition-all cursor-pointer">
                <Clock className="w-10 h-10 mb-8 text-[#8B857A] group-hover:text-[#2C2926] transition-colors" />
                <h3 className="text-2xl font-bold uppercase mb-4 tracking-tight">
                  Processing Time
                </h3>
                <p className="text-[#5C574F] leading-relaxed">
                  Most orders take 24-48 hours to process. If you haven't
                  received a tracking number yet, your order is likely still in
                  preparation.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
