import { useState } from "react";
import { Plus, Minus, Search, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "Ordering",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. For larger furniture orders, we also offer financing options through Affirm."
      },
      {
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or cancelled within 24 hours of placement. After this window, our team begins the crafting or shipping process. Please contact our support team immediately for any changes."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long will it take for my furniture to arrive?",
        a: "In-stock items typically ship within 3-5 business days. Made-to-order pieces usually take 4-8 weeks for craftsmanship and delivery. You will receive a tracking number as soon as your order leaves our workshop."
      },
      {
        q: "Do you offer White Glove Delivery?",
        a: "Yes! Our White Glove Delivery service includes bringing the item into your room of choice, full assembly, and removal of all packaging materials for a flat fee of $199."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return window for most items. Furniture must be in its original condition. Please note that a 15% restocking fee applies to large furniture returns, and original shipping fees are non-refundable."
      }
    ]
  },
  {
    category: "Product Care",
    questions: [
      {
        q: "How do I care for my wood furniture?",
        a: "To maintain the beauty of your wood pieces, dust regularly with a soft, dry cloth. Avoid direct sunlight and extreme humidity changes. For spills, wipe immediately with a slightly damp cloth followed by a dry one."
      }
    ]
  }
];

function AccordionItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#E5E0D8] last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-stone-600 transition-colors"
      >
        <span className="text-lg font-bold uppercase tracking-tight">{question}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBE7DF] shrink-0 ml-4">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-8' : 'max-h-0'}`}>
        <p className="text-[#5C574F] leading-relaxed max-w-3xl">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="bg-[#F9F8F6] text-[#2C2926] min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-[#EBE7DF]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-bold text-[#8B857A]">Support Center</p>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 font-outfit">
            FAQ.
          </h1>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B857A]" />
            <Input 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-[#E5E0D8] pl-12 h-14 rounded-none focus-visible:ring-[#2C2926] shadow-sm text-lg"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((cat, idx) => (
                <div key={idx} className="mb-16 last:mb-0">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B857A] mb-8 border-l-4 border-[#2C2926] pl-4">
                    {cat.category}
                  </h2>
                  <div className="bg-white border border-[#E5E0D8] px-8 shadow-sm">
                    {cat.questions.map((q, qIdx) => (
                      <AccordionItem key={qIdx} question={q.q} answer={q.a} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-[#5C574F]">No results found for "{searchQuery}"</p>
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-[#2C2926] font-bold underline"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-[#E5E0D8]">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-[#2C2926] text-[#F9F8F6] p-12 md:p-20 relative overflow-hidden group">
            <MessageCircle className="absolute -right-10 -bottom-10 h-64 w-64 text-white/5 rotate-12 transition-transform group-hover:scale-110" />
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6 relative z-10">
              Still Have Questions?
            </h2>
            <p className="text-[#8B857A] text-lg mb-10 max-w-xl mx-auto relative z-10">
              Our dedicated support team is here to help you find the perfect piece for your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/contact">
                <Button className="h-14 px-10 bg-[#F9F8F6] text-[#2C2926] hover:bg-white rounded-none uppercase font-bold tracking-widest text-xs">
                  Contact Support
                </Button>
              </Link>
              <Button variant="outline" className="h-14 px-10 border-[#8B857A] text-[#8B857A] hover:bg-[#8B857A]/10 rounded-none uppercase font-bold tracking-widest text-xs">
                Call +1 (555) 123-4567
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
