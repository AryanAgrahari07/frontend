import MarketingLayout from "@/components/layout/MarketingLayout";
import { motion } from "framer-motion";

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            
            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground space-y-6">
              <p>Last updated: {new Date().toLocaleDateString()}</p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Orderzi, you accept and agree to be bound by the terms and provision of this agreement. 
                In addition, when using these particular services, you shall be subject to any posted guidelines or rules 
                applicable to such services.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. Description of Service</h2>
              <p>
                Orderzi provides restaurant management software, including but not limited to QR menus, live order tracking, 
                queue management, and analytics features. We reserve the right to modify or discontinue any feature or 
                service at any time without notice.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. User Responsibilities</h2>
              <p>
                As a user of Orderzi, you agree to provide true, accurate, current and complete information about yourself 
                and your business as prompted by the registration form. You are responsible for maintaining the confidentiality 
                of your account and password and for restricting access to your computer or mobile device.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. Payment and Subscription Terms</h2>
              <p>
                Some of our services are billed on a subscription basis. You will be billed in advance on a recurring and periodic 
                basis. Unless cancelled before the end of the current billing cycle, your subscription will automatically renew 
                under the exact same conditions.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. Limitation of Liability</h2>
              <p>
                In no event shall Orderzi, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable 
                for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of 
                profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability 
                to access or use the Service.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">6. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
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
