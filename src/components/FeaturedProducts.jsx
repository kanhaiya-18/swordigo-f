import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedProducts = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImages, setActiveImages] = useState({}); // { [id]: index }
  const touchStartXRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/getFeaturedProducts");
        if (res.data.success) {
          setProducts(res.data.products || []);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const changeImage = (productId, direction) => {
    const product = products.find((p) => p._id === productId);
    if (!product || !product.image || product.image.length === 0) return;
    const total = product.image.length;
    const current = activeImages[productId] ?? 0;
    const next =
      direction === "prev"
        ? (current - 1 + total) % total
        : (current + 1) % total;

    setActiveImages((prev) => ({ ...prev, [productId]: next }));
  };



  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-50">
            Featured{" "}
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              Perfumes
            </span>
          </h2>
          <p className="mt-2 text-sm text-slate-400/90 max-w-md">
            A curated selection of our signature fragrances — crafted for
            elegance, longevity, and refined presence.
          </p>
        </div>
        <a
          href="/shop"
          className="text-xs sm:text-sm text-sky-400 hover:text-sky-200 underline underline-offset-4 decoration-sky-500/60"
        >
          View all products
        </a>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
          <p className="mt-4 text-slate-400 text-sm">Loading featured products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No featured products available yet.
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
          <motion.article
            key={product.id}
            variants={cardVariants}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            onClick={() => window.open(`/product/${product._id}`, '_blank')}
          >
            {/* Image */}
            <div
              className="relative h-52 w-full overflow-hidden"
              onTouchStart={(e) => {
                touchStartXRef.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const startX = touchStartXRef.current;
                if (startX == null) return;
                const diffX = e.changedTouches[0].clientX - startX;
                const threshold = 40;
                if (Math.abs(diffX) > threshold) {
                  e.stopPropagation(); // Prevent opening product page if swiping
                  if (diffX > 0) {
                    changeImage(product._id, "prev");
                  } else {
                    changeImage(product._id, "next");
                  }
                }
                touchStartXRef.current = null;
              }}
            >
              {product.image && product.image.length > 0 ? (
                <img
                  src={
                    product.image[activeImages[product._id] ?? 0] ||
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
              <div className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                product.instock
                  ? "bg-green-500/20 text-green-300 border border-green-500/50"
                  : "bg-red-500/20 text-red-300 border border-red-500/50"
              }`}>
                {product.instock ? "In Stock" : "Out of Stock"}
              </div>

              {/* Dots indicator on card */}
              {product.image && product.image.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.image.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        idx === (activeImages[product._id] ?? 0)
                          ? "bg-sky-400"
                          : "bg-slate-600/70"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Per-product image slider controls (desktop only) */}
              {product.image && product.image.length > 1 && (
                <>
                  <button
                    type="button"
                    className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-100 text-xs shadow-sm hover:bg-slate-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      changeImage(product._id, "prev");
                    }}
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-100 text-xs shadow-sm hover:bg-slate-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      changeImage(product._id, "next");
                    }}
                  >
                    ▶
                  </button>
                </>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-50">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="mt-1 text-xs text-slate-400/90 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
                {/* Price display: show discounted price prominently with original price struck-through when applicable */}
                <div className="text-right">
                  {(() => {
                    const mainPrice = product.discountedPrice ?? product.price;
                    const originalPrice = product.discountedPrice
                      ? (product.basePrice ?? product.price)
                      : null;
                    return (
                      <div>
                        <div className="text-sm font-semibold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                          ₹{mainPrice}
                        </div>
                        {originalPrice && originalPrice > mainPrice && (
                          <div className="text-xs text-slate-400 line-through mt-0.5">₹{originalPrice}</div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400/90">
                {(product.volume || product.size || product.category) && (
                  <span>
                    {product.volume
                      ? `${product.volume}`
                      : product.size
                      ? `${product.size}`
                      : product.category}
                  </span>
                )}
              </div>

              {/* Button */}
              <div className="mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/product/${product._id}`, '_blank');
                  }}
                  className="w-full rounded-full border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-100 transition-all duration-200 hover:border-sky-400 hover:bg-slate-900"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Subtle overlay on hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-white" />
          </motion.article>
        ))}
        </motion.div>
      )}

    </div>
  );
};

export default FeaturedProducts;