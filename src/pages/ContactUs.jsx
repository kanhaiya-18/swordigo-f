import React from "react";
import { motion } from "framer-motion";
import {
  FireIcon,
  GlobeAltIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactUs = ({ isLoggedIn, setIsLoggedIn }) => {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/swordigo.in?igsh=MXBrdXl4MzkwczV2ag==",
      icon: "📷",
      description: "Follow us for the latest updates and product showcases",
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/+917610423147",
      icon: "💬",
      description: "Chat with us directly for inquiries and support",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@winarc17?si=pIdn6cI7Bl3OdD_b",
      icon: "▶️",
      description: "Watch our videos and product demonstrations",
    },
    {
      name: "Email",
      url: "mailto:sisodiyanishant204@gmail.com",
      icon: "📧",
      description: "Email us for any questions or support",
    },
  ];

  const features = [
    {
      icon: FireIcon,
      title: "Handcrafted Steel",
      description: "Every blade is individually forged & inspected.",
    },
    {
      icon: GlobeAltIcon,
      title: "Pan-India Delivery",
      description: "Reliable delivery across India.",
    },
    {
      icon: CreditCardIcon,
      title: "Secure Payments",
      description: "Encrypted checkout with trusted providers.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Authentic Designs",
      description: "Inspired by historical & anime-classic katanas.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="py-16 px-4 sm:px-8 lg:px-20 bg-[#05071f]">
        <div className="max-w-4xl mx-auto">
          {/* About Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-50 mb-4">
              About Us
            </h1>
            <div className="space-y-6 text-slate-300">
              <p className="text-lg leading-relaxed text-slate-200">
                <span className="text-sky-400 font-semibold">Blades that tell stories.</span> Crafted for warriors, collectors, and dreamers chasing their next arc.
              </p>
              <p className="leading-relaxed">
                At Swordigo, we are passionate about bringing you the finest collection of katanas and blades. Each piece in our collection is carefully selected and crafted to meet the highest standards of quality and authenticity. Whether you're a martial arts practitioner, a collector, or someone who appreciates the artistry of traditional Japanese swords, we have something special for you.
              </p>
              <p className="leading-relaxed">
                Our mission is to provide authentic, high-quality blades that honor the rich tradition of sword-making while meeting the needs of modern enthusiasts. We source our products from skilled craftsmen who understand the importance of both form and function.
              </p>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold text-slate-50 mb-6">
              Why Choose Swordigo?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="group flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/60 hover:bg-slate-900/70"
                >
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-400 shadow-sm group-hover:bg-sky-500/10 group-hover:text-sky-300 transition-colors duration-300">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-50 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-50 mb-4">
              Contact Us
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mb-8">
              Get in touch with us through any of our social media channels. We're here to help with your questions, orders, and feedback.
            </p>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-sky-500/50 hover:bg-slate-900/80 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="text-4xl mb-2">{link.icon}</div>
                    <h3 className="text-lg font-semibold text-slate-50 group-hover:text-sky-300 transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      {link.description}
                    </p>
                    <span className="text-xs text-sky-400 font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to visit →
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8"
            >
              <h3 className="text-xl font-semibold text-slate-50 mb-4">
                Get in Touch
              </h3>
              <div className="space-y-4 text-slate-300">
                <p className="leading-relaxed">
                  For general inquiries, order support, or any questions about our products, feel free to reach out through any of the channels above. We typically respond within 24 hours.
                </p>
                <p className="leading-relaxed text-sm text-slate-400">
                  <strong className="text-slate-300">Business Hours:</strong> Monday - Saturday, 10:00 AM - 7:00 PM IST
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;

