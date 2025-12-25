import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftOnRectangleIcon,
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

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    quantity: "",
    instock: true,
    totalLength: "",
    bladeLength: "",
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
      const images = (formData.image || "")
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
      
      const payload = {
        name: formData.name,
        description: formData.description || "",
        image: images,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0,
        instock: formData.instock,
        totalLength: parseFloat(formData.totalLength) || 0,
        bladeLength: parseFloat(formData.bladeLength) || 0,
        featured: formData.featured || false,
      };

      console.log("Sending payload:", payload); // Debug log

      const res = await api.post("/admin/createProduct", payload);
      if (res.data.success) {
        setShowAddModal(false);
        resetForm();
        fetchProducts();
      }
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.response?.data?.message || err.message || "Create failed");
    }
  };

  // ✏️ Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      image: Array.isArray(product.image)
        ? product.image.join(", ")
        : "",
      price: product.price,
      quantity: product.quantity || 0,
      instock: product.instock,
      totalLength: product.totalLength || "",
      bladeLength: product.bladeLength || "",
      featured: product.featured || false,
    });
    setShowEditModal(true);
  };

  // 🔄 Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const images = (formData.image || "")
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
      
      const payload = {
        name: formData.name,
        description: formData.description || "",
        image: images,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0,
        instock: formData.instock,
        totalLength: parseFloat(formData.totalLength) || 0,
        bladeLength: parseFloat(formData.bladeLength) || 0,
        featured: formData.featured || false,
      };

      console.log("Updating product with payload:", payload); // Debug log

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
      console.error("Error updating product:", err);
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
      image: "",
      price: "",
      quantity: "",
      instock: true,
      totalLength: "",
      bladeLength: "",
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
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              >
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="h-40 w-full object-cover"
                />
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
            ))}
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
