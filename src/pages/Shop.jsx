import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { motion } from "framer-motion";

const Shop = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState({});
  const touchStartX = useRef({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/getAllProducts");
        if (res.data.success) {
          setProducts(res.data.allProduct);
        }
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 scroll-smooth">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main className="py-16 px-4 sm:px-8 lg:px-20 bg-[#05071f]">
        <section className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-50">
              Our{" "}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Collection
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Browse all katanas available in stock, powered by live data from
              the backend.
            </p>
          </header>

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
              <p className="mt-4 text-slate-400 text-sm">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              No products available yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <motion.article
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                  onClick={() => window.open(`/product/${product._id}`, '_blank')}
                >
                  <div
                    className="relative h-56 w-full overflow-hidden bg-slate-800"
                    onTouchStart={(e) => {
                      touchStartX.current[product._id] = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                      const startX = touchStartX.current[product._id];
                      if (startX == null) return;
                      const diff = e.changedTouches[0].clientX - startX;
                      const threshold = 40;
                      if (Math.abs(diff) > threshold && product.image?.length > 1) {
                        setActiveImage((prev) => {
                          const current = prev[product._id] ?? 0;
                          const total = product.image.length;
                          const nextIndex =
                            diff > 0
                              ? (current - 1 + total) % total
                              : (current + 1) % total;
                          return { ...prev, [product._id]: nextIndex };
                        });
                      }
                      touchStartX.current[product._id] = null;
                    }}
                  >
                    {product.image && product.image.length > 0 ? (
                      <img
                        src={
                          product.image[activeImage[product._id] ?? 0] ||
                          product.image[0]
                        }
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%231e293b' width='400' height='300'/%3E%3Ctext fill='%23647590' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-500 text-sm">
                        No Image
                      </div>
                    )}
                    <div
                      className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        product.instock
                          ? "bg-green-500/20 text-green-300 border border-green-500/50"
                          : "bg-red-500/20 text-red-300 border border-red-500/50"
                      }`}
                    >
                      {product.instock ? "In Stock" : "Out of Stock"}
                    </div>

                    {product.image && product.image.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-100 text-xs shadow-sm hover:bg-slate-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImage((prev) => {
                              const current = prev[product._id] ?? 0;
                              const total = product.image.length;
                              return {
                                ...prev,
                                [product._id]: (current - 1 + total) % total,
                              };
                            });
                          }}
                        >
                          ◀
                        </button>
                        <button
                          type="button"
                          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-100 text-xs shadow-sm hover:bg-slate-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImage((prev) => {
                              const current = prev[product._id] ?? 0;
                              const total = product.image.length;
                              return {
                                ...prev,
                                [product._id]: (current + 1) % total,
                              };
                            });
                          }}
                        >
                          ▶
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {product.image.map((_, idx) => (
                            <span
                              key={idx}
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                idx === (activeImage[product._id] ?? 0)
                                  ? "bg-sky-400"
                                  : "bg-slate-600/70"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-slate-50">
                          {product.name}
                        </h2>
                        {product.description && (
                          <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-semibold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                        ₹{product.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Qty: {product.quantity ?? 0}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!isLoggedIn) {
                            navigate("/login");
                            return;
                          }
                          if (!product.instock) return;
                          
                          try {
                            const res = await api.post(`/cart/add/${product._id}`, { quantity: 1 });
                            if (res.data.success) {
                              // Show success message
                              alert("Item added to cart!");
                              // Optionally refresh cart count in navbar by triggering a page reload or using a callback
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
                        className="flex-1 rounded-full bg-sky-500 px-3 py-2 text-xs font-medium text-slate-950 shadow-sm transition-all duration-200 hover:bg-sky-400 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {product.instock ? "Add to Cart" : "Out of Stock"}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/product/${product._id}`, '_blank');
                        }}
                        className="flex-1 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-100 transition-all duration-200 hover:border-sky-400 hover:bg-slate-900"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;


