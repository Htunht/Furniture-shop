import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  Clock,
  Box,
  Search,
  Phone,
  Mail,
  Package,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Truck,
  User,
  Navigation,
  AlertTriangle,
  XCircle,
  Headphones,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { getImageSrc, API_BASE_URL } from "@/lib/utils";

const defaultOrderSteps = [
  {
    status: "Order Placed",
    date: "April 22, 2026",
    time: "10:30 AM",
    completed: true,
    description: "Your order has been received and is being prepared."
  },
  {
    status: "Processing",
    date: "April 23, 2026",
    time: "02:15 PM",
    completed: true,
    description: "Our craftsmen are selecting and inspecting your pieces."
  },
  {
    status: "Shipped",
    date: "April 24, 2026",
    time: "09:00 AM",
    completed: true,
    description: "Package has been handed over to Tiger Express."
  },
  {
    status: "In Transit",
    date: "In Progress",
    time: "Updating",
    completed: false,
    active: true,
    description: "Your package is currently moving towards the local distribution center."
  },
  {
    status: "Delivered",
    date: "Estimated April 28",
    time: "By 8:00 PM",
    completed: false,
    description: "Signature will be required upon delivery."
  },
];

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [showResult, setShowResult] = useState(!!searchParams.get("id"));
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let intervalId: any;

    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/order/track/${orderId.replace("#", "")}`);
        if (res.ok) {
          const data = await res.json();
          setOrderData({
            id: data.orderNumber,
            date: new Date(data.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
            rawCreatedAt: data.createdAt,
            total: data.totalAmount,
            status: data.status,
            paymentStatus: data.paymentStatus,
            paymentMethod: data.paymentMethod,
            customerName: data.customerName,
            address: data.address,
            updatedAt: data.updatedAt,
            items: data.items.map((i: any) => ({
              name: i.name,
              image: i.image || getImageSrc(i.product?.imageUrl),
              quantity: i.quantity,
              discount: i.price,
            }))
          });
          setError("");
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order status");
      }
      setIsLoading(false);
    };

    if (showResult && orderId) {
      setIsLoading(true);
      fetchOrder();
      // Poll every 3 seconds for real-time updates
      intervalId = setInterval(fetchOrder, 3000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showResult, orderId]);

  const getDynamicSteps = (currentStatus: string, createdAt: string, updatedAt: string) => {
    const statuses = ['PENDING', 'PLACED', 'PROCESSING', 'SHIPPED', 'TRANSIT', 'DELIVERED'];
    // Normalize status, treat PENDING as PLACED or index 0
    let currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex === -1) currentIndex = statuses.indexOf('CANCELLED');
    if (currentIndex === 0) currentIndex = 1; // Map PENDING to PLACED visually
    
    // Standard UI stages
    const uiStages = [
      { id: 'PLACED', title: 'Order Placed', desc: 'Your order has been received and is being prepared.' },
      { id: 'PROCESSING', title: 'Processing', desc: 'Our craftsmen are selecting and inspecting your pieces.' },
      { id: 'SHIPPED', title: 'Shipped', desc: 'Package has been handed over to Tiger Express.' },
      { id: 'TRANSIT', title: 'In Transit', desc: 'Your package is currently moving towards the local distribution center.' },
      { id: 'DELIVERED', title: 'Delivered', desc: 'Signature will be required upon delivery.' }
    ];

    return uiStages.map((stage, idx) => {
      const stageIndex = statuses.indexOf(stage.id);
      const isCompleted = currentIndex >= stageIndex;
      const isActive = currentIndex === stageIndex && currentStatus !== 'DELIVERED' && currentStatus !== 'CANCELLED';
      
      return {
        status: stage.title,
        date: isCompleted || isActive ? new Date(idx === 0 ? createdAt : updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Pending",
        time: isCompleted || isActive ? new Date(idx === 0 ? createdAt : updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "Updating",
        completed: isCompleted && !isActive,
        active: isActive,
        description: stage.desc
      };
    });
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) setShowResult(true);
  };

  return (
    <div className="bg-[#F9F8F6] text-[#2C2926] min-h-screen font-inter">
      {/* Search Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#EBE7DF_0%,_transparent_60%)] opacity-50" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#EBE7DF] opacity-20 blur-3xl -rotate-12 translate-x-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] tracking-[0.5em] uppercase mb-6 font-bold text-[#8B857A]">
              Logistic Excellence
            </p>
            <h1 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter mb-12 font-outfit leading-none">
              Track <span className="italic font-light text-[#8B857A]">Live</span>
            </h1>

            <form
              onSubmit={handleTrack}
              className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-0 shadow-2xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B857A]" />
                <Input
                  placeholder="Enter Order ID (e.g. #TB-88291)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="bg-white border-0 pl-16 h-20 rounded-none focus-visible:ring-0 text-xl font-medium placeholder:text-[#BBB] transition-all focus:bg-stone-50"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-20 px-12 bg-[#2C2926] text-white hover:bg-stone-800 rounded-none uppercase font-bold tracking-[0.2em] text-xs transition-all flex items-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Locating..." : "Track Status"}
                {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {showResult ? (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pb-32"
          >
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12">
                {/* Main Tracking Content */}
                <div className="space-y-12">
                  <div className="bg-white p-8 md:p-16 shadow-sm border border-[#E5E0D8]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`w-2 h-2 rounded-full animate-pulse ${orderData?.paymentStatus === "FAILED" ? "bg-red-500" : "bg-green-500"}`} />
                          <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${orderData?.paymentStatus === "FAILED" ? "text-red-600" : "text-[#8B857A]"}`}>
                            {orderData?.paymentStatus === "FAILED" ? "Payment Failed • Action Required" : "Live Update • Just Now"}
                          </p>
                        </div>
                        <h2 className="text-4xl font-bold font-outfit uppercase tracking-tighter">
                          #{orderId}
                        </h2>
                        {error && <p className="text-red-500 text-sm mt-2 font-bold">{error}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-8 text-right md:text-left">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B857A] mb-2">
                            Est. Delivery
                          </p>
                          <p className="font-bold text-lg uppercase">April 28, 2026</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B857A] mb-2">
                            Shipping Method
                          </p>
                          <p className="font-bold text-lg uppercase">Tiger White-Glove</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Failed Banner on Track Page */}
                    {orderData?.paymentStatus === "FAILED" && (
                      <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="bg-red-600 text-white px-8 py-4 flex items-center gap-3">
                          <AlertTriangle size={18} className="shrink-0 animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-[0.25em]">
                            Payment Verification Failed — Order On Hold
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-white border border-t-0 border-red-100 p-8">
                          <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                              <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 bg-red-100 flex items-center justify-center shrink-0">
                                  <XCircle size={28} className="text-red-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-black uppercase tracking-tight text-red-800 mb-2">
                                    Transaction Could Not Be Verified
                                  </h3>
                                  <p className="text-sm text-red-700/80 font-medium leading-relaxed">
                                    Our admin team was unable to confirm your payment. This may be due to incorrect
                                    KBZ Pay details, an incomplete transfer, or mismatched account information.
                                    Your order will remain on hold until the payment is resolved.
                                  </p>
                                </div>
                              </div>
                              <div className="bg-white border border-red-100 p-5 space-y-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600">Next Steps</p>
                                <ul className="space-y-2">
                                  {[
                                    "Contact support with your KBZ Pay transaction receipt.",
                                    "Provide the correct transaction number and account details.",
                                    "Once verified, your order will resume processing immediately.",
                                  ].map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-[11px] text-[#5C574F] font-medium">
                                      <span className="bg-red-500 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="md:w-56 flex flex-col gap-3">
                              <a
                                href="/contact"
                                className="flex items-center justify-center gap-3 h-14 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                              >
                                <Headphones size={16} />
                                Contact Support
                              </a>
                              <a
                                href="tel:+959777788888"
                                className="flex items-center justify-center gap-3 h-14 bg-white border-2 border-red-200 text-red-700 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                              >
                                <Phone size={16} />
                                Call Us
                              </a>
                              <a
                                href="mailto:support@tigerbalm.store"
                                className="flex items-center justify-center gap-3 h-14 bg-white border-2 border-red-200 text-red-700 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                              >
                                <MessageCircle size={16} />
                                Email Us
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Horizontal Progress Bar */}
                    <div className="relative mb-20 px-4">
                      <div className="absolute top-1/2 left-0 w-full h-px bg-[#EBE7DF] -translate-y-1/2" />
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-[#2C2926] -translate-y-1/2 transition-all duration-1000" 
                        style={{ 
                          width: orderData ? `${Math.min(100, Math.max(0, (['PENDING', 'PLACED', 'PROCESSING', 'SHIPPED', 'TRANSIT', 'DELIVERED'].indexOf(orderData.status === 'PENDING' ? 'PLACED' : orderData.status) - 1) * 25))}%` : '0%' 
                        }} 
                      />
                      <div className="relative flex justify-between">
                        {['Placed', 'Processing', 'Shipped', 'Transit', 'Delivered'].map((label, i) => {
                          const currentStatusIndex = orderData ? ['PENDING', 'PLACED', 'PROCESSING', 'SHIPPED', 'TRANSIT', 'DELIVERED'].indexOf(orderData.status === 'PENDING' ? 'PLACED' : orderData.status) - 1 : -1;
                          const isCompleted = currentStatusIndex > i;
                          const isActive = currentStatusIndex === i;
                          
                          return (
                          <div key={label} className="flex flex-col items-center gap-4">
                            <div className={`w-4 h-4 rounded-full border-4 ${
                              isCompleted ? 'bg-[#2C2926] border-[#2C2926]' : 
                              isActive ? 'bg-white border-[#2C2926] animate-pulse' : 
                              'bg-white border-[#EBE7DF]'
                            }`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isCompleted || isActive ? 'text-[#2C2926]' : 'text-[#8B857A]'}`}>
                              {label}
                            </span>
                          </div>
                        )})}
                      </div>
                    </div>

                    {/* Details List */}
                    <div className="space-y-10">
                      {(orderData ? getDynamicSteps(orderData.status, orderData.rawCreatedAt, orderData.updatedAt) : defaultOrderSteps).map((step, idx) => (
                        <div key={idx} className={`flex gap-8 ${!step.completed && !step.active ? 'opacity-40' : ''}`}>
                          <div className="w-16 text-right shrink-0 pt-1">
                            <p className="text-[10px] font-bold text-[#8B857A] uppercase leading-tight">
                              {step.date !== "Pending" ? (
                                <>
                                  {step.date.split(' ').slice(0, 2).join(' ').replace(',', '')}<br/>
                                  {step.time}
                                </>
                              ) : "Pending"}
                            </p>
                          </div>
                          <div className="relative flex-1 pb-16 border-l border-[#EBE7DF] pl-10 last:border-0 last:pb-0">
                            <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${step.completed ? 'bg-[#2C2926]' : step.active ? 'bg-white border-2 border-[#2C2926]' : 'bg-[#EBE7DF]'}`} />
                            <h3 className="text-lg font-bold uppercase tracking-tight mb-2 flex items-center gap-3">
                              {step.status}
                              {step.active && <span className="bg-[#2C2926] text-white text-[8px] px-2 py-0.5 tracking-widest">LIVE</span>}
                            </h3>
                            <p className="text-sm text-[#5C574F] font-medium max-w-lg leading-relaxed">
                              {step.description}
                            </p>
                            {step.active && step.status === "In Transit" && (
                              <div className="mt-6 flex items-center gap-4">
                                <div className="flex -space-x-2">
                                  {[1,2,3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-stone-200">
                                      <img src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B857A]">
                                  +2 specialists in your area
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 shadow-sm border border-[#E5E0D8] group hover:border-[#2C2926] transition-colors duration-500">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#F9F8F6] flex items-center justify-center text-[#2C2926]">
                          <User size={20} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest">Customer Details</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B857A] mb-1">Recipient</p>
                          <p className="text-lg font-bold font-outfit uppercase">{orderData?.customerName || "Valued Customer"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B857A] mb-1">Contact Status</p>
                          <p className="text-xs font-medium text-[#5C574F]">Primary phone and email verified for delivery.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-10 shadow-sm border border-[#E5E0D8] group hover:border-[#2C2926] transition-colors duration-500">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#F9F8F6] flex items-center justify-center text-[#2C2926]">
                          <Navigation size={20} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest">Delivery Destination</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B857A] mb-1">Shipping Address</p>
                          <p className="text-lg font-bold font-outfit uppercase leading-tight">
                            {orderData?.address || "123 Tiger Lane, Havenly Heights, NY 10001"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <MapPin size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Verified Location</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Note */}
                  <div className="bg-[#2C2926] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 flex items-center justify-center">
                        <Truck size={32} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1 text-stone-400">Logistics Partner</p>
                        <h4 className="text-xl font-bold font-outfit uppercase">Tiger White-Glove Express</h4>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Estimated Arrival</p>
                      <p className="text-2xl font-bold font-outfit italic">April 28, 2026</p>
                    </div>
                  </div>
                </div>

                {/* Sidebar Summary */}
                <aside className="space-y-12">
                  <div className="bg-[#2C2926] text-white p-12 shadow-2xl relative overflow-hidden group">
                    <Package className="absolute -right-10 -bottom-10 w-48 h-48 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                    <h3 className="text-2xl font-bold uppercase mb-10 tracking-tight font-outfit">
                      Order Details
                    </h3>
                    
                    <div className="space-y-8 relative z-10">
                      {orderData?.items ? (
                        orderData.items.map((item: any, i: number) => (
                          <div key={i} className="flex gap-6 group/item">
                            <div className="w-20 h-20 bg-stone-800 shrink-0 overflow-hidden border border-stone-700">
                              <img
                                src={item.image}
                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold uppercase tracking-widest leading-tight mb-2 truncate">
                                {item.name}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-stone-500 uppercase font-bold">Qty: {item.quantity}</span>
                                <span className="text-xs font-bold text-stone-300">${(item.discount * item.quantity).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center border-2 border-dashed border-stone-800">
                          <p className="text-xs text-stone-500 uppercase tracking-widest">Loading Items...</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-12 pt-10 border-t border-stone-800 relative z-10">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                          Purchase Date
                        </span>
                        <span className="text-xs font-bold">{orderData?.date || "April 25, 2026"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                          Total Investment
                        </span>
                        <span className="text-3xl font-bold font-outfit">${orderData?.total?.toLocaleString() || "1,429.00"}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-12 border ${orderData?.paymentStatus === "FAILED" ? "bg-red-50 border-red-200" : "bg-white border-[#E5E0D8]"}`}>
                    <h3 className={`text-xl font-bold uppercase mb-2 tracking-tight font-outfit ${orderData?.paymentStatus === "FAILED" ? "text-red-800" : ""}`}>
                      {orderData?.paymentStatus === "FAILED" ? "Urgent: Resolve Payment" : "Concierge Support"}
                    </h3>
                    {orderData?.paymentStatus === "FAILED" && (
                      <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest mb-6">
                        Your order is paused — please contact us
                      </p>
                    )}
                    {!orderData?.paymentStatus || orderData.paymentStatus !== "FAILED" ? (
                      <div className="space-y-4 mt-6">
                        <button className="w-full h-16 border border-[#2C2926] flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest hover:bg-[#2C2926] hover:text-white transition-all group">
                          <Phone size={16} className="group-hover:rotate-12 transition-transform" /> 
                          +1 (800) TIGER-LOG
                        </button>
                        <button className="w-full h-16 bg-[#F9F8F6] flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest hover:bg-[#EBE7DF] transition-all">
                          <Mail size={16} /> 
                          Direct Messaging
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <a href="/contact" className="w-full h-16 bg-red-600 text-white flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                          <Headphones size={18} /> 
                          Contact Support Now
                        </a>
                        <a href="tel:+959777788888" className="w-full h-14 border-2 border-red-200 text-red-700 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all">
                          <Phone size={16} /> 
                          +959 777 788 888
                        </a>
                        <a href="mailto:support@tigerbalm.store" className="w-full h-14 border-2 border-red-200 text-red-700 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all">
                          <Mail size={16} /> 
                          support@tigerbalm.store
                        </a>
                      </div>
                    )}
                    <div className={`mt-10 flex items-start gap-4 p-6 border-l-4 ${orderData?.paymentStatus === "FAILED" ? "bg-red-100/50 border-red-500" : "bg-[#F9F8F6] border-[#2C2926]"}`}>
                      <ShieldCheck className={`shrink-0 w-5 h-5 ${orderData?.paymentStatus === "FAILED" ? "text-red-600" : "text-[#2C2926]"}`} />
                      <p className={`text-[10px] font-bold uppercase tracking-widest leading-loose ${orderData?.paymentStatus === "FAILED" ? "text-red-700" : "text-[#5C574F]"}`}>
                        {orderData?.paymentStatus === "FAILED"
                          ? "Your order will not ship until payment is verified. Please reach out immediately."
                          : "Insured & Guaranteed by Havenly Shield™"}
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-32"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  {
                    icon: <Mail className="w-8 h-8" />,
                    title: "Check Inbox",
                    desc: "Find your digital receipt and tracking credentials."
                  },
                  {
                    icon: <Clock className="w-8 h-8" />,
                    title: "24h Processing",
                    desc: "Handcrafted orders require careful preparation before transit."
                  },
                  {
                    icon: <Box className="w-8 h-8" />,
                    title: "Global Reach",
                    desc: "Our logistics network spans across prime global locations."
                  }
                ].map((item, i) => (
                  <div key={i} className="p-12 border border-[#E5E0D8] bg-white group hover:border-[#2C2926] transition-all duration-500">
                    <div className="mb-10 text-[#8B857A] group-hover:text-[#2C2926] transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-6 tracking-tight font-outfit">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#5C574F] leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
