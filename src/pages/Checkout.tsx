import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Truck,
  ShieldCheck,
  ChevronLeft,
  CreditCard as PaymentIcon,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";

export default function CheckoutPage() {
  const { data: session, isPending } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ")[1] || "",
    email: session?.user?.email || "",
    phone: "",
    country: "Myanmar",
    city: "",
    street: "",
    shippingAddress: "",
  });

  const subtotal = getTotalPrice();
  const shippingFee = subtotal > 2500 ? 0 : 150;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/track-order");
    }, 2000);
  };

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9F8F6]">
        <Spinner className="h-12 w-12 text-[#2C2926]" />
      </div>
    );
  }

  if (!session) {
    navigate("/login");
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center px-4 bg-[#F9F8F6]">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4 font-outfit">
          Your Cart is Empty.
        </h1>
        <p className="text-[#8B857A] mb-8 font-medium">
          Add some sanctuary pieces before checking out.
        </p>
        <Link to="/shop">
          <Button className="rounded-none h-14 px-12 bg-[#2C2926] uppercase font-bold tracking-widest text-xs">
            Return to Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2C2926] pb-24 pt-32">
      <div className="container mx-auto px-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8B857A] hover:text-[#2C2926] transition-colors mb-12"
        >
          <ChevronLeft size={14} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20">
          {/* Checkout Form */}
          <div className="space-y-16">
            <header>
              <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4 font-outfit">
                Checkout.
              </h1>
              <p className="text-[#8B857A] font-medium uppercase tracking-widest text-xs">
                Secure Architectural Transaction
              </p>
            </header>

            <form onSubmit={handlePlaceOrder} className="space-y-16">
              {/* Billing Information */}
              <section className="space-y-10">
                <div className="flex items-center gap-3 text-[#2C2926]">
                  <ShieldCheck size={20} />
                  <h2 className="text-2xl font-bold uppercase tracking-tight">
                    Billing Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                      First Name
                    </Label>
                    <Input
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-lg font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                      Last Name
                    </Label>
                    <Input
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-lg font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                      Email Address
                    </Label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-lg font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                      Phone Number
                    </Label>
                    <Input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+95 9..."
                      className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-lg font-bold transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Information */}
              <section className="space-y-10">
                <div className="flex items-center gap-3 text-[#2C2926]">
                  <Truck size={20} />
                  <h2 className="text-2xl font-bold uppercase tracking-tight">
                    Shipping Destination
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                      Country
                    </Label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full h-14 border-0 border-b-2 border-[#E5E0D8] bg-transparent rounded-none px-0 text-lg font-bold outline-none focus:border-[#2C2926] transition-all appearance-none"
                    >
                      <option value="Myanmar">Myanmar</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                      City / Region
                    </Label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-lg font-bold transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                      Street Address
                    </Label>
                    <Input
                      required
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-lg font-bold transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                      Detailed Shipping Instructions (Optional)
                    </Label>
                    <Input
                      value={formData.shippingAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingAddress: e.target.value,
                        })
                      }
                      placeholder="e.g. Apartment number, floor, landmarks"
                      className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-lg font-bold transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Methods */}
              <section className="space-y-10">
                <div className="flex items-center gap-3 text-[#2C2926]">
                  <PaymentIcon size={20} />
                  <h2 className="text-2xl font-bold uppercase tracking-tight">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: "cod",
                      label: "Cash on Delivery",
                      icon: <Wallet size={18} />,
                    },
                    {
                      id: "kpay",
                      label: "KBZ Pay",
                      icon: <Smartphone size={18} />,
                    },
                    {
                      id: "ayapay",
                      label: "AYA Pay",
                      icon: <Smartphone size={18} />,
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center justify-center p-8 gap-4 border-2 transition-all duration-300 ${
                        paymentMethod === method.id
                          ? "border-[#2C2926] bg-white shadow-xl scale-105"
                          : "border-[#E5E0D8] text-[#8B857A] hover:border-[#2C2926] hover:text-[#2C2926]"
                      }`}
                    >
                      {method.icon}
                      <span className="text-[10px] uppercase tracking-widest font-bold">
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <div className="pt-10">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-20 rounded-none bg-[#2C2926] text-white uppercase font-bold tracking-[0.3em] text-sm hover:bg-stone-700 shadow-2xl transition-all flex items-center justify-center gap-4"
                >
                  {loading ? (
                    <Spinner className="h-6 w-6" />
                  ) : (
                    "Complete Transaction"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:sticky lg:top-32 h-fit space-y-8">
            <div className="bg-white border border-[#E5E0D8] p-8 md:p-12 shadow-sm">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-8">
                Order Summary
              </h3>

              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-muted shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-tight line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#8B857A] font-medium mt-1">
                        Qty: {item.quantity} • ${item.discount.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xs font-bold">
                      ${(item.discount * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-[#E5E0D8]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B857A]">Subtotal</span>
                  <span className="font-bold">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B857A]">Shipping</span>
                  <span className="font-bold">
                    {shippingFee === 0
                      ? "FREE"
                      : `$${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <Separator className="bg-[#2C2926] h-px my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Grand Total
                  </span>
                  <span className="text-3xl font-bold font-outfit">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#EBE7DF] border-l-4 border-[#2C2926]">
              <h4 className="font-bold uppercase text-[10px] mb-4 tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} /> Guaranteed Security
              </h4>
              <p className="text-[10px] text-[#5C574F] leading-relaxed font-medium">
                Your transaction is protected by bank-level 256-bit SSL
                encryption. We never store your full payment details on our
                servers.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
