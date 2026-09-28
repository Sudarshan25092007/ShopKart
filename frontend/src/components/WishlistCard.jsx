import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const WishlistCard = ({ product, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await onRemove(product._id);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="wishlist-card">
      <div className="wishlist-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="wishlist-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <span className="product-badge">{product.category}</span>
      </div>

      <div className="wishlist-content">
        <h3 className="wishlist-name">{product.name}</h3>
        <p className="wishlist-price">₹{product.price.toLocaleString('en-IN')}</p>
        <p className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
        </p>

        <div className="wishlist-actions">
          <Link
            to={`/products/${product._id}`}
            className="btn btn-outline wishlist-view-btn"
          >
            View Details
          </Link>
          <button
            onClick={handleRemove}
            disabled={removing}
            className="btn btn-danger-outline wishlist-remove-btn"
          >
            {removing ? '⏳ Removing...' : 'Remove ♥'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
