import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, loading, error, totalItems, subtotal, fetchCart } = useCart();
  const [checkoutModal, setCheckoutModal] = useState(false);

  if (loading) {
    return (
      <div className="cart-page">
        <div className="state-container full-page-state">
          <div className="spinner"></div>
          <p className="state-text">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="state-container full-page-state error-state">
          <span className="state-icon">⚠️</span>
          <h2 className="state-title">Unable to load your cart.</h2>
          <p className="state-text">{error}</p>
          <button className="btn btn-primary retry-btn" onClick={fetchCart}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="state-container full-page-state empty-state">
          <span className="empty-cart-icon">🛒</span>
          <h2 className="empty-title">Your cart is empty</h2>
          <p className="empty-subtitle">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary browse-btn">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <div>
            <h1 className="cart-title">My Cart</h1>
            <p className="cart-subtitle">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link to="/products" className="btn btn-outline continue-shopping-btn">
            ← Continue Shopping
          </Link>
        </div>

        <div className="cart-layout-grid">
          <div className="cart-items-column">
            {cart.map((item) => (
              <CartItem key={item.product?._id || item._id} item={item} />
            ))}
          </div>

          <aside className="order-summary-sidebar">
            <div className="order-summary-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-rows">
                <div className="summary-row">
                  <span className="summary-label">Total Items</span>
                  <span className="summary-value">{totalItems}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Estimated Delivery</span>
                  <span className="summary-value free-delivery">Free</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span className="total-label">Total Amount</span>
                  <span className="total-value">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-submit checkout-btn"
                onClick={() => setCheckoutModal(true)}
              >
                Proceed to Checkout
              </button>

              <div className="secure-checkout-badge">
                <span>🔒 Secure 256-bit Encrypted Checkout</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {checkoutModal && (
        <div className="modal-overlay" onClick={() => setCheckoutModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Ready for Checkout</h3>
              <button className="modal-close-btn" onClick={() => setCheckoutModal(false)}>
                ×
              </button>
            </div>
            <p className="modal-desc" style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
              Your order with <strong>{totalItems} items</strong> totaling{' '}
              <strong>₹{subtotal.toLocaleString('en-IN')}</strong> is prepared! Checkout and payment integration will be activated in the next step.
            </p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setCheckoutModal(false)}>
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
