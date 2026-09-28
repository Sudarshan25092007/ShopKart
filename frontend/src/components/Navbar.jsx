import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutCustomer, getWishlist } from '../services/api';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setWishlistCount(0);
      return;
    }

    const fetchCount = () => {
      getWishlist()
        .then((res) => {
          setWishlistCount(res.data.count || 0);
        })
        .catch(() => {});
    };

    fetchCount();
    window.addEventListener('wishlist-updated', fetchCount);
    return () => window.removeEventListener('wishlist-updated', fetchCount);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutCustomer();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.clear();
      if (setUser) setUser(null);
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={user ? "/products" : "/login"} className="nav-brand">
          <span className="brand-icon">🛍️</span>
          <span className="brand-name">ShopKart</span>
        </Link>
        <div className="nav-actions">
          {user ? (
            <div className="nav-user-group">
              <Link to="/products" className="nav-link" id="nav-products-link">
                Products
              </Link>
              <Link to="/wishlist" className="nav-link nav-wishlist-link" id="nav-wishlist-link">
                Wishlist {wishlistCount > 0 && <span className="wishlist-count-badge">({wishlistCount})</span>}
              </Link>
              <Link to="/home" className="nav-link" id="nav-profile-link">
                Profile
              </Link>
              <button onClick={handleLogout} className="btn-logout" id="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-links">
              <Link to="/login" className="nav-link" id="nav-login-link">Login</Link>
              <Link to="/register" className="nav-btn-register" id="nav-register-link">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
