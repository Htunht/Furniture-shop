import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  ExternalLink,
  Plus,
  Search,
  Settings,
  X,
  Upload,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalInventory: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  growthPercentage: number;
}

interface DashboardOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  items: { id: string }[];
}

interface DashboardProduct {
  id: string;
  name: string;
  imageUrl?: string | null;
  price: number | string;
  inventory: number;
  status: string;
  category?: { name: string } | null;
  type?: { name: string } | null;
  description?: string;
}

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
}

interface SessionWithToken {
  session?: {
    token?: string;
  };
  token?: string;
}

const API_BASE_URL = "http://localhost:8080";
const ADMIN_API_BASE_URL = `${API_BASE_URL}/api/v1/admin`;
const IMAGE_FALLBACK_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23f5f5f4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%238b857a' font-family='Arial,sans-serif' font-size='24'%3EImage unavailable%3C/text%3E%3C/svg%3E";

const getImageSrc = (imageUrl?: string | null) => {
  if (!imageUrl) return IMAGE_FALLBACK_SRC;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${API_BASE_URL}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
};

export default function AdminDashboard() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DashboardProduct | null>(
    null,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getAuthToken = () => {
    const sessionData = session as SessionWithToken | null;
    return sessionData?.session?.token || sessionData?.token;
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!session || session.user.role !== "admin") {
      window.location.href = "/";
      return;
    }

    const loadData = async () => {
      await Promise.all([
        fetchStats(),
        fetchOrders(),
        fetchProducts(),
        fetchUsers(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [session, sessionLoading]);

  // Close sidebar on tab change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${ADMIN_API_BASE_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Dashboard API Error (${res.status}):`, errorText);
        return;
      }

      const data = await res.json();
      console.log("DEBUG: Received Stats Data", data);
      setStats(data);
    } catch (error) {
      console.error("Dashboard fetch crash:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${ADMIN_API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      const statusOrder = ["PENDING", "PLACED", "PROCESSING", "SHIPPED", "TRANSIT", "DELIVERED", "CANCELLED"];
      const sortedOrders = [...data].sort((a: DashboardOrder, b: DashboardOrder) => {
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Orders fetch error:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${ADMIN_API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Products fetch error:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${ADMIN_API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Users fetch error:", error);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(
        `${ADMIN_API_BASE_URL}/orders/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({ status }),
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Update failed");
      toast.success("Order Manifest Updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update manifest");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to decommission this piece?")) return;
    try {
      const res = await fetch(
        `${ADMIN_API_BASE_URL}/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getAuthToken()}` },
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Product Decommissioned");
      fetchProducts();
      fetchStats();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F9F8F6]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Spinner className="h-12 w-12 text-[#2C2926] mx-auto mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B857A]">
            Initializing Command Center
          </p>
        </motion.div>
      </div>
    );

  const SidebarContent = () => (
    <>
      <div className="p-10 border-b border-[#E5E0D8]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 90 }}
              className="w-10 h-10 bg-[#2C2926] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
            >
              T
            </motion.div>
            <span className="font-outfit font-black uppercase tracking-tighter text-2xl text-[#2C2926]">
              Tiger.
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-[#2C2926]"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#8B857A]">
            System Operational
          </p>
        </div>
      </div>

      <nav className="p-8 space-y-3">
        {[
          {
            id: "overview",
            label: "Intelligence",
            icon: <LayoutDashboard size={18} />,
          },
          { id: "products", label: "Inventory", icon: <Package size={18} /> },
          { id: "orders", label: "Manifests", icon: <ShoppingBag size={18} /> },
          { id: "users", label: "Architects", icon: <Users size={18} /> },
          {
            id: "store",
            label: "Back to Shop",
            icon: <ExternalLink size={18} />,
            isExternal: true,
          },
        ].map((item) => (
          <button
            key={item.id}
            onClick={
              item.isExternal
                ? () => (window.location.href = "/")
                : () => setActiveTab(item.id)
            }
            className={`w-full flex items-center gap-4 p-5 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-500 group ${
              activeTab === item.id
                ? "bg-[#2C2926] text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] translate-x-2"
                : "text-[#8B857A] hover:bg-stone-50 hover:text-[#2C2926]"
            }`}
          >
            <span
              className={`transition-transform duration-500 ${activeTab === item.id ? "scale-110" : "group-hover:scale-110"}`}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-white to-transparent pt-20">
        <div className="bg-[#2C2926] p-6 text-white group cursor-pointer overflow-hidden relative">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Settings size={40} />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-2 text-stone-400">
            Authorized Agent
          </p>
          <p className="text-xs font-bold font-outfit truncate">
            {session?.user?.name}
          </p>
          <div className="mt-4 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-white transition-colors">
            <Check size={10} className="text-green-500" /> Secure Link Active
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2C2926] flex font-inter selection:bg-[#2C2926] selection:text-white overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-white/80 backdrop-blur-xl border-r border-[#E5E0D8] fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12 lg:p-24 relative">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-stone-200/30 to-transparent -z-10 pointer-events-none" />

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 hover:bg-stone-100 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#8B857A]">
                Console / {activeTab}
              </p>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter font-outfit leading-[0.8]">
              {activeTab === "overview" && "Intelligence."}
              {activeTab === "products" && "The Vault."}
              {activeTab === "orders" && "Timeline."}
              {activeTab === "users" && "Roster."}
            </h1>
          </motion.div>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="flex-1 md:flex-none flex items-center gap-3 bg-white border border-[#E5E0D8] px-4 md:px-6 py-3 shadow-sm">
              <Search size={16} className="text-[#8B857A]" />
              <input
                type="text"
                placeholder="SEARCH HUB..."
                className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-full md:w-40 placeholder:text-stone-300"
              />
            </div>
            {activeTab === "products" && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto h-14 px-10 bg-[#2C2926] rounded-none uppercase font-bold tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <Plus size={18} /> New Entry
              </Button>
            )}
          </div>
        </header>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-24">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                {
                  label: "Gross Revenue (24H)",
                  value: `$${(stats?.todayRevenue || 0).toLocaleString()}`,
                  change: `${stats?.growthPercentage || 0}% vs yesterday`,
                  icon: <TrendingUp className="text-green-500" size={24} />,
                  color: "bg-green-500",
                },
                {
                  label: "Order Volume",
                  value: stats?.totalOrders || 0,
                  change: "Total Transactions",
                  icon: <ShoppingBag size={24} />,
                  color: "bg-[#2C2926]",
                },
                {
                  label: "Global Inventory",
                  value: stats?.totalInventory || 0,
                  change: "Units Across Showroom",
                  icon: <Package size={24} />,
                  color: "bg-orange-500",
                },
                {
                  label: "Active Curator Hub",
                  value: stats?.totalProducts || 0,
                  change: "Unique Architectural Listings",
                  icon: <LayoutDashboard size={24} />,
                  color: "bg-[#2C2926]",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-[#E5E0D8] p-10 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] -mr-8 -mt-8 rotate-45 group-hover:opacity-[0.07] transition-opacity`}
                  />
                  <div
                    className={`w-12 h-12 ${stat.color} flex items-center justify-center text-white mb-10 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                  >
                    {stat.icon}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B857A] mb-4">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl font-black font-outfit mb-4">
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-2">
                    {stat.label.includes("Revenue") && (
                      <span
                        className={`text-[8px] font-black uppercase px-2 py-1 ${(stats?.growthPercentage || 0) >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {stat.change}
                      </span>
                    )}
                    {!stat.label.includes("Revenue") && (
                      <span className="text-[8px] font-black uppercase px-2 py-1 bg-stone-100 text-[#8B857A]">
                        {stat.change}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Visual Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 bg-white border border-[#E5E0D8] p-12 shadow-sm">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter font-outfit">
                      Live Acquisitions
                    </h3>
                    <p className="text-[10px] font-bold text-[#8B857A] uppercase tracking-widest mt-2">
                      Real-time purchase stream
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-[10px] font-bold uppercase tracking-widest underline decoration-stone-200 underline-offset-4 hover:decoration-[#2C2926]"
                  >
                    Global Log
                  </Button>
                </div>

                <div className="space-y-10">
                  {orders.slice(0, 4).map((order, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={order.id}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#F9F8F6] border border-[#E5E0D8] flex items-center justify-center font-black text-xl text-stone-300 group-hover:bg-[#2C2926] group-hover:text-white transition-all duration-500">
                          {order.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight mb-1">
                            #{order.orderNumber}
                          </p>
                          <p className="text-[10px] text-[#8B857A] font-bold uppercase tracking-widest">
                            {order.customerName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black font-outfit mb-1">
                          ${Number(order.totalAmount).toLocaleString()}
                        </p>
                        <span
                          className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-stone-100 text-[#8B857A]"}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-[#2C2926] p-12 text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter font-outfit mb-6 text-white/90">
                    Stock Depletion
                  </h3>
                  <div className="space-y-10">
                    {products
                      .filter((p) => p.inventory < 15)
                      .slice(0, 3)
                      .map((product) => (
                        <div key={product.id} className="space-y-3">
                          <div className="flex justify-between items-end">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 truncate max-w-[140px]">
                              {product.name}
                            </p>
                            <p className="text-xs font-black font-outfit text-orange-500">
                              {product.inventory} UNITS
                            </p>
                          </div>
                          <div className="w-full h-1 bg-white/10 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(product.inventory / 50) * 100}%`,
                              }}
                              className="h-full bg-orange-500"
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="pt-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 mb-6 italic">
                    Strategic recommendation: Prioritize restock for "Living
                    Room" category.
                  </p>
                  <Button className="w-full h-14 bg-white text-[#2C2926] rounded-none uppercase font-bold tracking-widest text-[10px] hover:bg-stone-200 transition-colors">
                    Generate Restock Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab - Gallery View */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {products.map((product, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={product.id}
                className="bg-white border border-[#E5E0D8] group hover:border-[#2C2926] transition-all duration-700 overflow-hidden"
              >
                <div className="relative h-72 overflow-hidden bg-[#F9F8F6]">
                  <img
                    src={getImageSrc(product.imageUrl)}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = IMAGE_FALLBACK_SRC;
                    }}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setIsModalOpen(true);
                      }}
                      className="w-10 h-10 bg-white/90 backdrop-blur flex items-center justify-center hover:bg-[#2C2926] hover:text-white transition-all shadow-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="w-10 h-10 bg-white/90 backdrop-blur flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 bg-[#2C2926] text-white px-4 py-2 text-[8px] font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform">
                    {product.category?.name}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-black uppercase tracking-tight max-w-[180px]">
                      {product.name}
                    </h4>
                    <p className="text-lg font-black font-outfit text-[#2C2926]">
                      ${Number(product.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${product.inventory > 10 ? "bg-green-500" : "bg-orange-500"}`}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B857A]">
                        {product.inventory} Available
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-stone-100 px-2 py-1">
                      {product.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Orders Tab - Detailed Manifest */}
        {activeTab === "orders" && (
          <div className="bg-white border border-[#E5E0D8] shadow-2xl overflow-hidden">
            <div className="p-6 md:p-10 border-b border-[#E5E0D8] flex flex-col sm:flex-row justify-between sm:items-center bg-stone-50/50 gap-6">
              <h3 className="text-xl font-black uppercase tracking-tight font-outfit">
                Manifest Synchronization
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none h-10 rounded-none text-[9px] font-bold uppercase tracking-widest border-stone-200"
                >
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none h-10 rounded-none text-[9px] font-bold uppercase tracking-widest border-stone-200"
                >
                  Print Logs
                </Button>
              </div>
            </div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E5E0D8]">
                    <th className="p-8 text-[10px] uppercase tracking-[0.3em] font-black text-[#8B857A]">
                      Identification
                    </th>
                    <th className="p-8 text-[10px] uppercase tracking-[0.3em] font-black text-[#8B857A]">
                      Architect
                    </th>
                    <th className="p-8 text-[10px] uppercase tracking-[0.3em] font-black text-[#8B857A]">
                      Valuation
                    </th>
                    <th className="p-8 text-[10px] uppercase tracking-[0.3em] font-black text-[#8B857A]">
                      Operational Status
                    </th>
                    <th className="p-8 text-[10px] uppercase tracking-[0.3em] font-black text-[#8B857A]">
                      Execution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-stone-50/80 transition-all group"
                    >
                      <td className="p-8">
                        <p className="text-sm font-black uppercase tracking-tight group-hover:translate-x-1 transition-transform inline-block">
                          #{order.orderNumber}
                        </p>
                        <p className="text-[9px] text-[#BBB] font-bold uppercase tracking-widest mt-1">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center font-black text-xs text-stone-400 group-hover:bg-[#2C2926] group-hover:text-white transition-colors">
                            {order.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-tight">
                              {order.customerName}
                            </p>
                            <p className="text-[10px] text-[#8B857A] font-medium">
                              {order.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <p className="text-lg font-black font-outfit">
                          ${Number(order.totalAmount).toLocaleString()}
                        </p>
                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">
                          {order.items.length} PIECES
                        </p>
                      </td>
                      <td className="p-8">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="bg-stone-100 border-none outline-none text-[10px] font-black uppercase tracking-[0.2em] px-4 py-3 cursor-pointer hover:bg-[#2C2926] hover:text-white transition-all appearance-none pr-10 relative"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 10px center",
                            backgroundSize: "12px",
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PLACED">PLACED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="TRANSIT">TRANSIT</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-8">
                        <button className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-[#8B857A] hover:text-[#2C2926] transition-colors border-b border-transparent hover:border-[#2C2926] pb-1">
                          <ExternalLink size={12} /> View File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-stone-100">
              {orders.map((order) => (
                <div key={order.id} className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">
                        #{order.orderNumber}
                      </p>
                      <p className="text-[9px] text-[#BBB] font-bold uppercase tracking-widest mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xl font-black font-outfit">
                      ${Number(order.totalAmount).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 py-4 border-y border-stone-50">
                    <div className="w-10 h-10 bg-[#2C2926] text-white rounded-full flex items-center justify-center font-black text-xs">
                      {order.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">{order.customerName}</p>
                      <p className="text-[10px] text-[#8B857A] font-medium">{order.customerEmail}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#8B857A]">STATUS</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-stone-100 border-none outline-none text-[9px] font-black uppercase tracking-[0.1em] px-3 py-2 rounded-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PLACED">PLACED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="TRANSIT">TRANSIT</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-none text-[9px] font-black uppercase tracking-widest border-stone-200">
                      <ExternalLink size={12} className="mr-2" /> View Full Manifest
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white border border-[#E5E0D8] shadow-2xl overflow-hidden">
            <div className="p-6 md:p-10 border-b border-[#E5E0D8] flex flex-col sm:flex-row justify-between sm:items-center bg-stone-50/50 gap-4">
              <h3 className="text-xl font-black uppercase tracking-tight font-outfit">
                Architectural Roster
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B857A]">
                {users.length} Total Registered
              </p>
            </div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E5E0D8]">
                    <th className="p-8 text-[10px] uppercase tracking-[0.3em] font-black text-[#8B857A]">
                      Architect
                    </th>
                    <th className="p-8 text-[10px] uppercase tracking-[0.3em] font-black text-[#8B857A]">
                      Privileges
                    </th>
                    <th className="p-8 text-[10px] uppercase tracking-[0.3em] font-black text-[#8B857A]">
                      Commencement
                    </th>
                    <th className="p-8 text-[10px] uppercase tracking-[0.3em] font-black text-[#8B857A]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-stone-50/80 transition-all group"
                    >
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#2C2926] rounded-none flex items-center justify-center text-white font-black text-lg">
                            {user.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-tight">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-[#8B857A] font-medium">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <span
                          className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 ${user.role === "admin" ? "bg-[#2C2926] text-white" : "bg-stone-100 text-[#8B857A]"}`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="p-8 text-[10px] font-bold uppercase tracking-widest text-[#8B857A]">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-8">
                        <button className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B857A] hover:text-[#2C2926] transition-colors">
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-stone-100">
              {users.map((user) => (
                <div key={user.id} className="p-6 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#2C2926] text-white flex items-center justify-center font-black text-xl">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">{user.name}</p>
                      <p className="text-[10px] text-[#8B857A] font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-50">
                    <div>
                      <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1">PRIVILEGES</p>
                      <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 ${user.role === "admin" ? "bg-[#2C2926] text-white" : "bg-stone-100 text-[#8B857A]"}`}>
                        {user.role || "user"}
                      </span>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1">COMMENCEMENT</p>
                      <p className="text-[9px] font-bold uppercase tracking-tighter">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full h-12 rounded-none text-[9px] font-black uppercase tracking-widest border-stone-200">
                    Access Architect Profile
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal - Creative Floating Design */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#2C2926]/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
            >
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProduct(null);
                }}
                className="absolute top-6 right-6 p-2 hover:rotate-90 transition-transform duration-500 z-20"
              >
                <X size={24} />
              </button>

              {/* Left Column - Creative Header */}
              <div className="md:w-2/5 bg-[#2C2926] text-white p-16 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500 mb-8">
                    Vault Access
                  </p>
                  <h2 className="text-5xl font-black uppercase tracking-tighter font-outfit mb-8 leading-none">
                    {editingProduct ? "Revise Design." : "Catalog New Entry."}
                  </h2>
                  <p className="text-sm text-stone-400 font-medium leading-relaxed">
                    {editingProduct
                      ? "Update technical specifications and valuation for this existing piece."
                      : "Ensure all technical specifications, pricing, and high-fidelity imagery are prepared before submission."}
                  </p>
                </div>
                <div className="opacity-20">
                  <LayoutDashboard size={100} />
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="flex-1 p-8 md:p-16">
                <form
                  className="space-y-10"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const token = getAuthToken();
                    const url = editingProduct
                      ? `${ADMIN_API_BASE_URL}/products/${editingProduct.id}`
                      : `${ADMIN_API_BASE_URL}/products/create`;

                    try {
                      const res = await fetch(url, {
                        method: editingProduct ? "PATCH" : "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                        credentials: "include",
                      });

                      if (!res.ok) throw new Error("Operation failed");

                      toast.success(
                        editingProduct
                          ? "Design Updated."
                          : "Design Entry Successful.",
                      );
                      setIsModalOpen(false);
                      setEditingProduct(null);
                      fetchProducts();
                      fetchStats();
                    } catch {
                      toast.error("Transmission Failed.");
                    }
                  }}
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Design Title
                    </label>
                    <input
                      name="name"
                      required
                      defaultValue={editingProduct?.name}
                      type="text"
                      placeholder="E.G. SCANDINAVIAN LOUNGE CHAIR"
                      className="w-full bg-transparent border-b-2 border-stone-100 py-4 outline-none focus:border-[#2C2926] transition-colors text-sm font-bold uppercase tracking-tight"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Valuation ($)
                      </label>
                      <input
                        name="price"
                        required
                        defaultValue={editingProduct?.price}
                        type="number"
                        step="0.01"
                        placeholder="249.00"
                        className="w-full bg-transparent border-b-2 border-stone-100 py-4 outline-none focus:border-[#2C2926] transition-colors text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Units in Stock
                      </label>
                      <input
                        name="inventory"
                        required
                        defaultValue={editingProduct?.inventory}
                        type="number"
                        placeholder="10"
                        className="w-full bg-transparent border-b-2 border-stone-100 py-4 outline-none focus:border-[#2C2926] transition-colors text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Category
                      </label>
                      <select
                        name="category"
                        required
                        defaultValue={editingProduct?.category?.name}
                        className="w-full bg-transparent border-b-2 border-stone-100 py-4 outline-none focus:border-[#2C2926] transition-colors text-xs font-bold uppercase"
                      >
                        <option value="">Select Category</option>
                        <option value="Living Room">Living Room</option>
                        <option value="Bedroom">Bedroom</option>
                        <option value="Dining">Dining</option>
                        <option value="Office">Office</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Type
                      </label>
                      <select
                        name="type"
                        required
                        defaultValue={editingProduct?.type?.name}
                        className="w-full bg-transparent border-b-2 border-stone-100 py-4 outline-none focus:border-[#2C2926] transition-colors text-xs font-bold uppercase"
                      >
                        <option value="">Select Type</option>
                        <option value="Sofa">Sofa</option>
                        <option value="Chair">Chair</option>
                        <option value="Table">Table</option>
                        <option value="Storage">Storage</option>
                        <option value="Bed">Bed</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Narrative Description
                    </label>
                    <textarea
                      name="description"
                      required
                      defaultValue={editingProduct?.description}
                      rows={3}
                      placeholder="DESCRIBE THE PIECE'S SOUL..."
                      className="w-full bg-transparent border-b-2 border-stone-100 py-4 outline-none focus:border-[#2C2926] transition-colors text-sm font-medium resize-none"
                    />
                  </div>

                  <div className="relative border-2 border-dashed border-stone-200 p-8 text-center group hover:border-[#2C2926] transition-colors cursor-pointer">
                    <input
                      name="image"
                      type="file"
                      required={!editingProduct}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload
                      className="mx-auto text-stone-300 mb-4 group-hover:text-[#2C2926] transition-colors"
                      size={32}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      {editingProduct
                        ? "Update Imagery (Optional)"
                        : "Transmit High-Res Imagery"}
                    </p>
                    <p className="text-[8px] text-stone-400 mt-2 uppercase tracking-widest">
                      TAP TO BROWSE FILES
                    </p>
                  </div>

                  <div className="pt-6 pb-12 md:pb-0">
                    <Button
                      type="submit"
                      className="w-full h-16 bg-[#2C2926] rounded-none uppercase font-black tracking-[0.3em] text-[10px] shadow-2xl"
                    >
                      {editingProduct ? "Confirm Revision." : "Confirm Entry."}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
