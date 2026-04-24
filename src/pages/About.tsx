import { MapPin, Users, Award, Store } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#F9F8F6] text-[#2C2926] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1920&q=80" 
            alt="Havenly Furniture Studio" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-bold text-white/90">Est. 1998</p>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 font-outfit">
            Crafting Comfort.
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            For over two decades, we've been dedicated to designing furniture that brings warmth, elegance, and enduring quality into your home.
          </p>
        </div>
      </section>
 
      {/* Stats Section */}
      <section className="py-20 border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Award className="h-8 w-8 text-[#8B857A]" />
              <div>
                <h3 className="text-4xl font-bold mb-2">25+</h3>
                <p className="text-sm uppercase tracking-widest text-[#5C574F] font-bold">Years of Excellence</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Store className="h-8 w-8 text-[#8B857A]" />
              <div>
                <h3 className="text-4xl font-bold mb-2">12</h3>
                <p className="text-sm uppercase tracking-widest text-[#5C574F] font-bold">Physical Stores</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Users className="h-8 w-8 text-[#8B857A]" />
              <div>
                <h3 className="text-4xl font-bold mb-2">500+</h3>
                <p className="text-sm uppercase tracking-widest text-[#5C574F] font-bold">Artisans & Staff</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <MapPin className="h-8 w-8 text-[#8B857A]" />
              <div>
                <h3 className="text-4xl font-bold mb-2">30k+</h3>
                <p className="text-sm uppercase tracking-widest text-[#5C574F] font-bold">Happy Homes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Stores Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6">Our Flagship Stores</h2>
            <p className="text-[#5C574F] text-lg leading-relaxed">
              Experience our collections in person. Our carefully designed showrooms are created to inspire your next home project, featuring our latest pieces in beautifully curated room settings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80" 
                alt="New York Store" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl font-bold uppercase tracking-widest mb-2">New York</h3>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  <MapPin size={16} /> 123 Design District, NY 10001
                </p>
              </div>
            </div>
            <div className="group relative overflow-hidden h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" 
                alt="Los Angeles Store" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl font-bold uppercase tracking-widest mb-2">Los Angeles</h3>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  <MapPin size={16} /> 456 Melrose Ave, West Hollywood
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-24 bg-[#EBE7DF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6">Meet the Visionaries</h2>
            <p className="text-[#5C574F] text-lg leading-relaxed">
              Behind every perfectly angled chair and immaculately finished table is a team of passionate designers, master craftsmen, and visionary leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: "Eleanor Wright",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
              },
              {
                name: "Julian Brooks",
                role: "Head of Design",
                image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80"
              },
              {
                name: "Sophia Chen",
                role: "Master Artisan",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
              }
            ].map((person, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="relative w-64 h-80 mb-6 overflow-hidden">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">{person.name}</h3>
                <p className="text-sm font-bold uppercase tracking-widest text-[#8B857A]">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
