import { Shield, Lock, Eye, Database, Mail } from "lucide-react";

const sections = [
  {
    id: "collection",
    title: "Information Collection",
    icon: <Database className="w-5 h-5" />,
    content:
      "We collect information you provide directly to us, such as when you create an account, make a purchase, or communicate with us. This includes your name, email address, phone number, shipping address, and payment information.",
  },
  {
    id: "usage",
    title: "How We Use Information",
    icon: <Eye className="w-5 h-5" />,
    content:
      "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices, and communicate with you about products, services, and events offered by Tiger Balm.",
  },
  {
    id: "sharing",
    title: "Information Sharing",
    icon: <Lock className="w-5 h-5" />,
    content:
      "We do not share your personal information with third parties except as described in this policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.",
  },
  {
    id: "security",
    title: "Security Measures",
    icon: <Shield className="w-5 h-5" />,
    content:
      "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the internet is 100% secure.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F9F8F6] text-[#2C2926] min-h-screen">
      {/* Header */}
      <section className="py-20 md:py-32 bg-[#2C2926] text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-sm tracking-[0.4em] uppercase mb-4 font-bold text-stone-400">
            Your Privacy Matters
          </p>
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-8 font-outfit">
            Privacy Policy
          </h1>
          <p className="text-stone-300 text-lg md:text-xl leading-relaxed max-w-2xl">
            We are committed to protecting your personal information and your
            right to privacy. This policy explains what information we collect
            and how we use it.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr] gap-16">
            <aside className="space-y-12">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B857A] mb-6">
                  Quick Links
                </h4>
                <nav className="flex flex-col gap-4">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="text-sm font-bold uppercase tracking-tight hover:text-[#8B857A] flex items-center gap-3 group transition-colors"
                    >
                      <span className="p-2 bg-[#EBE7DF] text-[#2C2926] group-hover:bg-[#2C2926] group-hover:text-white transition-colors">
                        {section.icon}
                      </span>
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="p-8 bg-[#EBE7DF] border-l-4 border-[#2C2926]">
                <h5 className="font-bold uppercase tracking-tight mb-2">
                  GDPR Compliance
                </h5>
                <p className="text-sm text-[#5C574F] leading-relaxed">
                  We are fully compliant with GDPR regulations for our European
                  customers. You have the right to access, correct, or delete
                  your data at any time.
                </p>
              </div>
            </aside>

            <div className="space-y-24">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-5xl font-bold text-[#EBE7DF] font-outfit leading-none">
                      0{sections.indexOf(section) + 1}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-[#5C574F] leading-relaxed text-lg space-y-6">
                    <p>{section.content}</p>
                    <p>
                      At Tiger Balm, we believe that your data belongs to you.
                      We never sell your personal information to third-party
                      advertisers. Our systems are designed with privacy-first
                      principles to ensure your shopping experience is both
                      secure and personal.
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-[#E5E0D8] pt-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 shadow-sm border border-[#E5E0D8]">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-2">
                      Request Your Data
                    </h3>
                    <p className="text-[#5C574F]">
                      Want to see exactly what information we have on file?
                      Request a data export.
                    </p>
                  </div>
                  <button className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs border-b-2 border-[#2C2926] pb-1 hover:text-[#8B857A] hover:border-[#8B857A] transition-all">
                    Request Export <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
