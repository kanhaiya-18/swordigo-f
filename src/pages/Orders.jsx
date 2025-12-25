import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { motion } from "framer-motion";

const Orders = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (location.state?.orderCreated) {
      // Show success message if order was just created
      setTimeout(() => {
        // Clear the state
        window.history.replaceState({}, document.title);
      }, 3000);
    }
  }, [location.state]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/order/getOrders");
      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setError(res.data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load orders";
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
            <p className="text-slate-400">Loading orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 scroll-smooth">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main className="py-16 px-4 sm:px-8 lg:px-20 bg-[#05071f]">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-50">
              My{" "}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Orders
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {orders.length} {orders.length === 1 ? "order" : "orders"} found
            </p>
          </header>

          {location.state?.orderCreated && (
            <div className="mb-4 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 text-sm">
              Order placed successfully! 🎉
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg mb-4">You haven't placed any orders yet</p>
              <button
                onClick={() => navigate("/shop")}
                className="rounded-full bg-sky-500 px-6 py-3 text-base font-medium text-slate-950 shadow-lg transition-all duration-200 hover:bg-sky-400 hover:shadow-xl hover:-translate-y-0.5"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-sky-400/50 transition-colors"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-50">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300 border border-sky-500/50">
                          Placed
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">
                        {new Date(order.orderDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                      <p className="text-sm text-slate-300">
                        {order.orderDetails?.length || 0} {order.orderDetails?.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                        ₹{order.totalAmount?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Total Amount</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;

