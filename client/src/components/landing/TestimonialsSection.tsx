import { Quote, Star } from "lucide-react";
import testimonial1 from "@/assets/images/testimonial-1.jpg";
import testimonial2 from "@/assets/images/testimonial-2.jpg";
import testimonial3 from "@/assets/images/testimonial-3.jpg";

export default function TestimonialsSection() {
  return (
    <>
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-veg text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <Quote className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-6 sm:mb-8 md:mb-10 fill-current opacity-20" />
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-heading font-black italic tracking-tighter mb-8 sm:mb-10 md:mb-12 uppercase leading-tight px-4">
            "Switching to OrderJi was the fastest decision we ever made. The ROI was immediate. Don't think twice—just do it."
          </h3>
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-none border-2 sm:border-3 md:border-4 border-white shadow-2xl overflow-hidden grayscale">
              <img src={testimonial1} className="w-full h-full object-cover" />
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-widest">Vikram Sethi • Owner, Spice Garden Mumbai</p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white text-black overflow-hidden border-b-2 sm:border-b-4 border-black relative">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-black/5 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 mb-10 sm:mb-16 text-center relative">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[0.9] tracking-tighter uppercase">
            Trusted By The <br /><span className="text-primary italic">Best.</span>
          </h2>
        </div>

        <div className="w-full overflow-x-auto pb-16 pt-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-4 sm:gap-6 w-max px-4 sm:px-6 container mx-auto">
            {[
              { img: testimonial1, name: "Vikram Sethi", role: "Spice Garden", quote: "Switching to OrderJi was the fastest decision we ever made." },
              { img: testimonial2, name: "Priya Sharma", role: "Coastal Bites", quote: "Our table turnover rate increased by 30% in the first month." },
              { img: testimonial3, name: "Rahul Desai", role: "The Urban Wok", quote: "The KDS is instantly updating. Zero missed orders now." },
              { img: testimonial1, name: "Anita Roy", role: "Cafe Mocha", quote: "Customers love the digital menu. Billing is a breeze." },
            ].map((testimonial, i) => (
              <div key={i} className="w-[85vw] sm:w-[500px] lg:w-[600px] snap-center p-6 sm:p-10 border-2 sm:border-4 border-black bg-black text-white relative flex flex-col hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(255,0,34,1)] transition-all duration-300">
                <Quote className="absolute top-6 right-6 w-10 h-10 sm:w-16 sm:h-16 text-white/5 pointer-events-none" />
                <div className="flex gap-1 text-primary mb-6 sm:mb-8">
                  {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />)}
                </div>
                <p className="text-lg sm:text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-8 sm:mb-12 leading-tight drop-shadow-md">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={testimonial.img} className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-white object-cover grayscale opacity-80" />
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-sm sm:text-base text-white">{testimonial.name}</h4>
                    <p className="text-[10px] sm:text-xs uppercase text-primary font-bold tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
