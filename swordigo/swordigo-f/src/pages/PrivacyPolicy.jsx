import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="py-16 px-4 sm:px-8 lg:px-20 bg-[#05071f]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-50 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">1. Information We Collect</h2>
              <p className="leading-relaxed mb-2">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Name, email address, and contact information</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely through Razorpay)</li>
                <li>Account credentials and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">2. How We Use Your Information</h2>
              <p className="leading-relaxed mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send you order confirmations and updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our website and services</li>
                <li>Send you marketing communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">3. Information Sharing</h2>
              <p className="leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Payment processors (Razorpay) to process payments</li>
                <li>Shipping partners to deliver your orders</li>
                <li>Service providers who assist in our operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">4. Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">5. Cookies</h2>
              <p className="leading-relaxed">
                We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">6. Your Rights</h2>
              <p className="leading-relaxed">
                You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">7. Contact Us</h2>
              <p className="leading-relaxed">
                If you have questions about this Privacy Policy, please contact us through our website.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

