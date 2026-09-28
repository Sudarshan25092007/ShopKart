import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToWishlist, removeFromWishlist } from '../services/api';

const ProductCard = ({ product, isInitiallyWishlisted = false, onWishlistChange }) => {
  const [isSaved, setIsSaved] = useState(isInitiallyWishlisted);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIsSaved(isInitiallyWishlisted);
  }, [isInitiallyWishlisted]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage('');

    try {
      if (isSaved) {
        await removeFromWishlist(product._id);
        setIsSaved(false);
        if (onWishlistChange) onWishlistChange(product._id, false);
      } else {
        await addToWishlist(product._id);
        setIsSaved(true);
        if (onWishlistChange) onWishlistChange(product._id, true);
      }
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      if (err.response?.status === 409) {
        setIsSaved(true);
      } else {
        setErrorMessage('Unable to save product. Please try again.');
        setTimeout(() => setErrorMessage(''), 3500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <span className="product-badge">{product.category}</span>
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={loading}
          aria-label={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`card-heart-btn ${isSaved ? 'active' : ''}`}
          title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {loading ? '⏳' : isSaved ? '♥' : '♡'}
        </button>
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
        <p className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
        </p>

        {errorMessage && (
          <div className="card-error-msg">{errorMessage}</div>
        )}

        <div className="card-btn-group">
          <Link to={`/products/${product._id}`} className="btn btn-primary product-view-btn">
            View Details
          </Link>
          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={loading}
            className={`btn wishlist-action-btn ${isSaved ? 'btn-wishlisted' : 'btn-outline'}`}
          >
            {loading ? '⏳ Saving...' : isSaved ? '♥ Wishlisted' : '♡ Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
