// src/layouts/AdminLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./AdminLayout.css"; // optional styling

export default function AdminLayout() {
  return (
    <div className="app-root">
      <Sidebar />
      <main className="main-area">
        <Outlet /> {/* Nested admin routes will render here */}
      </main>
    </div> 
  );
}
