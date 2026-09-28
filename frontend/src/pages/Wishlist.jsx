import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import WishlistCard from '../components/WishlistCard';
import { getWishlist, removeFromWishlist } from '../services/api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError('');
    setActionError('');
    try {
      const res = await getWishlist();
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      setError(err.response?.data?.message || "We couldn't load your wishlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId) => {
    setActionError('');
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to remove product from wishlist.');
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="state-container full-page-state">
          <div className="spinner"></div>
          <p className="state-text">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="state-container full-page-state error-state">
          <span className="state-icon">⚠️</span>
          <h2 className="state-title">Something went wrong.</h2>
          <p className="state-text">{error}</p>
          <button className="btn btn-primary retry-btn" onClick={fetchWishlist}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="state-container full-page-state empty-state">
          <span className="empty-heart-icon">❤️</span>
          <h2 className="empty-title">Your wishlist is empty</h2>
          <p className="empty-subtitle">
            Save products you love and find them here later.
          </p>
          <Link to="/products" className="btn btn-primary browse-btn">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <div>
            <h1 className="wishlist-title">My Wishlist</h1>
            <p className="wishlist-subtitle">
              {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved
            </p>
          </div>
          <Link to="/products" className="btn btn-outline continue-shopping-btn">
            ← Continue Shopping
          </Link>
        </div>

        {actionError && (
          <div className="action-error-banner">
            <span>⚠️ {actionError}</span>
            <button onClick={() => setActionError('')} className="close-banner-btn">×</button>
          </div>
        )}

        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <WishlistCard
              key={product._id}
              product={product}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
