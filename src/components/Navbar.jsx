import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import api from "../utils/api";

const navLinks = [
  { label: "Home", href: "/", type: "route" },
  { label: "Shop", href: "/shop", type: "route" },
  { label: "About", href: "/contact", type: "route" },
];

const Navbar = ({isLoggedIn, setIsLoggedIn}) => {
  const [active, setActive] = useState("#home");
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // keep hash-based active for sections like #home
    if (typeof window !== "undefined" && window.location.hash) {
      setActive(window.location.hash);
    }
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const res = await api.get("/cart/getDetails");
      if (res.data.success) {
        const totalItems = (res.data.cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(totalItems);
      }
    } catch (err) {
      // User might not be logged in or cart might be empty
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [isLoggedIn, location.pathname, fetchCartCount]);

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isLoggedIn) {
        fetchCartCount();
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isLoggedIn, fetchCartCount]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCartCount(0);
    navigate("/");
    setActive("#home");
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-5 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 max-w-4xl mx-auto rounded-2xl"
    >
      <nav className="mx-auto max-w-3xl px-2 py-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="h-7 w-0.5 rotate-[-30deg] bg-gradient-to-b from-fuchsia-400 via-rose-400 to-sky-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>
            </div>
            <span className="font-semibold tracking-[0.25em] text-xs sm:text-sm uppercase text-slate-50">
              VelourFits
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm">
            {navLinks.map((link) => {
              const isRoute = link.type === "route";
              const isActive = isRoute
                ? location.pathname === link.href
                : active === link.href;

              if (isRoute) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`group relative cursor-pointer border-b border-transparent pb-1 text-[11px] sm:text-xs uppercase tracking-[0.18em] transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`pointer-events-none absolute left-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-fuchsia-400 via-rose-400 to-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                );
              }

              return (
                <button
                  key={link.href}
                  onClick={() => setActive(link.href)}
                  className={`group relative cursor-pointer border-b border-transparent pb-1 text-[11px] sm:text-xs uppercase tracking-[0.18em] transition-colors duration-200 ${
                    isActive ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <a href={link.href}>{link.label}</a>
                  <span
                    className={`pointer-events-none absolute left-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-fuchsia-400 via-rose-400 to-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </button>
              );
            })}
          </div>

          {/* Desktop auth + cart */}
          <div className="hidden sm:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-xs font-medium text-slate-200 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full border border-sky-500/70 bg-sky-500/90 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-sm transition-colors hover:bg-sky-400"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-500/70 bg-slate-100/95 px-4 py-2 text-xs sm:text-sm font-medium text-slate-900 shadow-sm transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span>View Cart</span>
                </Link>
                <Link
                  to="/account"
                  className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    location.pathname === "/account"
                      ? "text-sky-400"
                      : "text-slate-200 hover:text-white"
                  }`}
                >
                  <UserCircleIcon className="h-4 w-4" />
                  My Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 p-2 text-slate-100 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Open navigation</span>
            <div className="space-y-1">
              <span
                className={`block h-0.5 w-5 rounded-full bg-slate-100 transition-transform duration-200 ${
                  isOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-5 rounded-full bg-slate-100 transition-opacity duration-200 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block h-0.5 w-5 rounded-full bg-slate-100 transition-transform duration-200 ${
                  isOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 md:hidden"
          >
            {navLinks.map((link) => {
              const isRoute = link.type === "route";
              const isActive = isRoute
                ? location.pathname === link.href
                : active === link.href;

              if (isRoute) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-2 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                      isActive
                        ? "bg-slate-900 text-slate-50"
                        : "text-slate-300 hover:bg-slate-900 hover:text-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setActive(link.href);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-lg px-2 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                    isActive
                      ? "bg-slate-900 text-slate-50"
                      : "text-slate-300 hover:bg-slate-900 hover:text-slate-50"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            {/* Mobile auth / logout + cart */}
            {!isLoggedIn ? (
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-full border border-slate-600 bg-transparent px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-900 hover:text-white text-center transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-full bg-sky-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-sky-400 text-center transition-colors"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-600 bg-slate-100 px-4 py-2 text-xs font-medium text-slate-900"
                >
                  View Cart
                  <span className="h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-slate-100">
                    {cartCount}
                  </span>
                </Link>
                <Link
                  to="/account"
                  onClick={() => setIsOpen(false)}
                  className={`inline-flex items-center justify-center gap-2 w-full rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                    location.pathname === "/account"
                      ? "border-sky-500/70 bg-sky-500/20 text-sky-300"
                      : "border-slate-600 bg-transparent text-slate-200 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <UserCircleIcon className="h-4 w-4" />
                  My Account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Navbar;