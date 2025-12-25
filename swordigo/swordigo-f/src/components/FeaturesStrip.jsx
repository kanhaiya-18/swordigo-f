import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  GlobeAltIcon,
  CreditCardIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: FireIcon,
    title: "Handcrafted Steel",
    description: "Every blade is individually forged & inspected.",
  },
  {
    icon: GlobeAltIcon,
    title: "Worldwide Shipping",
    description: "Tracked delivery to over 80+ countries.",
  },
  {
    icon: CreditCardIcon,
    title: "Secure Payments",
    description: "Encrypted checkout with major providers.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Authentic Designs",
    description: "Inspired by historical & anime-classic katanas.",
  },
];

const FeaturesStrip = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/60 hover:bg-slate-900"
          >
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-sky-400 shadow-sm group-hover:bg-sky-500/10 group-hover:text-sky-300 transition-colors duration-300">
              <feature.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-50">
                {feature.title}
              </h3>
              <p className="mt-1 text-[11px] text-slate-400">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturesStrip;