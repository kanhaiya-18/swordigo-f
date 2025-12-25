import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { motion } from "framer-motion";

const ProductDetail = ({ isLoggedIn, setIsLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/getProduct/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSwipe = () => {
    if (!product || !product.image || product.image.length <= 1) return;
    
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > swipeThreshold) {
      const total = product.image.length;
      if (diff > 0) {
        // Swipe left - next image
        setActiveImageIndex((prev) => (prev + 1) % total);
      } else {
        // Swipe right - previous image
        setActiveImageIndex((prev) => (prev - 1 + total) % total);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
            <p className="text-slate-400">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-400 mb-4">
              {error || "Product not found"}
            </h1>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-2 rounded-full bg-sky-500 text-slate-950 font-medium hover:bg-sky-400 transition-colors"
            >
              Back to Shop
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
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div 
                className="relative aspect-square overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 cursor-zoom-in"
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  touchEndX.current = e.changedTouches[0].clientX;
                  handleSwipe();
                }}
              >
                {product.image && product.image.length > 0 ? (
                  <img
                    src={product.image[activeImageIndex] || product.image[0]}
                    alt={product.name}
                    className="h-full w-full object-contain transition-transform duration-300"
                    onClick={() => setZoomedImage(product.image[activeImageIndex] || product.image[0])}
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%231e293b' width='400' height='400'/%3E%3Ctext fill='%23647590' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                    No Image Available
                  </div>
                )}

                {/* Stock Badge */}
                <div
                  className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-sm font-medium ${
                    product.instock
                      ? "bg-green-500/20 text-green-300 border border-green-500/50"
                      : "bg-red-500/20 text-red-300 border border-red-500/50"
                  }`}
                >
                  {product.instock ? "In Stock" : "Out of Stock"}
                </div>

                {/* Navigation Buttons for Desktop */}
                {product.image && product.image.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-100 text-lg shadow-lg hover:bg-slate-900 transition-colors z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        const total = product.image.length;
                        setActiveImageIndex((prev) => (prev - 1 + total) % total);
                      }}
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-100 text-lg shadow-lg hover:bg-slate-900 transition-colors z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        const total = product.image.length;
                        setActiveImageIndex((prev) => (prev + 1) % total);
                      }}
                    >
                      ▶
                    </button>
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {product.image.map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-2 w-2 rounded-full transition-colors ${
                            idx === activeImageIndex
                              ? "bg-sky-400"
                              : "bg-slate-600/70"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.image && product.image.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {product.image.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all cursor-zoom-in ${
                        idx === activeImageIndex
                          ? "border-sky-400 ring-2 ring-sky-400/50"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="h-full w-full object-cover"
                        onClick={() => {
                          setActiveImageIndex(idx);
                          setZoomedImage(img);
                        }}
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%231e293b' width='100' height='100'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Product Name */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-2">
                  {product.name}
                </h1>
                {/* <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>Product ID: {product._id}</span>
                </div> */}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                  ₹{product.price}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-slate-200">
                    Description
                  </h2>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Information */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h2 className="text-xl font-semibold text-slate-200">
                  Product Information
                </h2>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Stock Status</span>
                    <span
                      className={`font-medium ${
                        product.instock ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {product.instock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Quantity Available</span>
                    <span className="font-medium text-slate-200">
                      {product.quantity ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Price</span>
                    <span className="font-medium text-slate-200">
                      ₹{product.price}
                    </span>
                  </div>
                  {product.totalLength && (
                    <div className="flex items-center justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Total Length</span>
                      <span className="font-medium text-slate-200">
                        {product.totalLength} cm
                      </span>
                    </div>
                  )}
                  {product.bladeLength && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-400">Blade Length</span>
                      <span className="font-medium text-slate-200">
                        {product.bladeLength} cm
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={async () => {
                    if (!isLoggedIn) {
                      navigate("/login");
                      return;
                    }
                    if (!product.instock) return;
                    
                    try {
                      const res = await api.post(`/cart/add/${product._id}`, { quantity: 1 });
                      if (res.data.success) {
                        alert("Item added to cart!");
                        // Trigger cart update event
                        window.dispatchEvent(new Event('cartUpdated'));
                      }
                    } catch (err) {
                      console.error("Error adding to cart:", err);
                      const errorMessage = err.response?.data?.message || err.message || "Failed to add to cart";
                      alert(errorMessage);
                      
                      // If unauthorized, redirect to login
                      if (err.response?.status === 401) {
                        navigate("/login");
                      }
                    }
                  }}
                  disabled={!product.instock}
                  className="flex-1 rounded-full bg-sky-500 px-6 py-3 text-base font-medium text-slate-950 shadow-lg transition-all duration-200 hover:bg-sky-400 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {product.instock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={() => navigate("/shop")}
                  className="flex-1 rounded-full border-2 border-slate-700 bg-slate-900/60 px-6 py-3 text-base font-medium text-slate-100 transition-all duration-200 hover:border-sky-400 hover:bg-slate-900"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={zoomedImage}
              alt={product?.name || "Zoomed image"}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-sky-400 transition-colors text-2xl font-bold bg-slate-900/50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;

