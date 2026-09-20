import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getProductById(id);
        setProduct(res.data.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="state-container full-page-state">
        <div className="spinner"></div>
        <p className="state-text">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="state-container full-page-state error-state">
        <span className="state-icon">⚠️</span>
        <p className="state-text">{error || 'Product not found.'}</p>
        <Link to="/products" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <Link to="/products" className="back-link">
          ← Back to Catalog
        </Link>

        <div className="details-card">
          <div className="details-image-side">
            <img
              src={product.image}
              alt={product.name}
              className="details-large-image"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <div className="details-info-side">
            <span className="details-category-pill">{product.category}</span>
            <h1 className="details-title">{product.name}</h1>
            <p className="details-price">₹{product.price.toLocaleString('en-IN')}</p>

            <div className="details-divider"></div>

            <div className="details-section">
              <h3 className="section-label">Description</h3>
              <p className="details-description">{product.description}</p>
            </div>

            <div className="details-meta">
              <span className="meta-label">Availability:</span>
              <span className={`meta-value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="details-actions">
              <button
                className={`btn btn-submit add-cart-btn ${added ? 'btn-success' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? '✓ Added to Cart' : product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
