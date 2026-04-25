import {
  ScrollText,
  ShieldCheck,
  Scale,
  History,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content:
      "By accessing and using the Tiger Balm website and services, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services. These terms apply to all visitors, users, and others who access or use the service.",
  },
  {
    id: "orders",
    title: "Orders and Payments",
    content:
      "We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. Prices for our products are subject to change without notice.",
  },
  {
    id: "shipping",
    title: "Shipping and Delivery",
    content:
      "Delivery times are estimates and not guaranteed. Tiger Balm is not responsible for delays caused by shipping carriers or customs. Risk of loss and title for items purchased from Tiger Balm pass to you upon delivery of the items to the carrier.",
  },
  {
    id: "returns",
    title: "Returns and Refunds",
    content:
      "Our return policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we cannot offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it.",
  },
  {
    id: "intellectual",
    title: "Intellectual Property",
    content:
      "The Service and its original content, features, and functionality are and will remain the exclusive property of Tiger Balm and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Tiger Balm.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#F9F8F6] text-[#2C2926] min-h-screen">
      {/* Header */}
      <section className="py-20 bg-[#EBE7DF] border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-6 text-[#8B857A]">
            <Scale className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-[0.3em]">
              Legal
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 font-outfit">
            Terms of Service
          </h1>
          <div className="flex flex-wrap gap-8 items-center text-[#5C574F]">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="text-sm">Last Updated: April 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <ScrollText className="w-4 h-4" />
              <span className="text-sm">Version 2.4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">
            {/* Sidebar Navigation */}
            <aside className="hidden md:block sticky top-32 h-fit">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B857A] mb-8">
                Table of Contents
              </h4>
              <nav className="flex flex-col gap-4">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm font-bold uppercase tracking-tight hover:text-[#8B857A] flex items-center justify-between group transition-colors"
                  >
                    {section.title}
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="space-y-20">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6 flex items-center gap-4">
                    <span className="w-10 h-1px bg-[#2C2926] inline-block" />
                    {section.title}
                  </h2>
                  <div className="text-[#5C574F] leading-relaxed text-lg space-y-4">
                    <p>{section.content}</p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                </div>
              ))}

              <div className="bg-[#EBE7DF] p-10 md:p-16 text-center">
                <ShieldCheck className="w-12 h-12 mx-auto mb-6 text-[#2C2926]" />
                <h3 className="text-2xl font-bold uppercase mb-4">
                  Questions about our terms?
                </h3>
                <p className="text-[#5C574F] mb-8">
                  If you have any questions or concerns regarding these terms,
                  please contact our legal team.
                </p>
                <button className="bg-[#2C2926] text-white px-10 py-4 uppercase font-bold tracking-widest text-xs hover:bg-stone-700 transition-colors">
                  Contact Legal Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
