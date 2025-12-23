import React, { useState, useEffect } from "react";
import "./Packages.css";
import { apiURL } from "../services/variables.js";

export default function Packages() {
  const [activeTab, setActiveTab] = useState("Domestic");
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [viewPackage, setViewPackage] = useState(null);
  const [detailForm, setDetailForm] = useState(null);
  const [existingDetails, setExistingDetails] = useState([]);
  const [editingDetail, setEditingDetail] = useState(null);


  const [newPackage, setNewPackage] = useState({
    title: "",
    type: "Domestic",
    category: "",
    price: "",
    rating: "",
    review: "",
    image: "",
    country: "",
    showOnHome: false,
  });

  // 💾 Detail Data (for multiple images)
  const [detailData, setDetailData] = useState({
    mainImage: null,
    images: [],
  });

  // Disable scroll when any modal open
  useEffect(() => {
    document.body.style.overflow =
      formOpen || viewPackage || detailForm ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [formOpen, viewPackage, detailForm]);

  // Initial fetch
  useEffect(() => {
    fetchPackages();
    fetchCategories();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${apiURL}/packages`);
      const data = await response.json();
      setPackages(data.data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiURL}/categories`);
      const data = await response.json();
      if (data.result === "success") setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add or Update Package
  const handleAddOrUpdatePackage = async () => {
    if (!newPackage.title) return alert("Please fill Title!");
    if (!newPackage.country) return alert("Please enter Country!");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${apiURL}/packages/${editingId}`
        : `${apiURL}/packages`;

      const formData = new FormData();
      for (const key in newPackage) {
        formData.append(key, newPackage[key]);
      }
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      if (!response.ok) {
        alert("❌ Error: " + (data.message || "Failed to save package"));
        return;
      }

      alert("✅ Package saved successfully!");
      fetchPackages();
      resetForm();
    } catch (error) {
      console.error("Error saving package:", error);
      alert("Something went wrong while saving the package.");
    }
  };

  // Delete Package
  const handleRemovePackage = async (id) => {
    if (!window.confirm("Are you sure you want to remove this package?")) return;
    try {
      await fetch(`${apiURL}/packages/${id}`, { method: "DELETE" });
      setPackages(packages.filter((pkg) => pkg._id !== id));
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  // Edit base package
  const handleEditPackage = (pkg) => {
    setNewPackage({
      ...pkg,
      category: pkg.category?._id || pkg.category,
    });
    setEditingId(pkg._id);
    setFormOpen(true);
  };

  const handleViewDetails = (pkg) => setViewPackage(pkg);
  const closeViewDetails = () => setViewPackage(null);

  const resetForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setImageFile(null);
    setNewPackage({
      title: "",
      type: "Domestic",
      category: "",
      price: "",
      rating: "",
      review: "",
      image: "",
      country: "",
      showOnHome: false,
    });
  };

  // ───────────────────────────────
  // Handle Multiple Image Details
  // ───────────────────────────────
  const handleOpenDetailForm = async (pkg) => {
    await loadExistingDetails(pkg._id);
    setDetailForm(pkg);
  };

  const loadExistingDetails = async (packageId) => {
  try {
    setExistingDetails([]);
    const res = await fetch(`${apiURL}/package-details/packagebyid/${packageId}`);
    if (res.ok) {
      const payload = await res.json();
      setExistingDetails(
        Array.isArray(payload.data)
          ? payload.data.map((d) => ({
              _id: d._id,
              dayNumber: d.dayNumber || d.day || 1,
              imageName: d.imageName || d.imageUrl?.split("/").pop() || "Untitled",
              touristPlace: d.touristPlace || "",
              rating: d.rating || 0,
              review: d.review || "",
              image: d.image || d.imageUrl || "",
            }))
          : []
      );
    } else {
      setExistingDetails([]);
    }
  } catch (e) {
    console.warn("Could not fetch existing package details", e);
    setExistingDetails([]);
  }
};


  const handleSavePackageDetail = async () => {
    if (!detailForm?._id) {
      alert("Package ID missing! Please re-open the detail form.");
      return;
    }

    if (!detailData.images.length) {
      alert("Please upload at least one image with details.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("packageID", detailForm._id);

      // Build payload array
      const imagesPayload = detailData.images.map((img) => ({
        imageName: img.imageName,
        rating: Number(img.rating) || 4.5,
        review: img.review || "",
        imageDetail: img.imageDetail || "",
      }));

      formData.append("imagesData", JSON.stringify(imagesPayload));

      // Optional cover
      if (detailData.mainImage) formData.append("image", detailData.mainImage);

      // Files
      detailData.images.forEach((img) => formData.append("images", img.image));

      const response = await fetch(`${apiURL}/package-details`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        alert("❌ Failed to save details: " + (data.message || "Unknown error"));
        return;
      }

      alert("✅ Package Detail saved successfully!");
      await loadExistingDetails(detailForm._id);
    } catch (error) {
      console.error("Error saving package detail:", error);
      alert("Something went wrong while saving the package detail.");
    }
  };

  const filteredPackages = packages.filter(
  (pkg) => pkg.type === activeTab
);


  return (
    <div className="packages-container">
      <header className="page-header">
        <h1>🌍 Travel Packages</h1>
        <button className="add-new-btn" onClick={() => setFormOpen(true)}>
          ➕ Add Package
        </button>
      </header>

      {/* Tabs */}
      <div className="tabs">
        {["Domestic", "Overseas"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              setSelectedSubcategory("");
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Package Grid */}
      <div className="package-grid">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => (
            <div key={pkg._id} className="package-card">
              {pkg.image && (
                <img src={pkg.image} alt={pkg.title} className="package-img" />
              )}
              <div className="package-info">
                <h3>{pkg.title}</h3>
                <p>🏷️ {pkg.category?.title}</p>
                <p>🌍 {pkg.country}</p>
                <p>💰 ₹{pkg.price}</p>
                <p>⭐ {pkg.rating}</p>
                <p>Review: {pkg.review}</p>
                <p>🏠 Show on Home: {pkg.showOnHome ? "✅ Yes" : "❌ No"}</p>
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditPackage(pkg)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemovePackage(pkg._id)}
                  >
                    ❌ Remove
                  </button>
                  <button
                    className="view-btn"
                    onClick={() => handleViewDetails(pkg)}
                  >
                    👁 View
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-text">No packages available in this category.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {formOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? "Update Package" : "Add New Package"}</h2>
            <div
              className="form-grid"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <div className="radio-group" style={{ gridColumn: "span 2" }}>
                <label>Show on Home:</label>
                <label>
                  <input
                    type="radio"
                    name="showOnHome"
                    checked={newPackage.showOnHome === true}
                    onChange={() =>
                      setNewPackage({ ...newPackage, showOnHome: true })
                    }
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="showOnHome"
                    checked={newPackage.showOnHome === false}
                    onChange={() =>
                      setNewPackage({ ...newPackage, showOnHome: false })
                    }
                  />
                  No
                </label>
              </div>

              <input
                type="text"
                placeholder="Title"
                value={newPackage.title}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, title: e.target.value })
                }
              />
              <select
                value={newPackage.type}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, type: e.target.value })
                }
              >
                <option value="">Select Type</option>
                <option value="Domestic">Domestic</option>
                <option value="Overseas">Overseas</option>
              </select>
              <input
                type="text"
                placeholder="Country"
                value={newPackage.country}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, country: e.target.value })
                }
              />
              <select
                value={newPackage.category}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, category: e.target.value })
                }
              >
                <option value="">Select Subcategory</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Price"
                value={newPackage.price}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, price: e.target.value })
                }
              />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Rating"
                value={newPackage.rating}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    rating: parseFloat(e.target.value),
                  })
                }
              />
              <input
                type="text"
                placeholder="Review"
                value={newPackage.review}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, review: e.target.value })
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleAddOrUpdatePackage} className="save-btn">
                {editingId ? "✅ Update" : "➕ Add"}
              </button>
              <button onClick={resetForm} className="cancel-btn">
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewPackage && (
        <div className="modal-overlay">
          <div className="modal view-modal" style={{ maxWidth: "600px" }}>
            <h2>👁 View Package</h2>
            {viewPackage.image && (
              <img
                src={viewPackage.image}
                alt={viewPackage.title}
                className="package-img"
              />
            )}
            <p><strong>Title:</strong> {viewPackage.title}</p>
            <p><strong>Category:</strong> {viewPackage.category?.title}</p>
            <p><strong>Country:</strong> {viewPackage.country}</p>
            <p><strong>Price:</strong> ₹{viewPackage.price}</p>
            <p><strong>Rating:</strong> ⭐ {viewPackage.rating}</p>
            <p><strong>Review:</strong> {viewPackage.review}</p>
            <p>
              <strong>Show on Home:</strong>{" "}
              {viewPackage.showOnHome ? "✅ Yes" : "❌ No"}
            </p>

            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={() => {
                  setViewPackage(null);
                  handleOpenDetailForm(viewPackage);
                }}
              >
                📋 Detail
              </button>
              <button className="cancel-btn" onClick={closeViewDetails}>
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 Package Detail Form */}
{detailForm && (
  <div className="modal-overlay">
    <div
      className="modal"
      style={{ maxWidth: "950px", maxHeight: "85vh", overflowY: "auto" }}
    >
      <h2>📦 Package Detail Form</h2>

      {/* 🌄 Main Image Upload */}
      <div style={{ marginBottom: "20px" }}>
        <h3>🌄 Main Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setDetailData({ ...detailData, mainImage: e.target.files[0] })
          }
        />
      </div>

     {/* 🗓️ Days Input */}
        <input
          type="number"
          placeholder="Enter number of days"
          value={detailData.daysCount === 0 ? "" : detailData.daysCount || ""}
          onChange={(e) => {
            const value = e.target.value.trim();

            if (value === "") {
              setDetailData({ ...detailData, daysCount: 0, days: [] });
              return;
            }

            const count = parseInt(value);
            if (isNaN(count) || count < 1) {
              setDetailData({ ...detailData, daysCount: 0, days: [] });
              return;
            }

            const newDays = Array.from({ length: count }, (_, i) => ({
              dayNumber: i + 1,
              images: [],
            }));

            setDetailData({ ...detailData, daysCount: count, days: newDays });
          }}
          style={{ width: "180px" }}
        />

       
      {/* 🗓️ Day-wise Sections */}
      {(detailData.days || []).map((day, dayIndex) => (
        <div
          key={dayIndex}
          style={{
            border: "2px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <h3>📅 Day {day.dayNumber}</h3>

          {/* 🖼️ Multiple Image Upload */}
          <h4>🖼️ Upload Images for Day {day.dayNumber}</h4>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const updatedDays = [...detailData.days];
              const mappedImages = files.map((file) => ({
                image: file,
                imageName: file.name.replace(/\.[^/.]+$/, ""),
                rating: 0,
                review: "",
                imageDetail: "",
                touristPlace: "", // 🌴 Added touristPlace field here
              }));
              updatedDays[dayIndex].images = mappedImages;
              setDetailData({ ...detailData, days: updatedDays });
            }}
          />

          {/* 📸 Image Inputs */}
          {day.images.length > 0 &&
            day.images.map((img, imgIndex) => (
              <div
                key={imgIndex}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <h4>🖼️ Image {imgIndex + 1}</h4>
                <p style={{ fontSize: 13, color: "#666" }}>
                  {img.image.name}
                </p>

                {/* 🏷️ Image Name */}
                <input
                  type="text"
                  placeholder="Image Name"
                  value={img.imageName}
                  onChange={(e) => {
                    const updated = [...detailData.days];
                    updated[dayIndex].images[imgIndex].imageName =
                      e.target.value;
                    setDetailData({ ...detailData, days: updated });
                  }}
                  style={{ width: "100%", marginBottom: 8 }}
                />

                {/* 🌴 Tourist Place */}
                <input
                  type="text"
                  placeholder="Tourist Place"
                  value={img.touristPlace}
                  onChange={(e) => {
                    const updated = [...detailData.days];
                    updated[dayIndex].images[imgIndex].touristPlace =
                      e.target.value;
                    setDetailData({ ...detailData, days: updated });
                  }}
                  style={{ width: "100%", marginBottom: 8 }}
                />

                {/* ⭐ Rating (1–5) */}
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating (1–5)"
                  value={
                    img.rating === 0 || img.rating === null
                      ? ""
                      : img.rating
                  }
                  onChange={(e) => {
                    const updated = [...detailData.days];
                    const val = e.target.value;
                    updated[dayIndex].images[imgIndex].rating =
                      val === "" ? 0 : Math.min(5, Math.max(1, Number(val)));
                    setDetailData({ ...detailData, days: updated });
                  }}
                  style={{ width: "100%", marginBottom: 8 }}
                />

                {/* 💬 Review */}
                <input
                  type="text"
                  placeholder="Review"
                  value={img.review}
                  onChange={(e) => {
                    const updated = [...detailData.days];
                    updated[dayIndex].images[imgIndex].review =
                      e.target.value;
                    setDetailData({ ...detailData, days: updated });
                  }}
                  style={{ width: "100%", marginBottom: 8 }}
                />

                {/* 📝 Image Detail */}
                <textarea
                  placeholder="Image Detail / Description"
                  value={img.imageDetail}
                  onChange={(e) => {
                    const updated = [...detailData.days];
                    updated[dayIndex].images[imgIndex].imageDetail =
                      e.target.value;
                    setDetailData({ ...detailData, days: updated });
                  }}
                  style={{ width: "100%", minHeight: "60px" }}
                ></textarea>
              </div>
            ))}
        </div>
      ))}

      {/* 💾 Save / Close Buttons */}
      <div className="modal-actions" style={{ marginTop: 12 }}>
        <button
          className="save-btn"
          onClick={async () => {
            if (!detailForm?._id) return alert("Package ID missing!");

            const formData = new FormData();
              formData.append("packageID", detailForm._id);
              formData.append("daysCount", detailData.daysCount);

              if (detailData.mainImage)
                formData.append("mainImage", detailData.mainImage);

              // 🌍 Add missing required fields
              formData.append("state", detailData.state || "");
              formData.append("imageUrl", detailData.imageUrl || "");

            const daysPayload = detailData.days.map((day) => ({
              dayNumber: day.dayNumber,
              images: day.images.map((img) => ({
                imageName: img.imageName,
                touristPlace: img.touristPlace,
                state: img.state, // ✅ added
                imageUrl: img.imageUrl, // ✅ added
                rating: Number(img.rating) || 0,
                review: img.review,
                imageDetail: img.imageDetail,
              })),
            }));

            formData.append("state", detailData.state || "");
            formData.append("imageUrl", detailData.imageUrl || "");

            formData.append("days", JSON.stringify(daysPayload));

            // Append image files
            detailData.days.forEach((day) => {
              day.images.forEach((img) => formData.append("images", img.image));
            });

            console.group("📦 FormData Contents");
            for (let [key, value] of formData.entries()) {
              if (value instanceof File) {
                console.log(`${key}: [File] ${value.name}`);
              } else {
                console.log(`${key}:`, value);
              }
            }
            console.groupEnd();

            try {
                    const res = await fetch(`${apiURL}/package-details`, {
                      method: "POST",
                      body: formData,
                    });
                    const data = await res.json();

                    if (!res.ok)
                      return alert("❌ Failed: " + (data.message || "Unknown error"));

                    alert("✅ Package Details Saved Successfully!");
                    await loadExistingDetails(detailForm._id);

                    // ✅ Close the modal automatically after successful save
                    setDetailForm(null);

                  } catch (err) {
                    console.error("Error saving:", err);
                    alert("⚠️ Something went wrong while saving details.");
                  }

                 }}
        >
          💾 Save All
        </button>

        <button className="cancel-btn" onClick={() => setDetailForm(null)}>
          ❌ Close
        </button>
      </div>

      {/* 📚 Existing Details */}
<div style={{ marginTop: 20 }}>
  <h3>📚 Existing Details</h3>

  {existingDetails.length === 0 ? (
    <p>No details added yet.</p>
  ) : (
    existingDetails.map((det, index) => (
      <div
        key={det._id || index}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          marginBottom: "10px",
          background: "#fafafa",
          position: "relative",
        }}
      >
        <p><b>Day:</b> {det.dayNumber}</p>
        <p><b>Image:</b> {det.imageName}</p>
        <p><b>Tourist Place:</b> {det.touristPlace}</p>
        <p><b>Rating:</b> {det.rating}</p>
        <p><b>Review:</b> {det.review}</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          {/* ✏️ Edit Button */}
          <button
            onClick={() => setEditingDetail(det)}
            style={{
              background: "#ffa500",
              border: "none",
              padding: "6px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              color: "white",
            }}
          >
            ✏️ Edit
          </button>

          {/* 🗑️ Delete Button */}
          <button
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete this package detail?")) return;
              try {
                const res = await fetch(`${apiURL}/package-details/${det._id}`, {
                  method: "DELETE",
                });
                const data = await res.json();
                if (!res.ok)
                  return alert("❌ Failed: " + (data.message || "Unknown error"));
                alert("✅ Detail deleted successfully!");
                await loadExistingDetails(detailForm._id);
              } catch (err) {
                console.error(err);
                alert("⚠️ Something went wrong while deleting!");
              }
            }}
            style={{
              background: "#dc3545",
              border: "none",
              padding: "6px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              color: "white",
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>

{/* ✏️ Edit Modal */}
{editingDetail && (
  <div
    className="modal-overlay"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      className="modal"
      style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "20px",
        width: "400px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <h3>✏️ Edit Detail</h3>

      <input
        type="text"
        placeholder="Image Name"
        value={editingDetail.imageName}
        onChange={(e) =>
          setEditingDetail({ ...editingDetail, imageName: e.target.value })
        }
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        type="text"
        placeholder="Tourist Place"
        value={editingDetail.touristPlace}
        onChange={(e) =>
          setEditingDetail({ ...editingDetail, touristPlace: e.target.value })
        }
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        type="number"
        min="1"
        max="5"
        placeholder="Rating"
        value={editingDetail.rating}
        onChange={(e) =>
          setEditingDetail({ ...editingDetail, rating: e.target.value })
        }
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        type="text"
        placeholder="Review"
        value={editingDetail.review}
        onChange={(e) =>
          setEditingDetail({ ...editingDetail, review: e.target.value })
        }
        style={{ width: "100%", marginBottom: 8 }}
      />

      <textarea
        placeholder="Image Detail"
        value={editingDetail.imageDetail || ""}
        onChange={(e) =>
          setEditingDetail({ ...editingDetail, imageDetail: e.target.value })
        }
        style={{ width: "100%", minHeight: "60px" }}
      ></textarea>

      <div style={{ display: "flex", gap: "10px", marginTop: 12 }}>
        <button
          onClick={async () => {
            try {
              const res = await fetch(`${apiURL}/package-details/${editingDetail._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingDetail),
              });
              const data = await res.json();
              if (!res.ok)
                return alert("❌ Update failed: " + (data.message || "Unknown error"));
              alert("✅ Detail updated successfully!");
              setEditingDetail(null);
              await loadExistingDetails(detailForm._id);
            } catch (err) {
              console.error("Error updating:", err);
              alert("⚠️ Something went wrong while updating!");
            }
          }}
          style={{
            background: "#28a745",
            border: "none",
            padding: "8px 14px",
            borderRadius: "5px",
            color: "#fff",
          }}
        >
          💾 Save
        </button>

        <button
          onClick={() => setEditingDetail(null)}
          style={{
            background: "#6c757d",
            border: "none",
            padding: "8px 14px",
            borderRadius: "5px",
            color: "#fff",
          }}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  </div>
)}

    </div>
  );
}
