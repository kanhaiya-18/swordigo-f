import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TermsOfService = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="py-16 px-4 sm:px-8 lg:px-20 bg-[#05071f]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-50 mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using VelourFits, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">2. Use License</h2>
              <p className="leading-relaxed">
                Permission is granted to temporarily access the materials on VelourFits' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">3. Products and Services</h2>
              <p className="leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any product or service at any time without prior notice. All products are subject to availability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">4. Pricing and Payment</h2>
              <p className="leading-relaxed">
                All prices are listed in Indian Rupees (INR). We reserve the right to change prices at any time. Payment must be made through our authorized payment gateway (Razorpay).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">5. Shipping and Delivery</h2>
              <p className="leading-relaxed">
                We will make every effort to deliver products within the estimated timeframe. Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">6. User Accounts</h2>
              <p className="leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">7. Limitation of Liability</h2>
              <p className="leading-relaxed">
                VelourFits shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">8. Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our website.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;

