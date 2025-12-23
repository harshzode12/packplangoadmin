import React from 'react';
import './DashboardCard.css';

export default function DashboardCard({ title, value, subtitle, icon }) {
  return (
    <div className="dashboard-card">
      <div className="icon">{icon}</div>
      <div className="details">
        <h3>{title}</h3>
        <p className="value">{value}</p>
        <p className="subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
