import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  EnvelopeIcon,
  CalendarIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const MyAccount = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    isDefault: false,
  });
  const [addressError, setAddressError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address._id);
      setAddressForm({
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
        country: address.country || "India",
        phone: address.phone || "",
        isDefault: address.isDefault || false,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        phone: "",
        isDefault: false,
      });
    }
    setAddressError("");
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setAddressForm({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
      isDefault: false,
    });
    setAddressError("");
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressError("");

    try {
      if (editingAddress) {
        // Update existing address
        const res = await api.patch(`/address/updateAddress/${editingAddress}`, addressForm);
        if (res.data.success) {
          await fetchAccountData();
          closeAddressModal();
        } else {
          setAddressError(res.data.message || "Failed to update address");
        }
      } else {
        // Add new address
        const res = await api.post("/address/addAddress", addressForm);
        if (res.data.success) {
          await fetchAccountData();
          closeAddressModal();
        } else {
          setAddressError(res.data.message || "Failed to add address");
        }
      }
    } catch (err) {
      console.error("Error saving address:", err);
      setAddressError(err.response?.data?.message || err.message || "Failed to save address");
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchAccountData();
  }, [isLoggedIn, navigate]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch user info, orders, cart, and addresses in parallel
      const [userRes, ordersRes, cartRes, addressesRes] = await Promise.all([
        api.get("/getUserInfo"),
        api.get("/order/getOrders").catch(() => ({ data: { success: false, orders: [] } })),
        api.get("/cart/getDetails").catch(() => ({ data: { success: false, cart: [] } })),
        api.get("/address/getAddresses").catch(() => ({ data: { success: false, addresses: [] } })),
      ]);

      if (userRes.data.success) {
        setUserInfo(userRes.data.user);
      } else {
        setError(userRes.data.message || "Failed to load user information");
      }

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders || []);
      }

      if (cartRes.data.success) {
        const cartItems = cartRes.data.cart || [];
        setCartCount(cartItems.length);
      }

      if (addressesRes.data.success) {
        setAddresses(addressesRes.data.addresses || []);
      }
    } catch (err) {
      console.error("Error fetching account data:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load account information";
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
            <p className="text-slate-400">Loading account information...</p>
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
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-50">
              My{" "}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Account
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">Manage your account and view your activity</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
                  <UserCircleIcon className="h-7 w-7 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-50">Personal Information</h2>
                  <p className="text-sm text-slate-400">Your account details</p>
                </div>
              </div>

              {userInfo ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <UserCircleIcon className="h-5 w-5 text-sky-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Full Name</p>
                      <p className="text-slate-100 font-medium">{userInfo.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <EnvelopeIcon className="h-5 w-5 text-sky-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Email Address</p>
                      <p className="text-slate-100 font-medium">{userInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <CalendarIcon className="h-5 w-5 text-sky-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Member Since</p>
                      <p className="text-slate-100 font-medium">
                        {new Date(userInfo.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400">Unable to load user information</p>
              )}
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-slate-50 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/cart"
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                      <ShoppingBagIcon className="h-5 w-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-slate-100 font-medium">Shopping Cart</p>
                      <p className="text-xs text-slate-400">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                      <ClipboardDocumentListIcon className="h-5 w-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-slate-100 font-medium">My Orders</p>
                      <p className="text-xs text-slate-400">{orders.length} {orders.length === 1 ? "order" : "orders"}</p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
                </Link>
              </div>
            </motion.div>

            {/* Addresses Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-50 flex items-center gap-2">
                    <MapPinIcon className="h-6 w-6 text-sky-400" />
                    Saved Addresses
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {addresses.length} {addresses.length === 1 ? "address" : "addresses"} saved
                  </p>
                </div>
                <button
                  onClick={() => openAddressModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/20 border border-sky-500/50 text-sky-300 hover:bg-sky-500/30 hover:border-sky-500/70 transition-all font-medium text-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPinIcon className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">No addresses saved yet</p>
                  <button
                    onClick={() => openAddressModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-slate-950 hover:bg-sky-400 transition-all font-medium"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`p-4 rounded-lg border ${
                        address.isDefault
                          ? "border-sky-500/50 bg-sky-500/10"
                          : "border-slate-700 bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {address.isDefault && (
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300 mb-2">
                              Default
                            </span>
                          )}
                          <p className="text-slate-100 font-medium">{address.street}</p>
                          <p className="text-sm text-slate-400">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-slate-400">{address.country}</p>
                          <p className="text-sm text-slate-400 mt-1">Phone: {address.phone}</p>
                        </div>
                        <button
                          onClick={() => openAddressModal(address)}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-sky-400"
                          title="Edit address"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Orders */}
            {orders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-50">Recent Orders</h2>
                  <Link
                    to="/orders"
                    className="text-sm text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
                  >
                    View All
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <Link
                      key={order._id}
                      to={`/order/${order._id}`}
                      className="block p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-100 font-medium mb-1">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(order.orderDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-sky-400">
                            ₹{order.totalAmount?.toFixed(2) || "0.00"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {order.orderDetails?.length || 0} {order.orderDetails?.length === 1 ? "item" : "items"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Logout Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-50 mb-1">Account Actions</h2>
                  <p className="text-sm text-slate-400">Sign out of your account</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 hover:border-red-500/70 transition-all font-medium"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-50">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={closeAddressModal}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {addressError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                {addressError}
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                    placeholder="123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Country *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                  placeholder="+91 1234567890"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500"
                />
                <label htmlFor="isDefault" className="text-sm text-slate-300">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-sky-500 text-slate-950 hover:bg-sky-400 transition-colors font-medium"
                >
                  {editingAddress ? "Update Address" : "Add Address"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyAccount;

