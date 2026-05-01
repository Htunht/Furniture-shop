import { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Camera,
  ArrowRight,
  LogOut,
  Settings,
  CreditCard,
  ShoppingBag,
  MapPin,
  Check,
  AlertTriangle,
  XCircle,
  Phone as PhoneIcon,
  Headphones,
  MessageCircle,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [userOrders, setUserOrders] = useState<any[]>([]);

  const fetchUserOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("better-auth.session_token") || ""}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUserOrders(data);
      }
    } catch (error) {
      console.log("Real-time sync error:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserOrders();
      const interval = setInterval(fetchUserOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });

  const [emailData, setEmailData] = useState({
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        // @ts-ignore
        age: session.user.age?.toString() || "",
        // @ts-ignore
        gender: session.user.gender || "",
      });
      setEmailData({
        email: session.user.email || "",
      });
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.updateUser({
        name: formData.name,
        // @ts-ignore
        age: parseInt(formData.age) || undefined,
        gender: formData.gender,
      });

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.changeEmail({
        newEmail: emailData.email,
      });

      if (error) throw error;
      toast.success("Verification email sent to new address");
    } catch (err: any) {
      toast.error(err.message || "Failed to change email");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        revokeOtherSessions: true,
      });

      if (error) throw error;
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
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
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center px-4 bg-[#F9F8F6]">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4 font-outfit">
          Access Denied.
        </h1>
        <p className="text-[#8B857A] mb-8 font-medium">
          Please sign in to manage your architectural sanctuary.
        </p>
        <Button
          onClick={() => (window.location.href = "/login")}
          className="rounded-none h-14 px-12 bg-[#2C2926] uppercase font-bold tracking-widest text-xs"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2C2926]">
      {/* Dynamic Header */}
      <section className="relative min-h-[500px] md:h-[50vh] flex items-end overflow-hidden bg-[#2C2926] text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative group"
              >
                <div className="w-32 h-32 md:w-48 md:h-48 border-8 border-[#F9F8F6] bg-stone-800 overflow-hidden shadow-2xl">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-bold opacity-20">
                      {session.user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <button className="absolute -right-2 -bottom-2 md:-right-4 md:-bottom-4 bg-white text-[#2C2926] p-3 shadow-xl hover:scale-110 transition-transform">
                  <Camera size={20} />
                </button>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-2"
              >
                <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-2">
                  My Sanctuary
                </p>
                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase font-outfit leading-none">
                  {session.user.name}
                </h1>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex items-center gap-8 mb-2 text-stone-400"
            >
              <div className="text-left md:text-right">
                <p className="text-xl md:text-3xl font-bold text-white font-outfit leading-none mb-1">
                  2026
                </p>
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-black text-stone-500">
                  Member Since
                </p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-xl md:text-3xl font-bold text-white font-outfit leading-none mb-1 uppercase tracking-tighter">
                  {session.user.role || "Citizen"}
                </p>
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-black text-stone-500">
                  Sanctuary Rank
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-20">
          {/* Minimalist Navigation Sidebar */}
          <aside>
            <nav className="space-y-1">
              {[
                {
                  id: "profile",
                  label: "Account Info",
                  icon: <User size={16} />,
                },
                {
                  id: "security",
                  label: "Security & Login",
                  icon: <Lock size={16} />,
                },
                {
                  id: "orders",
                  label: "Purchase History",
                  icon: <ShoppingBag size={16} />,
                },
                {
                  id: "billing",
                  label: "Billing & Cards",
                  icon: <CreditCard size={16} />,
                },
                {
                  id: "addresses",
                  label: "Shipping Books",
                  icon: <MapPin size={16} />,
                },
                ...(session.user.role === "admin" ? [
                  {
                    id: "admin-nav",
                    label: "Admin Console",
                    icon: <ShieldCheck size={16} />,
                    onClick: () => window.location.href = "/admin"
                  }
                ] : []),
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick || (() => setActiveSection(item.id))}
                  className={`w-full flex items-center gap-4 p-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 border-l-2 ${
                    activeSection === item.id
                      ? "bg-white text-[#2C2926] border-[#2C2926] shadow-sm"
                      : "text-[#8B857A] border-transparent hover:text-[#2C2926] hover:bg-stone-50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-20 pt-10 border-t border-[#E5E0D8]">
              <button
                onClick={() => authClient.signOut()}
                className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-red-800 hover:text-red-600 transition-colors"
              >
                <LogOut size={16} />
                Sign Out Session
              </button>
            </div>
          </aside>

          {/* Dynamic Content Area */}
          <main className="animate-in fade-in slide-in-from-right-10 duration-700">
            {activeSection === "profile" && (
              <div className="space-y-16">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-4 text-[#8B857A]">
                    <Settings size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Settings / Profile
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 leading-none">
                    Your Identity
                  </h2>
                  <p className="text-lg text-[#5C574F] leading-relaxed mb-12 border-l-2 border-[#2C2926] pl-8">
                    Manage your personal information and how we address you.
                    These details help us curate a more personalized showroom
                    experience.
                  </p>

                  <form onSubmit={handleUpdateProfile} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                          Full Legal Name
                        </Label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                          Age Group
                        </Label>
                        <Input
                          type="number"
                          value={formData.age}
                          onChange={(e) =>
                            setFormData({ ...formData, age: e.target.value })
                          }
                          className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                          Identity / Gender
                        </Label>
                        <select
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          className="w-full h-14 border-0 border-b-2 border-[#E5E0D8] bg-transparent rounded-none px-0 text-xl font-bold outline-none focus:border-[#2C2926] transition-all appearance-none"
                        >
                          <option value="">Choose...</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-10">
                      <Button
                        disabled={loading}
                        className="h-16 px-12 rounded-none bg-[#2C2926] text-white uppercase font-bold tracking-[0.2em] text-xs hover:bg-stone-700 shadow-2xl transition-all flex items-center gap-4"
                      >
                        {loading ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <>
                            Commit Changes <ArrowRight size={16} />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-20 max-w-3xl">
                {/* Email Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4 text-[#8B857A]">
                    <Mail size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Communication / Authentication
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-10 leading-none">
                    Access Email
                  </h2>

                  <form onSubmit={handleChangeEmail} className="space-y-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                        Current Address
                      </Label>
                      <Input
                        type="email"
                        value={emailData.email}
                        onChange={(e) =>
                          setEmailData({ ...emailData, email: e.target.value })
                        }
                        className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                      />
                    </div>
                    <Button
                      disabled={loading}
                      variant="outline"
                      className="h-14 px-10 rounded-none border-[#2C2926] uppercase font-bold tracking-widest text-[10px]"
                    >
                      {loading ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        "Verify & Update Email"
                      )}
                    </Button>
                  </form>
                </div>

                {/* Password Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4 text-[#8B857A]">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Digital Vault / Encryption
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-10 leading-none">
                    Security Key
                  </h2>

                  <form onSubmit={handleChangePassword} className="space-y-12">
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                          Current Password
                        </Label>
                        <Input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                            New Password
                          </Label>
                          <Input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">
                            Confirm Key
                          </Label>
                          <Input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      disabled={loading}
                      className="h-16 px-12 rounded-none bg-[#2C2926] text-white uppercase font-bold tracking-[0.2em] text-xs shadow-xl"
                    >
                      {loading ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        "Re-encrypt Password"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {activeSection === "orders" && (
              <div className="space-y-16">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-3 mb-4 text-[#8B857A]">
                    <ShoppingBag size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Showroom / History
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 leading-none">
                    Your Acquisitions
                  </h2>
                  <p className="text-lg text-[#5C574F] leading-relaxed mb-12 border-l-2 border-[#2C2926] pl-8">
                    A retrospective of your architectural selections. Every
                    piece here represents a step towards your ideal sanctuary.
                  </p>

                  <div className="space-y-8">
                    {(() => {
                      if (userOrders.length === 0) {
                        return (
                          <div className="py-20 text-center border-2 border-dashed border-[#E5E0D8] bg-white">
                            <p className="text-[#8B857A] uppercase font-bold tracking-widest text-[10px]">
                              No orders found in your archives
                            </p>
                          </div>
                        );
                      }
                      return userOrders.map((order: any) => (
                        <div
                          key={order.id}
                          className="bg-white border border-[#E5E0D8] shadow-sm hover:shadow-xl transition-all duration-500 group"
                        >
                          {/* ── Order Header ── */}
                          <div className="flex flex-col md:flex-row justify-between gap-6 px-8 md:px-10 py-6 border-b border-[#E5E0D8] bg-[#F9F8F6]">
                            <div className="flex flex-wrap items-center gap-6">
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B857A] mb-0.5">
                                  Order Reference
                                </p>
                                <h3 className="text-base font-bold font-outfit uppercase tracking-tighter">
                                  #{order.orderNumber || order.id}
                                </h3>
                              </div>
                              <div className="w-px h-8 bg-[#E5E0D8] hidden md:block" />
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B857A] mb-0.5">
                                  Ordered On
                                </p>
                                <p className="text-sm font-bold text-[#2C2926]">
                                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                                <p className="text-[10px] text-[#8B857A] font-semibold mt-0.5">
                                  {new Date(order.createdAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </p>
                              </div>
                              <div className="w-px h-8 bg-[#E5E0D8] hidden md:block" />
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B857A] mb-0.5">
                                  Items
                                </p>
                                <p className="text-sm font-bold text-[#2C2926]">
                                  {order.items.length} {order.items.length === 1 ? "piece" : "pieces"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${
                                order.status === "DELIVERED"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "CANCELLED"
                                  ? "bg-red-50 text-red-700"
                                  : order.status === "TRANSIT" || order.status === "SHIPPED"
                                  ? "bg-blue-50 text-blue-800"
                                  : "bg-amber-50 text-amber-800"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  order.status === "DELIVERED" ? "bg-green-500"
                                  : order.status === "CANCELLED" ? "bg-red-500"
                                  : order.status === "TRANSIT" || order.status === "SHIPPED" ? "bg-blue-500 animate-pulse"
                                  : "bg-amber-500 animate-pulse"
                                }`} />
                                {order.status === "DELIVERED" ? "Delivered"
                                  : order.status === "TRANSIT" ? "In Transit"
                                  : order.status === "SHIPPED" ? "Shipped"
                                  : order.status === "PROCESSING" ? "Processing"
                                  : order.status === "PLACED" ? "Placed"
                                  : order.status === "CANCELLED" ? "Cancelled"
                                  : order.status}
                              </span>
                            </div>
                          </div>

                          {/* ── Payment Failed Banner ── */}
                          {order.paymentStatus === "FAILED" && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                              {/* Red alert header bar */}
                              <div className="bg-red-600 text-white px-8 md:px-10 py-3 flex items-center gap-3">
                                <AlertTriangle size={16} className="shrink-0 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.25em]">
                                  Payment Verification Failed — Action Required
                                </p>
                              </div>

                              {/* Detailed failure card */}
                              <div className="bg-gradient-to-br from-red-50 via-white to-red-50/30 px-8 md:px-10 py-8 border-x border-[#E5E0D8]">
                                <div className="flex flex-col lg:flex-row gap-8">
                                  {/* Left — Issue Details */}
                                  <div className="flex-1 space-y-4">
                                    <div className="flex items-start gap-4">
                                      <div className="w-12 h-12 bg-red-100 flex items-center justify-center shrink-0">
                                        <XCircle size={24} className="text-red-600" />
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-black uppercase tracking-tight text-red-800 mb-1">
                                          Transaction Could Not Be Verified
                                        </h4>
                                        <p className="text-xs text-red-700/80 font-medium leading-relaxed max-w-md">
                                          Our team was unable to verify your KBZ Pay payment for this order.
                                          This may be due to incorrect transaction details, an incomplete transfer,
                                          or a mismatch in account information.
                                        </p>
                                      </div>
                                    </div>

                                    {/* What happens next */}
                                    <div className="bg-white/70 border border-red-100 p-5 space-y-3">
                                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600">What happens now?</p>
                                      <ul className="space-y-2">
                                        {[
                                          "Your order is on hold until payment is confirmed.",
                                          "Please contact our support team with your correct transaction details.",
                                          "If this was an error, we'll re-verify and process your order promptly.",
                                        ].map((item, idx) => (
                                          <li key={idx} className="flex items-start gap-3 text-[11px] text-[#5C574F] font-medium">
                                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                  {/* Right — Contact Support CTA */}
                                  <div className="lg:w-64 flex flex-col gap-3">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600 mb-1">Get Help Now</p>
                                    <Link
                                      to="/contact"
                                      className="flex items-center justify-center gap-3 h-14 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all group/cta shadow-lg shadow-red-200"
                                    >
                                      <Headphones size={16} className="group-hover/cta:scale-110 transition-transform" />
                                      Contact Support
                                    </Link>
                                    <a
                                      href="tel:+959777788888"
                                      className="flex items-center justify-center gap-3 h-14 bg-white border-2 border-red-200 text-red-700 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-400 transition-all"
                                    >
                                      <PhoneIcon size={16} />
                                      +959 777 788 888
                                    </a>
                                    <a
                                      href="mailto:support@tigerbalm.store"
                                      className="flex items-center justify-center gap-3 h-14 bg-white border-2 border-red-200 text-red-700 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-400 transition-all"
                                    >
                                      <MessageCircle size={16} />
                                      Email Support
                                    </a>
                                    <p className="text-[9px] text-red-500/70 font-bold text-center mt-1 uppercase tracking-wider">
                                      Ref: #{order.orderNumber || order.id}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── Column Labels (desktop) ── */}
                          <div className="hidden md:grid grid-cols-[64px_1fr_72px_96px] gap-4 px-10 pt-5 pb-2 border-b border-[#F0EDE8]">
                            <div />
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B857A]">Item</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B857A] text-center">Qty</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B857A] text-right">Subtotal</p>
                          </div>

                          {/* ── Item Rows ── */}
                          <div className="px-8 md:px-10 py-4 space-y-1">
                            {order.items.map((item: any, i: number) => (
                              <div
                                key={i}
                                className="grid grid-cols-[64px_1fr] md:grid-cols-[64px_1fr_72px_96px] gap-4 items-center py-3 border-b border-[#F9F8F6] last:border-0"
                              >
                                {/* Thumbnail */}
                                <div className="w-16 h-16 bg-[#F0EDE8] shrink-0 overflow-hidden">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <ShoppingBag size={18} className="text-[#C8C2BA]" />
                                    </div>
                                  )}
                                </div>

                                {/* Name + unit price */}
                                <div className="min-w-0">
                                  <p className="text-xs font-bold uppercase tracking-wide text-[#2C2926] leading-tight mb-1 truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-[10px] text-[#8B857A] font-semibold">
                                    ${Number(item.price).toLocaleString()} / unit
                                  </p>
                                  {/* Mobile-only: qty + subtotal */}
                                  <p className="md:hidden text-[10px] text-[#5C574F] font-bold mt-1">
                                    Qty: {item.quantity}&nbsp;&nbsp;•&nbsp;&nbsp;${(Number(item.price) * item.quantity).toLocaleString()}
                                  </p>
                                </div>

                                {/* Qty (desktop) */}
                                <div className="hidden md:flex justify-center">
                                  <span className="text-sm font-bold text-[#2C2926]">{item.quantity}</span>
                                </div>

                                {/* Subtotal (desktop) */}
                                <div className="hidden md:block text-right">
                                  <span className="text-sm font-bold font-outfit text-[#2C2926]">
                                    ${(Number(item.price) * item.quantity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* ── Order Footer ── */}
                          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 px-8 md:px-10 py-5 border-t border-[#E5E0D8] ${order.paymentStatus === "FAILED" ? "bg-red-50/50" : "bg-[#F9F8F6]"}`}>
                            <div className="flex items-baseline gap-3">
                              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B857A]">
                                Order Total
                              </span>
                              <span className={`text-2xl font-bold font-outfit ${order.paymentStatus === "FAILED" ? "text-red-400 line-through" : "text-[#2C2926]"}`}>
                                ${Number(order.totalAmount).toLocaleString()}
                              </span>
                              {order.paymentStatus === "FAILED" && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-widest">
                                  <XCircle size={11} /> Payment Failed
                                </span>
                              )}
                            </div>
                            {order.paymentStatus === "FAILED" ? (
                              <Link
                                to="/contact"
                                className="inline-flex items-center gap-3 h-11 px-8 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.25em] hover:bg-red-700 transition-all group/btn shadow-lg shadow-red-200"
                              >
                                <Headphones size={13} /> Contact Support <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            ) : order.status === "DELIVERED" ? (
                              <button
                                className="inline-flex items-center gap-3 h-11 px-8 bg-green-800 text-white text-[9px] font-black uppercase tracking-[0.25em] hover:bg-green-900 transition-all group/btn"
                                onClick={() => toast.success("Thank you for your rating!")}
                              >
                                Rate this Order <Check size={13} className="group-hover/btn:scale-125 transition-transform" />
                              </button>
                            ) : (
                              <Link
                                to={`/track-order?id=${order.orderNumber}`}
                                className="inline-flex items-center gap-3 h-11 px-8 bg-[#2C2926] text-white text-[9px] font-black uppercase tracking-[0.25em] hover:bg-stone-800 transition-all group/btn"
                              >
                                Track Live <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            )}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}


            {activeSection !== "profile" &&
              activeSection !== "security" &&
              activeSection !== "orders" && (
                <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-[#E5E0D8]">
                  <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                    <Settings
                      size={32}
                      className="text-[#8B857A] animate-spin-slow"
                    />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">
                    Module Under Construction
                  </h3>
                  <p className="text-[#8B857A] max-w-sm">
                    We are currently architecting this portion of your sanctuary
                    experience. Please check back shortly.
                  </p>
                </div>
              )}
          </main>
        </div>
      </div>
    </div>
  );
}
