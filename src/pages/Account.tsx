import { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
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
  MapPin
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function AccountPage() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  
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
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4 font-outfit">Access Denied.</h1>
        <p className="text-[#8B857A] mb-8 font-medium">Please sign in to manage your architectural sanctuary.</p>
        <Button 
          onClick={() => window.location.href = "/login"}
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
      <section className="relative h-[40vh] flex items-end overflow-hidden bg-[#2C2926] text-white py-12">
         <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
         </div>
         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="flex items-end gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 md:w-48 md:h-48 border-8 border-[#F9F8F6] bg-stone-800 overflow-hidden shadow-2xl">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl font-bold opacity-20">{session.user.name.charAt(0)}</div>
                    )}
                  </div>
                  <button className="absolute -right-4 -bottom-4 bg-white text-[#2C2926] p-3 shadow-xl hover:scale-110 transition-transform">
                    <Camera size={20} />
                  </button>
                </div>
                <div className="mb-2">
                  <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-2">My Sanctuary</p>
                  <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase font-outfit leading-none">{session.user.name}.</h1>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-12 mb-2 text-stone-400">
                <div>
                   <p className="text-2xl font-bold text-white font-outfit">2026</p>
                   <p className="text-[10px] uppercase tracking-widest font-bold">Member Since</p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                   <p className="text-2xl font-bold text-white font-outfit">10</p>
                   <p className="text-[10px] uppercase tracking-widest font-bold">Orders Placed</p>
                </div>
              </div>
            </div>
         </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-20">
          {/* Minimalist Navigation Sidebar */}
          <aside>
            <nav className="space-y-1">
              {[
                { id: "profile", label: "Account Info", icon: <User size={16} /> },
                { id: "security", label: "Security & Login", icon: <Lock size={16} /> },
                { id: "orders", label: "Purchase History", icon: <ShoppingBag size={16} /> },
                { id: "billing", label: "Billing & Cards", icon: <CreditCard size={16} /> },
                { id: "addresses", label: "Shipping Books", icon: <MapPin size={16} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
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
                    <span className="text-xs font-bold uppercase tracking-widest">Settings / Profile</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 leading-none">Your Identity.</h2>
                  <p className="text-lg text-[#5C574F] leading-relaxed mb-12 border-l-2 border-[#2C2926] pl-8">
                    Manage your personal information and how we address you. These details help us curate a more personalized showroom experience.
                  </p>

                  <form onSubmit={handleUpdateProfile} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">Full Legal Name</Label>
                        <Input 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">Age Group</Label>
                        <Input 
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                          className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">Identity / Gender</Label>
                        <select 
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
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
                        {loading ? <Spinner className="h-4 w-4" /> : <>Commit Changes <ArrowRight size={16} /></>}
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
                    <span className="text-xs font-bold uppercase tracking-widest">Communication / Authentication</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-10 leading-none">Access Email.</h2>
                  
                  <form onSubmit={handleChangeEmail} className="space-y-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">Current Address</Label>
                      <Input 
                        type="email"
                        value={emailData.email}
                        onChange={(e) => setEmailData({...emailData, email: e.target.value})}
                        className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                      />
                    </div>
                    <Button 
                      disabled={loading}
                      variant="outline"
                      className="h-14 px-10 rounded-none border-[#2C2926] uppercase font-bold tracking-widest text-[10px]"
                    >
                      {loading ? <Spinner className="h-4 w-4" /> : "Verify & Update Email"}
                    </Button>
                  </form>
                </div>

                {/* Password Section */}
                <div>
                   <div className="flex items-center gap-3 mb-4 text-[#8B857A]">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Digital Vault / Encryption</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-10 leading-none">Security Key.</h2>
                  
                  <form onSubmit={handleChangePassword} className="space-y-12">
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">Current Password</Label>
                        <Input 
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">New Password</Label>
                          <Input 
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B857A]">Confirm Key</Label>
                          <Input 
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="rounded-none border-0 border-b-2 border-[#E5E0D8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2C2926] px-0 h-14 text-xl font-bold transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <Button 
                      disabled={loading}
                      className="h-16 px-12 rounded-none bg-[#2C2926] text-white uppercase font-bold tracking-[0.2em] text-xs shadow-xl"
                    >
                      {loading ? <Spinner className="h-4 w-4" /> : "Re-encrypt Password"}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {activeSection !== "profile" && activeSection !== "security" && (
               <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-[#E5E0D8]">
                 <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                   <Settings size={32} className="text-[#8B857A] animate-spin-slow" />
                 </div>
                 <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Module Under Construction</h3>
                 <p className="text-[#8B857A] max-w-sm">We are currently architecting this portion of your sanctuary experience. Please check back shortly.</p>
               </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
