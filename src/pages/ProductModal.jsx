import { motion } from "framer-motion";

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  error,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">
          {title}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Image Files */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Product Images (select multiple)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const promises = files.map((file) => {
                  return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      resolve(event.target.result);
                    };
                    reader.readAsDataURL(file);
                  });
                });
                Promise.all(promises).then((images) => {
                  setFormData((prev) => ({
                    ...prev,
                    image: images,
                  }));
                });
              }}
              className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
            />
            {Array.isArray(formData.image) && formData.image.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-400 mb-2">
                  {formData.image.length} image(s) selected:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.image.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-slate-700 group-hover:opacity-75 transition-opacity"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            image: prev.image.filter((_, i) => i !== idx),
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Delete image"
                      >
                        ✕
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Base Price & Discounted Price, Quantity */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Base Price (MRP)
              </label>
              <input
                type="number"
                placeholder="Base Price"
                value={formData.basePrice || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    basePrice: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Discounted Price (Sale)
              </label>
              <input
                type="number"
                placeholder="Discounted Price"
                value={formData.discountedPrice || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discountedPrice: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
              />
            </div>
          </div>

          {/* Perfume Specific Fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Brand
              </label>
              <input
                type="text"
                placeholder="Brand (e.g. VelourFits)"
                value={formData.brand || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    brand: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Volume (ml)
                </label>
                <input
                  type="number"
                  placeholder="50"
                  value={formData.volume || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, volume: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Concentration
                </label>
                <input
                  type="text"
                  placeholder="Eau de Parfum"
                  value={formData.concentration || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      concentration: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fragrance Notes (comma separated)
              </label>
              <input
                type="text"
                placeholder="Top: bergamot, Mid: jasmine, Base: musk"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* In stock & Featured */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.instock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    instock: e.target.checked,
                  }))
                }
              />
              <span className="text-sm text-slate-300">In Stock</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured: e.target.checked,
                  }))
                }
              />
              <span className="text-sm text-slate-300">Featured Product</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-sky-500 text-slate-950 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-400 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (title.includes("Add") ? "Creating..." : "Updating...")
                : (title.includes("Add") ? "Create" : "Update")
              }
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductModal;
