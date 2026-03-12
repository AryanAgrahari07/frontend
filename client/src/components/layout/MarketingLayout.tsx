import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 text-white ${isScrolled ? "bg-black/95 backdrop-blur-md border-b border-white/10 shadow-lg py-0" : "bg-transparent border-transparent py-2"}`}>
        <div className={`container mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"}`}>
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt="Orderzi Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-md" />
              <div className="hidden sm:block text-2xl md:text-3xl font-heading font-black tracking-tighter">
                <span className="text-white">Order</span><span className="text-primary">zi</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <Link href="/auth">
              <div className="text-xs sm:text-sm font-medium hover:text-white/80 transition-colors cursor-pointer">Log in</div>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="text-xs sm:text-sm font-semibold shadow-lg shadow-primary/20 h-8 sm:h-9 px-3 sm:px-4">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {children}
      </main>

      <footer className="bg-black text-white pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 border-t-2 sm:border-t-4 border-black border-t-white/10 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 md:gap-8 lg:gap-12 mb-16 sm:mb-20">
            {/* Brand Column */}
            <div className="md:col-span-5 lg:col-span-4 space-y-6 sm:space-y-8">
              <Link href="/">
                <div className="flex flex-col items-start gap-4 cursor-pointer hover:opacity-90 transition-opacity">
                  {/* <div className="flex items-center justify-center p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl">
                    <img src="/logo.png" alt="Orderzi Logo" className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl hover:scale-105 transition-transform" />
                  </div> */}
                  <div className="text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tighter">
                    <span className="text-white">Order</span><span className="text-primary">zi</span>
                  </div>
                </div>
              </Link>
              <p className="text-base sm:text-lg text-white/50 font-bold leading-relaxed max-w-sm">
                Speed, power, scale.
              </p>
              <div className="flex gap-4 pt-2">
                <Button variant="outline" size="icon" className="w-12 h-12 rounded-none border-2 border-white/20 bg-transparent hover:bg-white hover:text-black hover:border-white transition-all">
                  <span className="font-black">X</span>
                </Button>
                <Button variant="outline" size="icon" className="w-12 h-12 rounded-none border-2 border-white/20 bg-transparent hover:bg-white hover:text-black hover:border-white transition-all">
                  <span className="font-black">IN</span>
                </Button>
                <Button variant="outline" size="icon" className="w-12 h-12 rounded-none border-2 border-white/20 bg-transparent hover:bg-white hover:text-black hover:border-white transition-all">
                  <span className="font-black">IG</span>
                </Button>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10">
              <div>
                <h4 className="font-black uppercase tracking-widest text-sm sm:text-base text-primary mb-6">Product</h4>
                <ul className="space-y-4 text-sm sm:text-base font-bold text-white/70">
                  <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Features</a></li>
                  <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Hardware</a></li>
                  <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Pricing</a></li>
                  <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Enterprise</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-sm sm:text-base text-primary mb-6">Company</h4>
                <ul className="space-y-4 text-sm sm:text-base font-bold text-white/70">
                  <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">About Us</a></li>
                  <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Careers</a></li>
                  <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Blog</a></li>
                  <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact</a></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 border-white/10 pt-8 sm:pt-0 mt-2 sm:mt-0">
                <h4 className="font-black uppercase tracking-widest text-sm sm:text-base text-primary mb-6">Legal</h4>
                <ul className="space-y-4 text-sm sm:text-base font-bold text-white/70 flex flex-row sm:flex-col gap-6 sm:gap-0 flex-wrap">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Data Security</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 sm:pt-10 border-t-2 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white/40">
              © {new Date().getFullYear()} Order<span className="text-primary">zi</span> Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-veg animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-white/60">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}