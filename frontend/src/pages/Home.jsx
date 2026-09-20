import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile, changePassword } from '../services/api';

const Home = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
  const [status, setStatus] = useState({ error: '', success: '', loading: false });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        setUser(null);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, setUser]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passData.oldPassword || !passData.newPassword) {
      setStatus({ error: 'All fields are required', success: '', loading: false });
      return;
    }
    if (passData.newPassword.length < 6) {
      setStatus({ error: 'New password must be at least 6 characters', success: '', loading: false });
      return;
    }

    setStatus({ error: '', success: '', loading: true });
    try {
      const res = await changePassword(passData);
      setStatus({ error: '', success: res.data.message || 'Password changed successfully', loading: false });
      setPassData({ oldPassword: '', newPassword: '' });
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err) {
      setStatus({ error: err.response?.data?.message || 'Failed to change password', success: '', loading: false });
    }
  };

  if (loading) {
    return (
      <div className="state-container full-page-state">
        <div className="spinner"></div>
        <p className="state-text">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="welcome-banner">
          <div>
            <span className="welcome-tag">Customer Portal</span>
            <h1 className="welcome-title">Welcome back, {user.fullName}!</h1>
            <p className="welcome-text">Manage your ShopKart account and discover latest products.</p>
          </div>
          <Link to="/products" className="btn btn-submit explore-btn">
            Browse Catalog →
          </Link>
        </div>

        <div className="profile-grid">
          <div className="card profile-card">
            <div className="card-header">
              <div className="avatar-circle">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="card-title">{user.fullName}</h2>
                <p className="card-subtitle">Verified Customer Account</p>
              </div>
            </div>

            <div className="profile-details-list">
              <div className="detail-item">
                <span className="detail-icon">👤</span>
                <div className="detail-info">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{user.fullName}</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">✉️</span>
                <div className="detail-info">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{user.email}</span>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">📞</span>
                <div className="detail-info">
                  <span className="detail-label">Phone Number</span>
                  <span className="detail-value">{user.phone}</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn btn-secondary"
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="card shopping-card">
            <h3 className="features-title">Quick Actions</h3>
            <p className="shopping-desc">Ready to explore our wide collection of electronics, fashion, books, and home essentials?</p>
            <div className="quick-actions-list">
              <Link to="/products" className="action-tile">
                <span className="tile-icon">🛍️</span>
                <div>
                  <strong>All Products</strong>
                  <p>View full catalog with real-time stock</p>
                </div>
              </Link>
              <Link to="/products?category=Electronics" className="action-tile">
                <span className="tile-icon">⚡</span>
                <div>
                  <strong>Electronics</strong>
                  <p>Headphones, smart watches, keyboards</p>
                </div>
              </Link>
              <Link to="/products?category=Fashion" className="action-tile">
                <span className="tile-icon">👕</span>
                <div>
                  <strong>Fashion</strong>
                  <p>Denim jackets, sneakers, and apparel</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {showPasswordModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Change Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="modal-close-btn">
                  ✕
                </button>
              </div>

              {status.error && <div className="alert alert-error"><span>⚠️</span><span>{status.error}</span></div>}
              {status.success && <div className="alert alert-success"><span>✅</span><span>{status.success}</span></div>}

              <form onSubmit={handlePasswordChange} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passData.oldPassword}
                    onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passData.newPassword}
                    onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowPasswordModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-submit" disabled={status.loading}>
                    {status.loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
