import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const Signup = ({ isLoggedIn, setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async(e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  // Basic validation
  if (!formData.name || !formData.email || !formData.password) {
    setError("Please fill in all required fields");
    setIsLoading(false);
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    setIsLoading(false);
    return;
  }

  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters");
    setIsLoading(false);
    return;
  }
  try {
    const response = await api.post("/signUp", {
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    const token = response.data.token;
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setIsLoading(false);
    navigate("/")
  }
  catch (err) {
    console.log(err);
    setIsLoading(false);
    if(err.response)
    {
        setError(err.response.data.message || "something went wrong");
    }
    else if(err.request)
    {
      setError("could not reach server");
      console.log(err.request);
    }
    else {
      setError("something went wrong");
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
            <h1 className="text-3xl font-semibold text-slate-50 mb-2">
              Create Account
            </h1>
            <p className="text-sm text-slate-400">
              Join VelourFits — discover signature scents
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
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-slate-300 mb-2 uppercase tracking-wide"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="John Doe"
                required
              />
            </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium text-slate-300 mb-2 uppercase tracking-wide"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-700 bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950/50 text-sky-500 focus:ring-sky-500"
                required
              />
              <span>
                I agree to the{" "}
                <Link to="/terms" className="text-sky-400 hover:text-sky-300" target="_blank">
                  Terms of Service
                </Link>
                {", "}
                <Link
                  to="/privacy"
                  className="text-sky-400 hover:text-sky-300"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
                {" and "}
                <Link
                  to="/refund"
                  className="text-sky-400 hover:text-sky-300"
                  target="_blank"
                >
                  Refund Policy
                </Link>
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-sky-500 px-4 py-3 text-sm font-medium text-slate-950 shadow-sm transition-all duration-200 hover:bg-sky-400 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-sky-500"
            >
              {isLoading ? "Signing up..." : "Create Account"}
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

          {/* Login link */}
          <div className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  </div>
);
};

export default Signup;

