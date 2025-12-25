import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RefundPolicy = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="py-16 px-4 sm:px-8 lg:px-20 bg-[#05071f]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-50 mb-4">
            Refund and Cancellation Policy
          </h1>
          <p className="text-sm text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">1. Cancellation Policy</h2>
              <p className="leading-relaxed mb-2">
                You may cancel your order within 24 hours of placing it, provided the order has not been shipped. To cancel an order, please contact us through our customer support.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">2. Refund Eligibility</h2>
              <p className="leading-relaxed mb-2">
                Refunds are available in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Order cancelled within 24 hours (before shipping)</li>
                <li>Defective or damaged products received</li>
                <li>Wrong product delivered</li>
                <li>Product not received within the estimated delivery time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">3. Refund Process</h2>
              <p className="leading-relaxed mb-2">
                To request a refund:
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Contact our customer support with your order number</li>
                <li>Provide details about the issue</li>
                <li>We will review your request within 2-3 business days</li>
                <li>If approved, refund will be processed to your original payment method</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">4. Refund Timeline</h2>
              <p className="leading-relaxed">
                Refunds will be processed within 5-7 business days after approval. The amount will be credited back to your original payment method. Please note that it may take additional time for your bank to reflect the refund.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">5. Return Shipping</h2>
              <p className="leading-relaxed">
                For defective or wrong products, we will cover the return shipping costs. For other returns, shipping costs may be deducted from the refund amount.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">6. Non-Refundable Items</h2>
              <p className="leading-relaxed">
                Custom or personalized items may not be eligible for refund unless they are defective. Digital products are generally non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">7. Contact Us</h2>
              <p className="leading-relaxed">
                For refund requests or questions about this policy, please contact our customer support through our website.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;

