import React from "react";
import { motion } from "framer-motion";
import heroImage from "../uploads/veloure.JPG";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const clickShopHandler = () => {
    navigate("/shop");
  };
  const clickCartHandler = () => {
    navigate("/cart");
  };
  return (
    <section className="relative min-h-[100vh] w-full overflow-hidden bg-slate-950">
      {/* Background image / video layer */}
      <div className="absolute inset-0">
        {/* Replace URL or use your own asset (e.g. /assets/samurai-hero.jpg) */}
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-slate-900/85" />
      </div>

      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl mix-blend-screen" />
      <div className="pointer-events-none absolute -bottom-40 -left-10 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl mix-blend-screen" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-6xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
            <span className="h-1 w-1 rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>
            VelourFits Premium Perfumes
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white">
            Indulge in timeless scent —
            <span className="bg-gradient-to-r from-fuchsia-400 via-rose-400 to-sky-400 bg-clip-text text-transparent">
              Velvet Elegance
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300/90 max-w-xl">
            Discover signature fragrances crafted for modern aesthetics. Luxurious
            accords, enduring sillage — scents that elevate presence and mood.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={clickShopHandler}
              className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-7 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110"
            >
              Shop Now
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={clickCartHandler}
              className="inline-flex items-center justify-center rounded-full border border-slate-500/70 bg-black/40 px-7 py-3 text-sm font-medium text-slate-100 hover:border-sky-400 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer"
            >
              View Cart
            </motion.a>
          </div>

          {/* Meta */}
          <div className="mt-8 sm:flex flex-wrap gap-6 text-xs text-slate-400 hidden">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Limited drops, never mass-produced.
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
              Battle-ready & display-perfect builds.
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-300 flex flex-col items-center gap-2"
      >
        <span className="uppercase tracking-[0.3em] text-[10px] text-slate-400">
          Scroll
        </span>
        <div className="h-9 w-5 rounded-full border border-slate-500/70 flex items-start justify-center p-1">
          <div className="h-1.5 w-1 rounded-full bg-slate-200" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;