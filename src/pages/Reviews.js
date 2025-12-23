import React from 'react';
import './Reviews.css';

const reviews = [
  { id: 1, user: 'Ravi Kumar', package: 'Kerala Backwaters', rating: 5, comment: 'Amazing experience!' },
  { id: 2, user: 'Meera Joshi', package: 'Paris Honeymoon', rating: 4, comment: 'Very romantic.' },
];

export default function Reviews() {
  return (
    <div className="page reviews-page">
      <h2>Customer Reviews</h2>
      <div className="reviews-grid">
        {reviews.map(r => (
          <div className="review-card" key={r.id}>
            <div className="review-header">
              <div className="avatar">{r.user.charAt(0)}</div>
              <div>
                <strong className="user-name">{r.user}</strong>
                <span className="package-tag">{r.package}</span>
              </div>
            </div>
            <div className="review-rating">
              {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
            </div>
            <div className="review-body">“{r.comment}”</div>
          </div>
        ))}
      </div>
    </div>
  );
}
