import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { motion } from "framer-motion";
import { TrashIcon, MinusIcon, PlusIcon, MapPinIcon } from "@heroicons/react/24/outline";

const Cart = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showOrderReview, setShowOrderReview] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [reducingQuantityId, setReducingQuantityId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: ""
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [isLoggedIn, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/cart/getDetails");
      if (res.data.success) {
        setCartItems(res.data.cart || []);
      } else {
        setError(res.data.message || "Failed to load cart");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load cart";
      setError(errorMessage);
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address/getAddresses");
      if (res.data.success) {
        setSavedAddresses(res.data.addresses || []);
        // Auto-select default address if available
        const defaultAddress = res.data.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          setAddress({
            street: defaultAddress.street,
            city: defaultAddress.city,
            state: defaultAddress.state,
            zipCode: defaultAddress.zipCode,
            country: defaultAddress.country,
            phone: defaultAddress.phone
          });
        }
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      // Don't show error, just continue without saved addresses
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address._id);
    setAddress({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone
    });
    setShowAddressForm(false);
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCartId(productId);
      const res = await api.post(`/cart/add/${productId}`, { quantity: 1 });
      if (res.data.success) {
        fetchCart();
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err.response?.data?.message || "Failed to add item");
    } finally {
      setAddingToCartId(null);
    }
  };

  const handleReduceQuantity = async (productId) => {
    try {
      setReducingQuantityId(productId);
      const res = await api.patch(`/cart/reduce/${productId}`);
      if (res.data.success) {
        fetchCart();
      }
    } catch (err) {
      console.error("Error reducing quantity:", err);
      setError(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setReducingQuantityId(null);
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      setDeletingItemId(productId);
      const res = await api.delete(`/cart/delete/${productId}`);
      if (res.data.success) {
        fetchCart();
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      setError(err.response?.data?.message || "Failed to delete item");
    } finally {
      setDeletingItemId(null);
    }
  };

  const calculateTotal = () => {
    // Calculate total from current product prices, not stored totals
    return cartItems.reduce((sum, item) => {
      const currentPrice = item.product?.price || 0;
      const itemTotal = item.quantity * currentPrice;
      return sum + itemTotal;
    }, 0);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    setShowOrderReview(true);
    setError("");
  };

  const handleConfirmOrder = async () => {
    // Validate address before creating order
    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country || !address.phone) {
      setError("Please add a delivery address before placing the order");
      setShowAddressForm(true);
      return;
    }

    setCreatingOrder(true);
    setError("");

    try {
      // Step 1: Create Razorpay order
      const orderRes = await api.post("/payment/create-order");
      
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || "Failed to create payment order");
      }

      const { order: razorpayOrder } = orderRes.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "VelourFits",
        description: `Order for ${totalItems} item(s)`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // Step 3: Verify payment and create order
          try {
            setCreatingOrder(true);
            const verifyRes = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address: address,
            });

            if (verifyRes.data.success) {
              // Payment verified and order created successfully
              setShowOrderReview(false);
              navigate("/orders", { state: { orderCreated: true } });
            } else {
              setError(verifyRes.data.message || "Payment verification failed");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            let errorMessage = err.response?.data?.message || err.message || "Failed to verify payment";
            
            // Check for domain/website registration errors
            if (errorMessage.toLowerCase().includes("website") || 
                errorMessage.toLowerCase().includes("domain") ||
                errorMessage.toLowerCase().includes("not registered")) {
              errorMessage = "Payment Error: This website domain is not registered with the Razorpay account. Please contact the administrator to add this domain in Razorpay settings.";
            }
            
            setError(errorMessage);
          } finally {
            setCreatingOrder(false);
          }
        },
        prefill: {
          name: address.street ? "Customer" : "",
          contact: address.phone || "",
        },
        theme: {
          color: "#0ea5e9", // Sky-500 color
        },
        modal: {
          ondismiss: function () {
            // User closed the payment modal
            setCreatingOrder(false);
            setError("");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (err) {
      console.error("Error initiating payment:", err);
      let errorMessage = err.response?.data?.message || err.message || "Failed to initiate payment";
      
      // Check for domain/website registration errors
      if (errorMessage.toLowerCase().includes("website") || 
          errorMessage.toLowerCase().includes("domain") ||
          errorMessage.toLowerCase().includes("not registered")) {
        errorMessage = "Payment Error: This website domain is not registered with the Razorpay account. Please contact the administrator to add this domain in Razorpay settings.";
      }
      
      setError(errorMessage);
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
            <p className="text-slate-400">Loading cart...</p>
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
              Shopping{" "}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Cart
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </header>

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate("/shop")}
                className="rounded-full bg-sky-500 px-6 py-3 text-base font-medium text-slate-950 shadow-lg transition-all duration-200 hover:bg-sky-400 hover:shadow-xl hover:-translate-y-0.5"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div 
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() => window.open(`/product/${item.product._id}`, '_blank')}
                      >
                        <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden border border-slate-800 bg-slate-800 hover:border-sky-400 transition-colors">
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
                      <div className="flex-1 flex flex-col justify-between">
                        <div 
                          className="cursor-pointer"
                          onClick={() => window.open(`/product/${item.product._id}`, '_blank')}
                        >
                          <h3 className="text-lg font-semibold text-slate-50 mb-1 hover:text-sky-400 transition-colors">
                            {item.product.name}
                          </h3>
                          {item.product.description && (
                            <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                              {item.product.description}
                            </p>
                          )}
                          <p className="text-lg font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                            ₹{item.product.price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReduceQuantity(item.product._id);
                              }}
                              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1 || reducingQuantityId === item.product._id}
                            >
                              {reducingQuantityId === item.product._id ? (
                                <span className="h-4 w-4 text-slate-300 inline-block animate-spin">⏳</span>
                              ) : (
                                <MinusIcon className="h-4 w-4 text-slate-300" />
                              )}
                            </button>
                            <span className="text-slate-200 font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item.product._id);
                              }}
                              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={addingToCartId === item.product._id}
                            >
                              {addingToCartId === item.product._id ? (
                                <span className="text-xs text-slate-300">Adding...</span>
                              ) : (
                                <PlusIcon className="h-4 w-4 text-slate-300" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-slate-300 font-medium">
                              Total: ₹{(item.quantity * item.product.price).toFixed(2)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(item.product._id);
                              }}
                              className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={deletingItemId === item.product._id}
                            >
                              {deletingItemId === item.product._id ? (
                                <span className="animate-spin">🗑️</span>
                              ) : (
                                <TrashIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sticky top-20">
                  <h2 className="text-xl font-semibold text-slate-50 mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t border-slate-800 pt-4">
                      <div className="flex justify-between text-lg font-semibold text-slate-50">
                        <span>Total</span>
                        <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                          ₹{calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full mt-6 rounded-full bg-sky-500 px-6 py-3 text-base font-medium text-slate-950 shadow-lg transition-all duration-200 hover:bg-sky-400 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => navigate("/shop")}
                    className="w-full mt-3 rounded-full border-2 border-slate-700 bg-slate-900/60 px-6 py-3 text-base font-medium text-slate-100 transition-all duration-200 hover:border-sky-400 hover:bg-slate-900"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Review Modal */}
      {showOrderReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-100">
                Review Your Order
              </h2>
              <button
                onClick={() => {
                  setShowOrderReview(false);
                  setError("");
                }}
                className="text-slate-400 hover:text-slate-200 transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Order Items</h3>
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                      {item.product.image && item.product.image.length > 0 ? (
                        <img
                          src={item.product.image[0]}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%231e293b' width='80' height='80'/%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-500 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-50 mb-1">
                        {item.product.name}
                      </h4>
                      {item.product.description && (
                        <p className="text-sm text-slate-400 line-clamp-1 mb-2">
                          {item.product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-300">
                          <span>Quantity: {item.quantity}</span>
                          <span className="mx-2">×</span>
                          <span>₹{item.product.price}</span>
                        </div>
                        <span className="font-semibold text-slate-50">
                          ₹{(item.quantity * item.product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address Section */}
            <div className="border-t border-slate-800 pt-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-sky-400" />
                  Delivery Address
                </h3>
                <button
                  onClick={() => {
                    setShowAddressForm(!showAddressForm);
                    setSelectedAddressId(null);
                  }}
                  className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                >
                  {showAddressForm ? "Hide" : savedAddresses.length > 0 ? "Use Different Address" : "Enter Address"}
                </button>
              </div>

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && !showAddressForm && (
                <div className="mb-4 space-y-2">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedAddressId === addr._id
                          ? "border-sky-500 bg-sky-500/10"
                          : "border-slate-700 bg-slate-800/50 hover:border-sky-500/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {addr.isDefault && (
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300 mb-2">
                              Default
                            </span>
                          )}
                          <p className="text-slate-100 font-medium">{addr.street}</p>
                          <p className="text-sm text-slate-400">
                            {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                          <p className="text-sm text-slate-400">{addr.country}</p>
                          <p className="text-sm text-slate-400 mt-1">Phone: {addr.phone}</p>
                        </div>
                        {selectedAddressId === addr._id && (
                          <div className="h-5 w-5 rounded-full bg-sky-500 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-slate-950"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showAddressForm ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.zipCode}
                        onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                        placeholder="12345"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  {address.street ? (
                    <div className="text-slate-300 text-sm">
                      <p className="font-medium text-slate-200 mb-1">Delivery Address:</p>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                      <p className="mt-2">Phone: {address.phone}</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No address added yet. Click "Add/Edit Address" to add one.</p>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t border-slate-800 pt-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-slate-800 pt-2">
                  <div className="flex justify-between text-lg font-semibold text-slate-50">
                    <span>Total Amount</span>
                    <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                      ₹{calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirmOrder}
                disabled={creatingOrder}
                className="flex-1 bg-sky-500 text-slate-950 py-3 rounded-lg font-medium hover:bg-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingOrder ? "Processing Payment..." : "Proceed to Payment"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOrderReview(false);
                  setError("");
                }}
                disabled={creatingOrder}
                className="flex-1 bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;

