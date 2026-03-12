import {
  Smartphone, MousePointer2, Users, Layers, Globe, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white text-black overflow-hidden border-b-2 sm:border-b-4 border-black">
      <div className="container mx-auto px-4 sm:px-6 mb-10 sm:mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[0.9] tracking-tighter uppercase">
          Everything You Need. <br /><span className="text-primary italic">In One Place.</span>
        </h2>
        <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-black/60 font-bold max-w-2xl">
          From the kitchen to the customer's phone, Order<span className="text-primary">zi</span> handles every aspect of your restaurant operations with unmatched speed.
        </p>
      </div>

      <div className="w-full overflow-x-auto pb-12 pt-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-4 sm:gap-6 lg:gap-8 w-max px-4 sm:px-6 container mx-auto">
          {[
            { icon: Smartphone, title: "Live QR Menu", desc: "Instantly update prices, items, and availability without reprinting anything." },
            { icon: MousePointer2, title: "Mobile POS", desc: "Take orders directly at the table on any mobile device. Full sync instantly." },
            { icon: Users, title: "Staff Management", desc: "Track shifts, performance, and role-based access controls for your team." },
            { icon: Layers, title: "Inventory Tracker", desc: "Real-time stock depletion and smart low-stock alerts before you run out." },
            { icon: Globe, title: "Multi-language", desc: "Serve your customers in English, Hindi, and Spanish without friction." }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="w-[85vw] max-w-[320px] sm:w-[340px] lg:w-[380px] snap-center p-6 sm:p-8 md:p-10 border-2 sm:border-4 border-black bg-white flex flex-col hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(255,0,34,1)] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] group-hover:bg-primary/20 transition-colors pointer-events-none" />
                <div className="mb-6 sm:mb-8 text-primary p-3 sm:p-4 bg-black/5 w-fit border-2 border-transparent group-hover:border-black/10 group-hover:bg-white transition-all">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-3 sm:mb-4">{feature.title}</h3>
                <p className="font-bold opacity-70 text-sm sm:text-base leading-relaxed">{feature.desc}</p>
                <div className="mt-8 flex items-center font-black uppercase text-xs tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
