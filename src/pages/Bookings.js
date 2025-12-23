import React from 'react';
import './Bookings.css';

const bookings = [
  { id: 'BKG001', user: 'John Doe', package: 'Dubai Luxury Tour', date: '2025-10-12', travellers: 2, status: 'Confirmed', amount: '₹2,40,000' },
  { id: 'BKG002', user: 'Alice Smith', package: 'Kerala Backwaters', date: '2025-11-05', travellers: 4, status: 'Pending', amount: '₹1,00,000' },
];

export default function Bookings() {
  return (
    <div className="page bookings-page">
      <h2>Bookings</h2>
      <div className="bookings-grid">
        {bookings.map(b => (
          <div key={b.id} className="booking-card">
            <div className="booking-header">
              <span className="booking-id">{b.id}</span>
              <span className={`status ${b.status.toLowerCase()}`}>{b.status}</span>
            </div>
            <div className="booking-body">
              <h3>{b.package}</h3>
              <p><strong>User:</strong> {b.user}</p>
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Travellers:</strong> {b.travellers}</p>
              <p><strong>Amount:</strong> {b.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
