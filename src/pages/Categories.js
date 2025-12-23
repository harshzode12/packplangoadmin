import React, { useState, useEffect } from "react";
import "./Categories.css";
import { apiURL } from "../services/variables.js";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);

  const [newCategory, setNewCategory] = useState({
    title: "",
    image: "",
  });

  // Disable scroll when modal open
  useEffect(() => {
    document.body.style.overflow = formOpen || viewCategory ? "hidden" : "auto";
  }, [formOpen, viewCategory]);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiURL}/categories`);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add or Update
  const handleAddOrUpdateCategory = async () => {
    if (!newCategory.title) {
      alert("Please enter a category title!");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${apiURL}/categories/${editingId}`
        : `${apiURL}/categories`;

      const formData = new FormData();
      formData.append("title", newCategory.title);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      if (!response.ok) {
        alert("❌ Error: " + (data.message || "Failed to save category"));
        return;
      }

      alert("✅ Category saved successfully!");
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Something went wrong while saving the category.");
    }
  };

  // Delete
  const handleRemoveCategory = async (id) => {
    if (!window.confirm("Are you sure you want to remove this category?")) return;
    try {
      await fetch(`${apiURL}/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Edit
  const handleEditCategory = (cat) => {
    setNewCategory({ title: cat.title, image: cat.image });
    setEditingId(cat._id);
    setFormOpen(true);
  };

  // View
  const handleViewDetails = (cat) => setViewCategory(cat);
  const closeViewDetails = () => setViewCategory(null);

  // Reset
  const resetForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setImageFile(null);
    setNewCategory({
      title: "",
      image: "",
    });
  };

  return (
    <div className="categories-container">
      <header className="page-header">
        <h1>🧭 Discover Your Way to Travel</h1>
        <button className="add-new-btn" onClick={() => setFormOpen(true)}>
          ➕ Add Category
        </button>
      </header>

      {/* Category Grid */}
      <div className="category-grid">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div key={cat._id} className="category-card">
              {cat.image && <img src={cat.image} alt={cat.title} className="category-img" />}
              <div className="overlay">
                <h3>{cat.title}</h3>
              </div>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEditCategory(cat)}>
                  ✏ Edit
                </button>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveCategory(cat._id)}
                >
                  ❌ Remove
                </button>
                <button className="view-btn" onClick={() => handleViewDetails(cat)}>
                  👁 View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-text">No categories available.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {formOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? "Update Category" : "Add New Category"}</h2>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Title (e.g., Adventure Trip)"
                value={newCategory.title}
                onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleAddOrUpdateCategory} className="save-btn">
                {editingId ? "✅ Update" : "➕ Add"}
              </button>
              <button onClick={resetForm} className="cancel-btn">
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewCategory && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{viewCategory.title}</h2>
            {viewCategory.image && (
              <img src={viewCategory.image} alt={viewCategory.title} className="category-img" />
            )}
            <div className="modal-actions">
              <button onClick={closeViewDetails} className="cancel-btn">
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
