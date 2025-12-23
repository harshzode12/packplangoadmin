import React from 'react';
import DashboardCard from '../components/DashboardCard';
import './Dashboard.css';

// Import Material UI icons
import PeopleIcon from '@mui/icons-material/People';          // Users
import BookOnlineIcon from '@mui/icons-material/BookOnline';  // Bookings
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';// Revenue
import CardTravelIcon from '@mui/icons-material/CardTravel';  // Packages

export default function Dashboard() {
  return (
    <div className="page dashboard-page">
      <h2>Admin Dashboard</h2>
      <div className="grid">
        <DashboardCard 
          title="Total Users" 
          value="2,430" 
          subtitle="Active this month: 312" 
          icon={<PeopleIcon style={{ fontSize: 40, color: "#4B0082" }} />} 
        />
        <DashboardCard 
          title="Active Bookings" 
          value="128" 
          subtitle="Today: 12" 
          icon={<BookOnlineIcon style={{ fontSize: 40, color: "#FF1493" }} />} 
        />
        <DashboardCard 
          title="Revenue (Monthly)" 
          value="₹3,75,400" 
          subtitle="Growth: 8.3%" 
          icon={<AttachMoneyIcon style={{ fontSize: 40, color: "#228B22" }} />} 
        />
        <DashboardCard 
          title="Top Package" 
          value="Dubai Luxury" 
          subtitle="Booked 54 times" 
          icon={<CardTravelIcon style={{ fontSize: 40, color: "#FF8C00" }} />} 
        />
      </div>
    </div>
  );
}
