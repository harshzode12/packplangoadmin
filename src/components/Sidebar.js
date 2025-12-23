import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CategoryIcon from '@mui/icons-material/Category'; // ✅ Added
import logo from '../assets/logo.png'; // ✅ fixed path

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={logo} alt="PackPlango Logo" className="brand-logo" />
        <span>PackPlango</span>
      </div>

      <nav className="nav">
        <NavLink to="/admin" end className="nav-item">
          <DashboardIcon /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/users" className="nav-item">
          <PeopleIcon /> <span>Users</span>
        </NavLink>

        <NavLink to="/admin/categories" className="nav-item">   {/* ✅ New Section */}
          <CategoryIcon /> <span>Categories</span>
        </NavLink>

        <NavLink to="/admin/packages" className="nav-item">
          <CardTravelIcon /> <span>Packages</span>
        </NavLink>

        <NavLink to="/admin/bookings" className="nav-item">
          <BookOnlineIcon /> <span>Bookings</span>
        </NavLink>

        <NavLink to="/admin/deals" className="nav-item">
          <LocalOfferIcon /> <span>Deals</span>
        </NavLink>

        <NavLink to="/admin/reviews" className="nav-item">
          <RateReviewIcon /> <span>Reviews</span>
        </NavLink>

        <NavLink to="/admin/rewards" className="nav-item">
          <LoyaltyIcon /> <span>Rewards</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">v1.0 • Admin</div>
    </aside>
  );
}
