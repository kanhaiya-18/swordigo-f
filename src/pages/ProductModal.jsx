import { motion } from "framer-motion";

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  error,
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

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Image URL(s) (comma separated)
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  image: e.target.value,
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
            />
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
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
            />
          </div>

          {/* Total Length & Blade Length */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Total Length (cm)
              </label>
              <input
                type="number"
                placeholder="Total Length"
                value={formData.totalLength}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    totalLength: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Blade Length (cm)
              </label>
              <input
                type="number"
                placeholder="Blade Length"
                value={formData.bladeLength}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bladeLength: e.target.value,
                  }))
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
              className="flex-1 bg-sky-500 text-slate-950 py-2 rounded-lg font-medium"
            >
              {title.includes("Add") ? "Create" : "Update"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 text-white py-2 rounded-lg"
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
