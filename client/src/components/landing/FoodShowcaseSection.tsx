import { ChefHat, Zap } from "lucide-react";
import food1 from "@/assets/images/food-indian-1.jpg";
import food2 from "@/assets/images/food-indian-2.jpg";
import food3 from "@/assets/images/food-indian-3.jpg";
import food4 from "@/assets/images/rooftop-indian.jpg";

export default function FoodShowcaseSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-black text-white relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 lg:gap-24 items-center">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <img src={food1} className="w-full h-40 sm:h-52 md:h-64 lg:h-80 object-cover border border-white sm:border-2 urgency-shadow" />
            <img src={food2} className="w-full h-40 sm:h-52 md:h-64 lg:h-80 object-cover border border-white sm:border-2 mt-4 sm:mt-6 md:mt-8" />
            <img src={food3} className="w-full h-40 sm:h-52 md:h-64 lg:h-80 object-cover border border-white sm:border-2 -mt-4 sm:-mt-6 md:-mt-8" />
            <img src={food4} className="w-full h-40 sm:h-52 md:h-64 lg:h-80 object-cover border border-white sm:border-2" />
          </div>
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-black leading-[0.9] tracking-tighter uppercase">
              Feed the <br /><span className="text-primary italic">Hunger.</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 font-medium leading-relaxed">
              Your menu should be as fast as your kitchen. Order<span className="text-primary">zi</span> provides a high-intensity visual experience that converts browsers into diners in seconds.
            </p>
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="flex items-center gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6 bg-white/5 border-l-4 sm:border-l-6 md:border-l-8 border-veg transition-all hover:bg-white/10">
                <ChefHat className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-primary flex-shrink-0" />
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase italic tracking-tighter">Optimized for Peak Performance</p>
              </div>
              <div className="flex items-center gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6 bg-white/5 border-l-4 sm:border-l-6 md:border-l-8 border-veg transition-all hover:bg-white/10">
                <Zap className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-primary flex-shrink-0" />
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase italic tracking-tighter">Lightning Fast Load Speeds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
