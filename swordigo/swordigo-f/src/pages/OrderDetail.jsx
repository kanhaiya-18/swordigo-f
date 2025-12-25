import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { motion } from "framer-motion";

const OrderDetail = ({ isLoggedIn, setIsLoggedIn }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchOrder();
  }, [orderId, isLoggedIn, navigate]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/order/getOrder/${orderId}`);
      if (res.data.success) {
        setOrder(res.data.order);
      } else {
        setError(res.data.message || "Order not found");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load order";
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
            <p className="text-slate-400">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-400 mb-4">
              {error || "Order not found"}
            </h1>
            <button
              onClick={() => navigate("/orders")}
              className="px-6 py-2 rounded-full bg-sky-500 text-slate-950 font-medium hover:bg-sky-400 transition-colors"
            >
              Back to Orders
            </button>
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
          {/* Back Button */}
          <button
            onClick={() => navigate("/orders")}
            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors"
          >
            <span>←</span>
            <span>Back to Orders</span>
          </button>

          {/* Order Header */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-2">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-slate-400">
                  Placed on {new Date(order.orderDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                  ₹{order.totalAmount?.toFixed(2) || "0.00"}
                </p>
                <p className="text-sm text-slate-400 mt-1">Total Amount</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold text-slate-50 mb-4">Order Items</h2>
            {order.orderDetails && order.orderDetails.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 cursor-pointer hover:border-sky-400/50 transition-colors"
                onClick={() => window.open(`/product/${item.product._id}`, '_blank')}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden border border-slate-800 bg-slate-800">
                      {item.product.image && item.product.image.length > 0 ? (
                        <img
                          src={item.product.image[0]}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%231e293b' width='200' height='200'/%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-500 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-50 mb-1 hover:text-sky-400 transition-colors">
                      {item.product.name}
                    </h3>
                    {item.product.description && (
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {item.product.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Quantity:</span>
                        <span className="text-slate-200 font-medium">{item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Unit Price:</span>
                        <span className="text-slate-200 font-medium">₹{item.product.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Item Total:</span>
                        <span className="text-sky-400 font-semibold">₹{(item.quantity * item.product.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-slate-50 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({order.orderDetails?.length || 0} items)</span>
                <span>₹{order.totalAmount?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <div className="flex justify-between text-lg font-semibold text-slate-50">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                    ₹{order.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetail;

