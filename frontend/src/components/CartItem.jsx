import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { product, quantity } = item;
  const { updateQuantity, removeFromCart, itemLoadingMap } = useCart();
  const [errorMsg, setErrorMsg] = useState('');

  if (!product) return null;

  const isItemLoading = !!itemLoadingMap[product._id];
  const maxStock = product.stock || 0;
  const itemTotal = (product.price || 0) * quantity;

  const handleDecrease = async () => {
    if (quantity <= 1 || isItemLoading) return;
    setErrorMsg('');
    const res = await updateQuantity(product._id, quantity - 1);
    if (!res.success) {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleIncrease = async () => {
    if (quantity >= maxStock || isItemLoading) return;
    setErrorMsg('');
    const res = await updateQuantity(product._id, quantity + 1);
    if (!res.success) {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleRemove = async () => {
    if (isItemLoading) return;
    setErrorMsg('');
    const res = await removeFromCart(product._id);
    if (!res.success) {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  return (
    <div className={`cart-item ${isItemLoading ? 'cart-item-loading' : ''}`}>
      <Link to={`/products/${product._id}`} className="cart-item-image-link">
        <img
          src={product.image}
          alt={product.name}
          className="cart-item-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
          }}
        />
      </Link>

      <div className="cart-item-details">
        <div className="cart-item-header">
          <Link to={`/products/${product._id}`} className="cart-item-name">
            {product.name}
          </Link>
          <span className="cart-item-category">{product.category}</span>
        </div>

        <p className="cart-item-unit-price">
          ₹{product.price?.toLocaleString('en-IN')}{' '}
          <span className="unit-label">each</span>
        </p>

        <div className="cart-item-controls-row">
          <div className="quantity-control-group">
            <button
              type="button"
              className="qty-btn qty-decrease"
              onClick={handleDecrease}
              disabled={quantity <= 1 || isItemLoading}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              type="button"
              className="qty-btn qty-increase"
              onClick={handleIncrease}
              disabled={quantity >= maxStock || isItemLoading}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="cart-remove-btn"
            onClick={handleRemove}
            disabled={isItemLoading}
          >
            {isItemLoading ? 'Updating...' : 'Remove'}
          </button>

          <div className="cart-item-subtotal">
            ₹{itemTotal.toLocaleString('en-IN')}
          </div>
        </div>

        {quantity >= maxStock && (
          <p className="stock-limit-warning">Maximum stock limit reached ({maxStock})</p>
        )}

        {errorMsg && <p className="cart-item-error">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default CartItem;
