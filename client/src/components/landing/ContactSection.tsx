import { useState } from "react";
import { Smartphone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ fullName: "", phoneNumber: "", restaurantName: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      toast({ title: "Inquiry Sent!", description: "We'll get back to you shortly.", variant: "default" });
      setFormData({ fullName: "", phoneNumber: "", restaurantName: "", message: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white text-black border-t-2 border-black">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-16 lg:gap-20">
          <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-black leading-[0.9] tracking-tighter uppercase">
              Got Questions? <br /><span className="text-primary italic">Let's Talk.</span>
            </h2>

            <p className="hidden sm:block text-lg sm:text-xl font-bold opacity-70 max-w-md leading-relaxed">
              Whether you need a custom enterprise solution or just want to learn how OrderJi can transform your venue, our experts are ready.
            </p>
            <p className="sm:hidden text-sm font-bold opacity-70 leading-relaxed">
              Ready to transform your venue? Contact our team.
            </p>

            <div className="space-y-3 sm:space-y-5 pt-2 sm:pt-4">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-black/5 hover:bg-black/10 transition-colors w-fit border border-black/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white flex items-center justify-center">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="font-black uppercase tracking-widest text-sm sm:text-base pr-4">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-black/5 hover:bg-black/10 transition-colors w-fit border border-black/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white flex items-center justify-center">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="font-black uppercase tracking-widest text-sm sm:text-base pr-4">hello@orderji.in</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-black text-white p-6 sm:p-10 lg:p-12 border-2 sm:border-4 border-black relative shadow-[8px_8px_0px_0px_rgba(255,0,34,1)] sm:shadow-[15px_15px_0px_0px_rgba(255,0,34,1)] mb-4 sm:mb-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(255,0,34,0.4),transparent_60%)] pointer-events-none" />

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 sm:mb-8">Send an Inquiry</h3>
              <form className="space-y-4 sm:space-y-6" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-70">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      className="w-full bg-white/5 border border-white/20 p-3 sm:p-4 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:bg-white/10 transition-all text-sm sm:text-base"
                      placeholder="Rohit Singh"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-70">Phone Number</label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleFormChange}
                      className="w-full bg-white/5 border border-white/20 p-3 sm:p-4 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:bg-white/10 transition-all text-sm sm:text-base"
                      placeholder="+91 00000 00000"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="restaurantName" className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-70">Restaurant Name</label>
                  <input
                    id="restaurantName"
                    name="restaurantName"
                    type="text"
                    value={formData.restaurantName}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/20 p-3 sm:p-4 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:bg-white/10 transition-all text-sm sm:text-base"
                    placeholder="The Spice Garden"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2 hidden sm:block">
                  <label htmlFor="message" className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-70">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/20 p-3 sm:p-4 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:bg-white/10 transition-all resize-none text-sm sm:text-base"
                    placeholder="Tell us about your requirements..."
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 sm:h-16 mt-2 sm:mt-4 text-base sm:text-lg tracking-widest uppercase font-black bg-primary text-white hover:bg-primary/90 rounded-none hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Submit Inquiry"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
