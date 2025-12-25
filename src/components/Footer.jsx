import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="border-t border-slate-800 bg-slate-950/95 text-slate-300"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-0.5 rotate-[-30deg] bg-sky-500/80" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-100">
                Swordigo
              </span>
            </div>
            <p className="text-xs text-slate-400/90 max-w-xs">
              Blades that tell stories. Crafted for warriors, collectors, and
              dreamers chasing their next arc.
            </p>
          </div>

          {/* Center Links */}
          <div className="text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Quick Links
            </h4>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-300">
              <Link to="/" className="hover:text-slate-50 transition-colors">
                Home
              </Link>
              <Link to="/shop" className="hover:text-slate-50 transition-colors">
                Shop
              </Link>
            </div>
          </div>

          {/* Right Socials */}
          <div className="md:text-right">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Follow
            </h4>
            <div className="mt-3 flex gap-3 text-xs md:justify-end">
              <motion.a
                whileHover={{ y: -2 }}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200 hover:border-sky-500 hover:text-sky-200 transition-all duration-300"
                href="https://www.instagram.com/swordigo.in?igsh=MXBrdXl4MzkwczV2ag=="
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200 hover:border-sky-500 hover:text-sky-200 transition-all duration-300"
                href="https://wa.me/+917610423147"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200 hover:border-sky-500 hover:text-sky-200 transition-all duration-300"
                href="https://youtube.com/@winarc17?si=pIdn6cI7Bl3OdD_b"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-4 text-[10px] text-slate-400">
              <Link to="/terms" className="hover:text-slate-200 transition-colors" target="_blank">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-slate-200 transition-colors" target="_blank">
                Privacy Policy
              </Link>
              <Link to="/refund" className="hover:text-slate-200 transition-colors" target="_blank">
                Refund Policy
              </Link>
              <Link to="/shipping" className="hover:text-slate-200 transition-colors" target="_blank">
                Shipping Policy
              </Link>
            </div>
            <p className="text-[10px] text-slate-500">
              © Swordigo 2025. All rights reserved.
            </p>
          </div>
          <p className="mt-2 text-[10px] text-slate-500 text-center sm:text-left">
            Forged in the shadows. Wielded in the light.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;