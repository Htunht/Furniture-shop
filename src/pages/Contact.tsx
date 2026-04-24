import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="bg-[#F9F8F6] text-[#2C2926] min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-[#EBE7DF]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-bold text-[#8B857A]">Get in Touch</p>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 font-outfit">
            Contact Us.
          </h1>
          <p className="text-lg md:text-xl text-[#5C574F] max-w-2xl mx-auto font-light leading-relaxed">
            Whether you have a question about our collections, need help with an order, or just want to say hello, we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 shadow-sm border border-[#E5E0D8]">
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-8">Send a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#8B857A]">First Name</label>
                    <Input placeholder="John" className="rounded-none border-[#E5E0D8] focus-visible:ring-[#2C2926] h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#8B857A]">Last Name</label>
                    <Input placeholder="Doe" className="rounded-none border-[#E5E0D8] focus-visible:ring-[#2C2926] h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#8B857A]">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="rounded-none border-[#E5E0D8] focus-visible:ring-[#2C2926] h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#8B857A]">Message</label>
                  <Textarea placeholder="How can we help you?" className="rounded-none border-[#E5E0D8] focus-visible:ring-[#2C2926] min-h-[150px] resize-none" />
                </div>
                <Button className="w-full h-14 bg-[#2C2926] text-[#F9F8F6] hover:bg-[#4A453F] rounded-none uppercase font-bold tracking-widest text-xs transition-all active:scale-[0.98]">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info & Map */}
            <div className="flex flex-col gap-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-widest">Store Address</h3>
                  <div className="flex items-start gap-3 text-[#5C574F]">
                    <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-[#8B857A]" />
                    <p className="text-sm leading-relaxed">
                      123 Furniture Avenue,<br />
                      Design District, NY 10001
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-widest">Business Hours</h3>
                  <p className="text-sm text-[#5C574F] leading-relaxed">
                    Mon - Fri: 9:00 AM - 8:00 PM<br />
                    Sat - Sun: 10:00 AM - 6:00 PM
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-widest">Direct Contact</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-[#5C574F]">
                      <Phone className="h-4 w-4 shrink-0 text-[#8B857A]" />
                      <p className="text-sm">+1 (555) 123-4567</p>
                    </div>
                    <div className="flex items-center gap-3 text-[#5C574F]">
                      <Mail className="h-4 w-4 shrink-0 text-[#8B857A]" />
                      <p className="text-sm">hello@havenly.com</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-widest">Follow Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="p-2 bg-[#EBE7DF] rounded-full hover:bg-[#2C2926] hover:text-[#F9F8F6] transition-all">
                      <Instagram size={18} />
                    </a>
                    <a href="#" className="p-2 bg-[#EBE7DF] rounded-full hover:bg-[#2C2926] hover:text-[#F9F8F6] transition-all">
                      <Facebook size={18} />
                    </a>
                    <a href="#" className="p-2 bg-[#EBE7DF] rounded-full hover:bg-[#2C2926] hover:text-[#F9F8F6] transition-all">
                      <Twitter size={18} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="w-full h-[300px] bg-[#EBE7DF] border border-[#E5E0D8] overflow-hidden grayscale contrast-125">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2smm!4v1714150000000!5m2!1sen!2smm" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
