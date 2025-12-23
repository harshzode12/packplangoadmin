import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Packages from "./pages/Packages";
import Bookings from "./pages/Bookings";
import Deals from "./pages/Deals";
import Reviews from "./pages/Reviews";
import Rewards from "./pages/Rewards";
import Categories from "./pages/Categories";
import NotAuthorized from "./pages/NotAuthorized";

import AdminRoute from "./middleware/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Nested admin routes */}
          <Route index element={<Dashboard />} />       {/* /admin */}
          <Route path="users" element={<Users />} />  {/* /admin/users */}
          <Route path="categories" element={<Categories />} />
          <Route path="packages" element={<Packages />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="deals" element={<Deals />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="not-authorized" element={<NotAuthorized />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
