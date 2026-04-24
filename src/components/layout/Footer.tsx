import { Link } from "react-router";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-[#F9F8F6] text-[#2C2926] pt-16 pb-8 border-t border-[#E5E0D8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Newsletter & Brand */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 border-b border-[#E5E0D8] pb-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight font-outfit">
              Havenly.
            </h2>
            <p className="text-[#5C574F] max-w-md text-sm leading-relaxed">
              Elevate your living space with our thoughtfully curated collection
              of modern, minimalist furniture. Designed for comfort, built to
              last.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="#"
                className="p-2 bg-[#EBE7DF] rounded-full hover:bg-[#2C2926] hover:text-[#F9F8F6] transition-all duration-300"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-[#EBE7DF] rounded-full hover:bg-[#2C2926] hover:text-[#F9F8F6] transition-all duration-300"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-[#EBE7DF] rounded-full hover:bg-[#2C2926] hover:text-[#F9F8F6] transition-all duration-300"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-medium mb-4 uppercase tracking-widest text-sm">
              Join our Newsletter
            </h3>
            <p className="text-[#5C574F] text-sm mb-6">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <div className="flex w-full max-w-md items-center space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B857A]" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-[#EBE7DF] border-[#D6D0C4] text-[#2C2926] placeholder:text-[#8B857A] pl-10 h-12 rounded-none focus-visible:ring-1 focus-visible:ring-[#2C2926]"
                />
              </div>
              <Button
                type="submit"
                className="h-12 rounded-none bg-[#2C2926] text-[#F9F8F6] hover:bg-[#4A453F] px-6 uppercase text-xs font-bold tracking-widest transition-transform active:scale-95"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold uppercase tracking-widest text-xs mb-2">
              Shop
            </h4>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Living Room
            </Link>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Bedroom
            </Link>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Dining
            </Link>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Workspace
            </Link>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Accessories
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold uppercase tracking-widest text-xs mb-2">
              Company
            </h4>
            <Link
              to="/about"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Our Story
            </Link>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Careers
            </Link>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Press
            </Link>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Sustainability
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold uppercase tracking-widest text-xs mb-2">
              Support
            </h4>
            <Link
              to="/faq"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Shipping & Returns
            </Link>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Care Guide
            </Link>
            <Link
              to="/contact"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="#"
              className="text-[#5C574F] hover:text-[#2C2926] text-sm transition-colors"
            >
              Track Order
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold uppercase tracking-widest text-xs mb-2">
              Contact Us
            </h4>
            <div className="flex items-start gap-3 text-sm text-[#5C574F]">
              <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
              <p>
                123 Furniture Avenue,
                <br />
                Design District, NY 10001
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#5C574F] mt-2">
              <Phone className="h-4 w-4 shrink-0" />
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#5C574F] mt-2">
              <Mail className="h-4 w-4 shrink-0" />
              <p>hello@havenly.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-[#E5E0D8] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8B857A]">
          <p>
            © {new Date().getFullYear()} Havenly Furniture Store. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="hover:text-[#2C2926] transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-[#2C2926] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
