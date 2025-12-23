import React from 'react';
import './Rewards.css';

const rewards = [
  { user: 'John Doe', points: 450, redeemed: 450 },
  { user: 'Alice Smith', points: 120, redeemed: 100 },
];

export default function Rewards() {
  return (
    <div className="page rewards-page">
      <h2>Rewards & Loyalty Points</h2>
      <div className="rewards-grid">
        {rewards.map((r, i) => (
          <div key={i} className="reward-card">
            <div className="reward-header">
              <div className="avatar">{r.user.charAt(0)}</div>
              <div>
                <h3 className="user-name">{r.user}</h3>
                <span className="badge">{r.points >= 300 ? "Gold Member 🏆" : "Silver Member 🎖️"}</span>
              </div>
            </div>

            <div className="reward-body">
              <p>
                <strong>Total Points:</strong> {r.points} 🪙
              </p>
              <p>
                <strong>Redeemed:</strong> {r.redeemed} 🪙
              </p>

              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${(r.redeemed / r.points) * 100 || 0}%` }}
                ></div>
              </div>
              <small>{r.redeemed} / {r.points} 🪙 redeemed</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
