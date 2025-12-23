// src/middleware/AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAdmin = true; // Replace this with your actual admin check logic
  // For example: const isAdmin = localStorage.getItem("userRole") === "admin";

  if (!isAdmin) return <Navigate to="/not-authorized" />;

  return children; // Render nested admin layout
}
