import MarketingLayout from "@/components/layout/MarketingLayout";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <MarketingLayout>
      <div className="pt-32 pb-20 bg-[#fafafc] min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-black/[0.05]"
          >
            <h1 className="text-3xl sm:text-4xl font-heading font-black mb-8 text-foreground">
              Privacy Policy
            </h1>
            
            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground space-y-6">
              <p>Last updated: {new Date().toLocaleDateString()}</p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Introduction</h2>
              <p>
                Welcome to Orderzi. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our 
                website (regardless of where you visit it from) and tell you about your privacy rights and how the 
                law protects you.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. The Data We Collect About You</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have 
                grouped together as follows:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes billing address, email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. How We Use Your Personal Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                <br />
                Email: support@orderzi.com
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </MarketingLayout>
  );
}
