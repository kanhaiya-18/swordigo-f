import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/api";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  // 📦 Fetch all orders
  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/getAllOrders");
      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setError(res.data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await api.patch(`/admin/updateOrderStatus/${orderId}`, {
        orderStatus: newStatus
      });
      if (res.data.success) {
        // Update the orders list with the new status
        setOrders(orders.map(order => 
          order._id === orderId ? res.data.order : order
        ));
        // Update the selected order if it's currently shown
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(res.data.order);
        }
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300";
      case "failed":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  const getTotalQuantity = (orderDetails) => {
    return orderDetails.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-3xl font-bold text-slate-50">
              Order Management
            </h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
          >
            ← Back to Products
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-sky-500/20 mb-4">
                <div className="animate-spin text-sky-400">⏳</div>
              </div>
              <p className="text-slate-400">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No orders found</p>
          </div>
        ) : (
          <>
            {/* Orders Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60">
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">
                      Customer Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">
                      Total Amount
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">
                      Payment Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">
                      Order Status
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order, idx) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-200">
                          {order.user?.name || "Unknown"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {order.user?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs max-w-xs">
                        {order.address ? (
                          <div className="space-y-0.5">
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                            <p>{order.address.country}</p>
                          </div>
                        ) : (
                          <span className="text-slate-500">No address</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center rounded-full bg-sky-500/20 h-8 w-8 text-sky-300 font-medium">
                          {getTotalQuantity(order.orderDetails || [])}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold bg-linear-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                          ₹{order.totalAmount?.toFixed(2) || "0.00"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus?.charAt(0).toUpperCase() +
                            order.paymentStatus?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus || "pending"}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          disabled={updatingOrderId === order._id}
                          className="text-xs px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-300 focus:outline-none focus:border-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {/* <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option> */}
                          <option value="shipping">Shipping</option>
                          <option value="out for delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="inline-flex items-center gap-2 rounded-lg bg-sky-500/20 px-3 py-2 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-500/30"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Showing {indexOfFirstOrder + 1} to{" "}
                  {Math.min(indexOfLastOrder, orders.length)} of {orders.length}{" "}
                  orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage(Math.max(currentPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-700 bg-slate-900/60 p-2 text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-slate-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-700 bg-slate-900/60 p-2 text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-100">
                Order Details
              </h2>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="text-slate-400 hover:text-slate-200 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Order Summary */}
            <div className="space-y-4 mb-8 pb-8 border-b border-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Order Date
                  </p>
                  <p className="text-sm text-slate-300 mt-1">
                    {new Date(selectedOrder.orderDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Customer Name
                  </p>
                  <p className="text-sm text-slate-300 mt-1">
                    {selectedOrder.user?.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Customer Email
                  </p>
                  <p className="text-sm text-slate-300 mt-1">
                    {selectedOrder.user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    User ID
                  </p>
                  <p className="text-sm font-mono text-slate-300 mt-1">
                    {selectedOrder.user?._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {selectedOrder.address && (
              <div className="mb-8 pb-8 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  Delivery Address
                </h3>
                <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/50">
                  <p className="text-slate-300">{selectedOrder.address.street}</p>
                  <p className="text-slate-300">{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipCode}</p>
                  <p className="text-slate-300">{selectedOrder.address.country}</p>
                  <p className="text-slate-400 mt-2">Phone: {selectedOrder.address.phone}</p>
                </div>
              </div>
            )}

            {/* Order Status */}
            <div className="mb-8 pb-8 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                Order Tracking
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                  <span className="text-slate-400">Order Status:</span>
                  <select
                    value={selectedOrder.orderStatus || "pending"}
                    onChange={(e) => {
                      handleUpdateOrderStatus(selectedOrder._id, e.target.value);
                    }}
                    disabled={updatingOrderId === selectedOrder._id}
                    className="text-sm px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 focus:outline-none focus:border-sky-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipping">Shipping</option>
                    <option value="out for delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-500/20 text-green-300">
                    {selectedOrder.paymentStatus?.charAt(0).toUpperCase() + selectedOrder.paymentStatus?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                Order Items
              </h3>
              <div className="space-y-3">
                {selectedOrder.orderDetails?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-800 bg-slate-950/50"
                  >
                    <div>
                      <p className="font-medium text-slate-200">
                        {item.product?.name || "Unknown Product"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Product ID: {item.product?._id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">
                        Qty: <span className="font-semibold text-slate-200">{item.quantity}</span>
                      </p>
                      <p className="text-sm font-semibold text-sky-400 mt-1">
                        ₹{item.total?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Razorpay Info */}
            {selectedOrder.razorpayPaymentId && (
              <div className="mb-8 pb-8 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  Payment Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Razorpay Order ID:</span>
                    <span className="text-slate-300 font-mono text-xs">
                      {selectedOrder.razorpayOrderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment ID:</span>
                    <span className="text-slate-300 font-mono text-xs">
                      {selectedOrder.razorpayPaymentId}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Total */}
            <div className="p-4 rounded-lg bg-linear-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Total Amount:</span>
                <span className="text-2xl font-bold text-sky-300">
                  ₹{selectedOrder.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowOrderDetail(false)}
              className="w-full rounded-lg bg-slate-700 px-4 py-3 font-medium text-slate-100 transition-colors hover:bg-slate-600"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
