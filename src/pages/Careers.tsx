import { MapPin, Clock, Users, Coffee, Rocket, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const departments = [
  "Design",
  "Engineering",
  "Marketing",
  "Operations",
  "Customer Success",
];

const jobs = [
  {
    title: "Senior Product Designer",
    department: "Design",
    location: "Remote / New York",
    type: "Full-time",
    description: "Shape the future of digital furniture shopping experiences.",
  },
  {
    title: "Frontend Engineer (React)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Build beautiful, performant interfaces using the latest web technologies.",
  },
  {
    title: "Supply Chain Manager",
    department: "Operations",
    location: "Chicago, IL",
    type: "Full-time",
    description:
      "Optimize our global logistics and sustainable sourcing initiatives.",
  },
  {
    title: "Content Marketing Specialist",
    department: "Marketing",
    location: "London, UK",
    type: "Contract",
    description:
      "Tell the story of craftsmanship and comfort through compelling narratives.",
  },
];

const benefits = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Inclusive Culture",
    description: "A diverse team where everyone's voice is heard and valued.",
  },
  {
    icon: <Coffee className="w-6 h-6" />,
    title: "Work-Life Balance",
    description:
      "Flexible hours and remote-first approach to keep you energized.",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Growth & Learning",
    description:
      "Generous budget for courses, books, and professional development.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Sustainability",
    description:
      "Join a company committed to ethical sourcing and eco-friendly practices.",
  },
];

export default function CareersPage() {
  return (
    <div className="bg-[#F9F8F6] text-[#2C2926]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#2C2926]">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <p className="text-sm tracking-[0.4em] uppercase mb-4 font-bold text-stone-400">
            Join Our Team
          </p>
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-8 font-outfit leading-none">
            Build the future <br /> of home
          </h1>
          <p className="max-w-2xl mx-auto text-stone-300 text-lg md:text-xl leading-relaxed">
            We're a team of designers, engineers, and makers on a mission to
            redefine how people experience comfort and style.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="group">
                <div className="mb-6 inline-flex p-4 bg-[#EBE7DF] rounded-none group-hover:bg-[#2C2926] group-hover:text-white transition-colors duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold uppercase mb-3 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-[#5C574F] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
                Open Roles.
              </h2>
              <p className="text-[#5C574F] text-lg">
                Explore our current opportunities and find where you fit in.
                We're always looking for talented individuals to join our
                journey.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-none border-[#2C2926] text-xs uppercase font-bold tracking-widest px-6 h-10"
              >
                All Roles
              </Button>
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant="ghost"
                  className="rounded-none text-xs uppercase font-bold tracking-widest px-6 h-10 text-[#8B857A] hover:text-[#2C2926]"
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="group bg-white border border-[#E5E0D8] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-[#2C2926] transition-all duration-300 hover:shadow-xl"
              >
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-[#EBE7DF] px-3 py-1 text-[#2C2926]">
                      {job.department}
                    </span>
                    <span className="flex items-center text-xs text-[#8B857A] font-medium">
                      <MapPin className="w-3 h-3 mr-1" /> {job.location}
                    </span>
                    <span className="flex items-center text-xs text-[#8B857A] font-medium">
                      <Clock className="w-3 h-3 mr-1" /> {job.type}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4 tracking-tight group-hover:text-stone-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-[#5C574F] leading-relaxed">
                    {job.description}
                  </p>
                </div>
                <Button className="bg-[#2C2926] text-white rounded-none h-14 px-10 uppercase font-bold tracking-widest text-xs hover:bg-stone-700 shrink-0">
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values/CTA */}
      <section className="py-24 bg-[#EBE7DF]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-8">
              Don't see a role for you?
            </h2>
            <p className="text-[#5C574F] text-lg mb-10">
              We're always growing and looking for passionate people. Send us
              your resume and tell us why you'd like to be part of the Tiger
              Balm team.
            </p>
            <Button
              variant="link"
              className="text-[#2C2926] font-bold underline text-xl uppercase tracking-widest"
            >
              General Application →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
