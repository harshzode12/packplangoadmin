import React from 'react';
import './Deals.css';

const deals = [
  { code: 'DIWALI25', type: 'Percentage', value: '25%', expires: '2025-11-01', usage: 124 },
  { code: 'NEWUSER500', type: 'Flat', value: '₹500', expires: '2026-01-01', usage: 402 },
];

export default function Deals() {
  return (
    <div className="page deals-page">
      <h2>Deals & Discounts</h2>
      <div className="deals-grid">
        {deals.map(d => (
          <div key={d.code} className="deal-card">
            <div className="deal-header">
              <span className="deal-code">{d.code}</span>
              <span className="deal-type">{d.type}</span>
            </div>
            <div className="deal-body">
              <h3>{d.value} OFF</h3>
              <p><i className="fas fa-calendar-alt"></i> Expires: {d.expires}</p>
              <p><i className="fas fa-users"></i> Used {d.usage} times</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
