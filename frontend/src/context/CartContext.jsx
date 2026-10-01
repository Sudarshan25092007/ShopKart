import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartQuantity as apiUpdateQuantity, removeFromCart as apiRemoveFromCart } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ user, children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itemLoadingMap, setItemLoadingMap] = useState({});

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await getCart();
      setCart(res.data.cart || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your cart.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const setItemLoading = (productId, isLoading) => {
    setItemLoadingMap((prev) => ({
      ...prev,
      [productId]: isLoading
    }));
  };

  const addToCart = async (productId) => {
    setItemLoading(productId, true);
    try {
      const res = await apiAddToCart(productId);
      setCart(res.data.cart || []);
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add product to cart';
      return { success: false, message: msg };
    } finally {
      setItemLoading(productId, false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setItemLoading(productId, true);
    try {
      const res = await apiUpdateQuantity(productId, quantity);
      setCart(res.data.cart || []);
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update quantity';
      return { success: false, message: msg };
    } finally {
      setItemLoading(productId, false);
    }
  };

  const removeFromCart = async (productId) => {
    setItemLoading(productId, true);
    try {
      const res = await apiRemoveFromCart(productId);
      setCart(res.data.cart || []);
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove product from cart';
      return { success: false, message: msg };
    } finally {
      setItemLoading(productId, false);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * (item.quantity || 0);
    }, 0);
  }, [cart]);

  const value = {
    cart,
    loading,
    error,
    itemLoadingMap,
    totalItems,
    subtotal,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
