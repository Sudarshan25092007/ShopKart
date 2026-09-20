import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
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
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
        <p className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}
        </p>
        <Link to={`/products/${product._id}`} className="btn btn-primary product-view-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
