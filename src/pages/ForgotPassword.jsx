import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const ForgotPassword = ({ isLoggedIn, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devResetLink, setDevResetLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setDevResetLink("");
    setIsLoading(true);

    // Basic validation
    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/forgotPassword", { email });

      if (response.data.success) {
        setSuccess(
          "Password reset link has been sent to your email. Please check your inbox."
        );
        
        // In development mode, show the reset link directly
        if (response.data.devResetLink) {
          setDevResetLink(response.data.devResetLink);
        }
        
        setEmail("");
        // Optionally redirect to login after 5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        setError(response.data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setIsLoading(false);

      if (err.response) {
        setError(
          err.response.data.message || "Failed to send reset link"
        );
      } else if (err.request) {
        setError(
          "Cannot reach server. Please check your connection and try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-8 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <EnvelopeIcon className="h-6 w-6 text-sky-400" />
                </div>
              </div>
              <h1 className="text-3xl font-semibold text-slate-50 mb-2">
                Forgot Password?
              </h1>
              <p className="text-sm text-slate-400">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 text-sm flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Check your email!</p>
                  <p>{success}</p>
                  
                  {/* Development mode: show reset link directly */}
                  {devResetLink && (
                    <div className="mt-3 p-2 rounded bg-yellow-500/20 border border-yellow-500/50">
                      <p className="text-yellow-300 text-xs font-semibold mb-2">🔧 Development Mode - Reset Link:</p>
                      <a 
                        href={devResetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 break-all text-xs underline"
                      >
                        {devResetLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-300 mb-2 uppercase tracking-wide"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-sky-500 px-4 py-3 text-sm font-medium text-slate-950 shadow-sm transition-all duration-200 hover:bg-sky-400 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-sky-500"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-slate-900 text-slate-500">Or</span>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3 text-center text-sm">
              <p className="text-slate-400">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
              <p className="text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ForgotPassword;
