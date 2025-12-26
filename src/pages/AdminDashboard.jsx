import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/api";
import ProductModal from "./ProductModal";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageIndexMap, setImageIndexMap] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: [],
    price: "",
    basePrice: "",
    discountedPrice: "",
    quantity: "",
    instock: true,
    brand: "",
    volume: "",
    concentration: "",
    notes: "",
    featured: false,
  });

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  // 📦 Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/getAllProducts");
      if (res.data.success) {
        setProducts(res.data.allProduct);
      }
    } catch {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  // ➕ Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description || "",
        image: Array.isArray(formData.image) ? formData.image : [],
        // derive `price` from discounted or base price for backend compatibility
        price: formData.discountedPrice
          ? parseFloat(formData.discountedPrice)
          : formData.basePrice
          ? parseFloat(formData.basePrice)
          : 0,
        basePrice: formData.basePrice ? parseFloat(formData.basePrice) : null,
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
        quantity: parseInt(formData.quantity) || 0,
        instock: formData.instock,
        brand: formData.brand || "",
        volume: parseFloat(formData.volume) || 0,
        concentration: formData.concentration || "",
        notes: formData.notes || "",
        featured: formData.featured || false,
      };

      // console.log("Sending payload:", payload); // Debug log

      const res = await api.post("/admin/createProduct", payload);
      if (res.data.success) {
        setShowAddModal(false);
        resetForm();
        fetchProducts();
      }
    } catch (err) {
      // console.error("Error creating product:", err);
      setError(err.response?.data?.message || err.message || "Create failed");
    }
  };

  // ✏️ Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      image: Array.isArray(product.image) ? product.image : [],
      price: product.price,
      basePrice: product.basePrice || "",
      discountedPrice: product.discountedPrice || "",
      quantity: product.quantity || 0,
      instock: product.instock,
      brand: product.brand || "",
      volume: product.volume || "",
      concentration: product.concentration || "",
      notes: product.notes || "",
      featured: product.featured || false,
    });
    setShowEditModal(true);
  };

  // 🔄 Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description || "",
        image: Array.isArray(formData.image) ? formData.image : [],
        // derive `price` from discounted or base price for backend compatibility
        price: formData.discountedPrice
          ? parseFloat(formData.discountedPrice)
          : formData.basePrice
          ? parseFloat(formData.basePrice)
          : 0,
        basePrice: formData.basePrice ? parseFloat(formData.basePrice) : null,
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
        quantity: parseInt(formData.quantity) || 0,
        instock: formData.instock,
        brand: formData.brand || "",
        volume: parseFloat(formData.volume) || 0,
        concentration: formData.concentration || "",
        notes: formData.notes || "",
        featured: formData.featured || false,
      };

      // console.log("Updating product with payload:", payload); // Debug log

      const res = await api.patch(
        `/admin/updateProduct/${editingProduct._id}`,
        payload
      );

      if (res.data.success) {
        setShowEditModal(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      }
    } catch (err) {
      // console.error("Error updating product:", err);
      setError(err.response?.data?.message || err.message || "Update failed");
    }
  };

  // 🗑 Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/admin/deleteProduct/${id}`);
      fetchProducts();
    } catch {
      setError("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: [],
      price: "",
      basePrice: "",
      discountedPrice: "",
      quantity: "",
      instock: true,
      brand: "",
      volume: "",
      concentration: "",
      notes: "",
      featured: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-sky-500 text-black px-4 py-2 rounded-lg"
            >
              <PlusIcon className="h-5 w-5" />
              Add Product
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const currentImageIndex = imageIndexMap[product._id] || 0;
              const images = Array.isArray(product.image) ? product.image : [product.image].filter(Boolean);
              const hasMultipleImages = images.length > 1;
              
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                >
                  {/* Image Slider */}
                  <div className="relative h-40 bg-slate-800 overflow-hidden group">
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      className="h-40 w-full object-cover"
                    />
                    
                    {/* Previous Button */}
                    {hasMultipleImages && (
                      <button
                        onClick={() =>
                          setImageIndexMap((prev) => ({
                            ...prev,
                            [product._id]: (currentImageIndex - 1 + images.length) % images.length,
                          }))
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                    )}
                    
                    {/* Next Button */}
                    {hasMultipleImages && (
                      <button
                        onClick={() =>
                          setImageIndexMap((prev) => ({
                            ...prev,
                            [product._id]: (currentImageIndex + 1) % images.length,
                          }))
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    )}
                    
                    {/* Image Counter */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {currentImageIndex + 1}/{images.length}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between mt-3">
                      <span className="text-sky-400 font-bold">
                        ₹{product.price}
                      </span>
                      <span className="text-sm">
                        Qty: {product.quantity || 0}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 bg-slate-700 py-2 rounded-lg flex justify-center gap-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex-1 bg-red-500/20 text-red-300 py-2 rounded-lg flex justify-center gap-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      <ProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
          setError("");
        }}
        onSubmit={handleAddProduct}
        title="Add New Product"
        formData={formData}
        setFormData={setFormData}
        error={error}
      />

      <ProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProduct(null);
          resetForm();
          setError("");
        }}
        onSubmit={handleUpdateProduct}
        title="Edit Product"
        formData={formData}
        setFormData={setFormData}
        error={error}
      />
    </div>
  );
};

export default AdminDashboard;
