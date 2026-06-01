import { useState, useEffect } from "react";
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
  Copy,
  CheckCircle2,
  User as UserIcon,
  Phone,
  QrCode,
  Upload,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { API_BASE_URL } from "@/lib/utils";

export default function CheckoutPage() {
  const { data: session, isPending } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [copied, setCopied] = useState(false);
  const [kpaySlip, setKpaySlip] = useState<File | null>(null);
  const [kpaySlipPreview, setKpaySlipPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!kpaySlip) {
      setKpaySlipPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(kpaySlip);
    setKpaySlipPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [kpaySlip]);

  const ADMIN_KPAY = {
    name: "Tiger Balm Store",
    phone: "+959 777 788 888",
    qr: "/kpay-qr.png",
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(ADMIN_KPAY.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

    // Validate KPay fields
    if (paymentMethod === "kpay") {
      if (!kpaySlip) return toast.error("Please upload your KBZ Pay transfer slip image.");
    }

    setLoading(true);

    try {
      const orderNumber = `TB-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderData = new FormData();
      orderData.append("email", formData.email);
      orderData.append("customerName", `${formData.firstName} ${formData.lastName}`);
      orderData.append("orderNumber", orderNumber);
      orderData.append(
        "items",
        JSON.stringify(
          items.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            discount: item.discount,
          }))
        )
      );
      orderData.append("total", total.toString());
      orderData.append("address", `${formData.street}, ${formData.city}, ${formData.country}`);
      orderData.append("paymentMethod", paymentMethod);
      orderData.append(
        "orderTime",
        new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      );

      if (paymentMethod === "kpay" && kpaySlip) {
        orderData.append("slip", kpaySlip);
      }

      // Call the order confirmation email API
      const response = await fetch(`${API_BASE_URL}/api/v1/order/confirm`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("better-auth.session_token") || ""}`,
        },
        body: orderData,
      });

      if (!response.ok) {
        throw new Error("Failed to send order confirmation");
      }

      toast.success("Order placed successfully! Confirmation email sent.");
      
      // Save order details for purchase history
      const newOrder = {
        id: orderNumber,
        items: items,
        total: total,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: "Processing",
        paymentMethod: paymentMethod,
      };

      const existingOrders = JSON.parse(localStorage.getItem("allOrders") || "[]");
      localStorage.setItem("allOrders", JSON.stringify([newOrder, ...existingOrders]));
      localStorage.setItem("lastOrder", JSON.stringify(newOrder)); // Keep lastOrder for Track page

      // Increment total orders count
      const currentCount = parseInt(localStorage.getItem("totalOrdersCount") || "10");
      localStorage.setItem("totalOrdersCount", (currentCount + 1).toString());

      clearCart();
      navigate(`/track-order?id=${orderNumber}`);
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
                Checkout
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

                {/* Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "cod", label: "Cash on Delivery", icon: <Wallet size={18} /> },
                    { id: "kpay",   label: "KBZ Pay",          icon: <Smartphone size={18} /> },
                    { id: "ayapay", label: "AYA Pay",          icon: <Smartphone size={18} /> },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center justify-center py-6 gap-3 border-2 transition-all duration-300 ${
                        paymentMethod === method.id
                          ? "border-[#2C2926] bg-white shadow-xl"
                          : "border-[#E5E0D8] text-[#8B857A] hover:border-[#2C2926] hover:text-[#2C2926]"
                      }`}
                    >
                      {method.icon}
                      <span className="text-[9px] uppercase tracking-widest font-bold">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* ── KBZ Pay Panel ── */}
                {paymentMethod === "kpay" && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Step banner */}
                    <div className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 mb-0">
                      <QrCode size={16} />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                        KBZ Pay — Complete Your Transfer Then Fill in Details Below
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 border border-t-0 border-[#E5E0D8]">

                      {/* LEFT — Admin QR & Info */}
                      <div className="bg-gradient-to-br from-[#1a3a6b] to-[#0d2040] text-white p-8 flex flex-col items-center gap-6">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-300 text-center mb-1">Step 1</p>
                          <p className="text-xs font-bold uppercase tracking-widest text-center text-white/80">Scan QR or Transfer to</p>
                        </div>

                        {/* QR Code */}
                        <div className="relative bg-white p-3 shadow-2xl">
                          <img
                            src={ADMIN_KPAY.qr}
                            alt="KBZ Pay QR Code"
                            className="w-44 h-44 object-cover"
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                            KBZ Pay
                          </div>
                        </div>

                        {/* Admin Details */}
                        <div className="w-full space-y-3">
                          <div className="flex items-center justify-between bg-white/10 px-4 py-3">
                            <div className="flex items-center gap-3">
                              <UserIcon size={14} className="text-blue-300 shrink-0" />
                              <div>
                                <p className="text-[8px] uppercase tracking-widest text-blue-300 font-bold">Account Name</p>
                                <p className="text-sm font-bold">{ADMIN_KPAY.name}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between bg-white/10 px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Phone size={14} className="text-blue-300 shrink-0" />
                              <div>
                                <p className="text-[8px] uppercase tracking-widest text-blue-300 font-bold">Phone Number</p>
                                <p className="text-sm font-bold font-mono tracking-wider">{ADMIN_KPAY.phone}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyPhone}
                              className="ml-2 p-2 bg-white/10 hover:bg-white/20 transition-colors"
                              title="Copy phone number"
                            >
                              {copied
                                ? <CheckCircle2 size={14} className="text-green-400" />
                                : <Copy size={14} className="text-blue-300" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT — User Transaction Details */}
                      <div className="bg-white p-8 flex flex-col gap-6">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Step 2</p>
                          <p className="text-sm font-bold uppercase tracking-tight text-[#2C2926]">Upload Transfer Slip</p>
                          <p className="text-[10px] text-[#8B857A] mt-1">Upload the payment screenshot/receipt after your transfer.</p>
                        </div>

                        <div className="space-y-5">
                          <div className="space-y-2">
                            <Label className="text-[9px] uppercase tracking-[0.25em] font-black text-[#8B857A] flex items-center gap-2">
                              Payment Receipt / Slip Screenshot
                            </Label>
                            <div className="border-2 border-dashed border-[#E5E0D8] p-8 text-center cursor-pointer hover:border-blue-500 transition-colors relative group min-h-[250px] flex items-center justify-center bg-stone-50/50">
                              <input
                                required
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setKpaySlip(e.target.files[0]);
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              {kpaySlipPreview ? (
                                <div className="space-y-4 flex flex-col items-center w-full relative z-0">
                                  <div className="relative w-full max-w-[200px] h-[200px] border border-stone-200 overflow-hidden bg-white shadow-md flex items-center justify-center">
                                    <img
                                      src={kpaySlipPreview}
                                      alt="Payment Slip Preview"
                                      className="w-full h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-[#2C2926]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white">
                                      <Upload className="h-6 w-6 text-white" />
                                      <p className="text-[9px] font-black uppercase tracking-widest">Replace Slip</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-[#2C2926] truncate max-w-[240px]">{kpaySlip?.name}</p>
                                    <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest mt-1">✓ Upload Completed</p>
                                    <p className="text-[8px] text-[#8B857A] uppercase tracking-wider mt-0.5">Click or drag to change image</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="mx-auto h-8 w-8 text-[#8B857A] group-hover:text-blue-500 transition-colors" />
                                  <p className="text-xs font-bold text-[#2C2926]">Select KPay Slip Image</p>
                                  <p className="text-[9px] text-[#8B857A] uppercase">JPEG, PNG up to 5MB</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Confirmation note */}
                        <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 mt-auto">
                          <ShieldCheck size={14} className="text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-[9px] text-blue-700 font-bold uppercase tracking-widest leading-relaxed">
                            Your order will be confirmed after admin verifies the transaction.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
