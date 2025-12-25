import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ShippingPolicy = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="py-16 px-4 sm:px-8 lg:px-20 bg-[#05071f]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-50 mb-4">
            Shipping Policy
          </h1>
          <p className="text-sm text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">
                1. Shipping Methods
              </h2>
              <p className="leading-relaxed mb-2">
                We offer standard shipping to ensure your order reaches you safely
                and on time:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Standard Shipping - Regular delivery service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">
                2. Processing Time
              </h2>
              <p className="leading-relaxed">
                All orders are processed within 2-3 business days (Monday through
                Friday, excluding holidays) after payment confirmation. Orders
                placed on weekends or holidays will be processed on the next
                business day.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">
                3. Delivery Timeframes
              </h2>
              <p className="leading-relaxed mb-2">
                Delivery times are as follows:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>All Orders:</strong> 5-7 business days
                </li>
              </ul>
              <p className="leading-relaxed mt-3 text-sm text-slate-400">
                Please note: Delivery times are estimates and not guaranteed.
                Delays may occur due to weather conditions or other factors beyond
                our control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">
                4. Shipping Costs
              </h2>
              <p className="leading-relaxed mb-2">
                Shipping costs are calculated based on:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Product weight and dimensions</li>
                <li>Destination address</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Shipping charges will be displayed at checkout before you
                complete your purchase. Free shipping may be available for
                orders above a certain value - check our current promotions for
                details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">
                5. Order Tracking
              </h2>
              <p className="leading-relaxed">
                Once your order is shipped, you will receive a tracking number
                via email. You can use this tracking number to monitor your
                shipment's progress on the carrier's website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">
                6. Address Accuracy
              </h2>
              <p className="leading-relaxed">
                Please ensure your shipping address is complete and accurate. We
                are not responsible for orders shipped to incorrect addresses
                provided by the customer. If you need to change your shipping
                address, please contact us immediately after placing your order.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">
                7. Failed Delivery Attempts
              </h2>
              <p className="leading-relaxed">
                If delivery is attempted but unsuccessful (e.g., no one
                available to receive, incorrect address), the package may be
                returned to us. Additional shipping charges may apply for
                re-shipment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">
                8. Damaged or Lost Shipments
              </h2>
              <p className="leading-relaxed mb-2">
                If your order arrives damaged or is lost in transit:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Contact us immediately with photos (if damaged)</li>
                <li>We will investigate and work with the shipping carrier</li>
                <li>We will replace or refund affected items at no extra cost</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">
                9. Risk of Loss
              </h2>
              <p className="leading-relaxed">
                The risk of loss and title for products purchased from Swordigo
                pass to you upon delivery to the carrier.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-50 mb-3">
                10. Contact Us
              </h2>
              <p className="leading-relaxed">
                For questions about shipping or delivery, please contact our
                customer support through our website.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;
