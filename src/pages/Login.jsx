import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const Login = ({ isLoggedIn, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    //post  login (email and password)
    try {
      const response = await api.post("/login", { email, password });
      
      // Check if response has success and token
      if (response.data.success && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        setIsLoading(false);
        navigate("/");
      } else {
        setError("Login failed. Please try again.");
        setIsLoading(false);
      }

    }
    catch (err) {
      console.error("Login error:", err);
      setIsLoading(false);

      // Show more useful error
      if (err.response) {
        // Server responded with status code 4xx / 5xx
        console.log("Error response data:", err.response.data);
        setError(
          err.response.data.message || "Invalid email or password. Try again."
        );
      } else if (err.request) {
        // Request sent but no response (server down / CORS / URL wrong)
        console.log("No response received:", err.request);
        setError(
          "Cannot reach server. Please check your connection and try again."
        );
      } else {
        // Something else (config, network, etc.)
        setError("Something went wrong. Please try again.");
      }
    };;
  }
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
              <h1 className="text-3xl font-semibold text-slate-50 mb-2">
                Welcome Back
              </h1>
              <p className="text-sm text-slate-400">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                {error}
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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-300 mb-2 uppercase tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-700 bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  <input
                    type="checkbox"
                    disabled={isLoading}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950/50 text-sky-500 focus:ring-sky-500 disabled:opacity-50"
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="/forgotPassword"
                  className="text-sky-400 hover:text-sky-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-sky-500 px-4 py-3 text-sm font-medium text-slate-950 shadow-sm transition-all duration-200 hover:bg-sky-400 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-sky-500"
              >
                {isLoading ? "Logging in..." : "Sign In"}
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

            {/* Sign up link */}
            <div className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;

