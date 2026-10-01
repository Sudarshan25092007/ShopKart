const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const cart = customer.cart || [];
    const existingIndex = cart.findIndex((item) => item.product.toString() === productId);

    if (existingIndex === -1) {
      if (product.stock < 1) {
        return res.status(400).json({
          success: false,
          message: 'Product is out of stock'
        });
      }
      customer.cart.push({ product: productId, quantity: 1 });
    } else {
      const newQty = cart[existingIndex].quantity + 1;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot exceed available stock of ${product.stock} units`
        });
      }
      cart[existingIndex].quantity = newQty;
    }

    await customer.save();
    await customer.populate({
      path: 'cart.product',
      select: 'name description price category image stock'
    });

    const validCart = (customer.cart || []).filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart: validCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error adding product to cart'
    });
  }
};

const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: 'name description price category image stock'
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const validCart = (customer.cart || []).filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      cart: validCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving cart'
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const qty = Number(quantity);
    if (typeof quantity === 'undefined' || isNaN(qty) || !Number.isInteger(qty)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a valid integer'
      });
    }

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const cart = customer.cart || [];
    const existingIndex = cart.findIndex((item) => item.product.toString() === productId);

    if (existingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not in cart'
      });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${qty}) exceeds available stock (${product.stock})`
      });
    }

    customer.cart[existingIndex].quantity = qty;
    await customer.save();
    await customer.populate({
      path: 'cart.product',
      select: 'name description price category image stock'
    });

    const validCart = (customer.cart || []).filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: validCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating cart quantity'
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const cart = customer.cart || [];
    const existingIndex = cart.findIndex((item) => item.product.toString() === productId);

    if (existingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not in cart'
      });
    }

    customer.cart.splice(existingIndex, 1);
    await customer.save();
    await customer.populate({
      path: 'cart.product',
      select: 'name description price category image stock'
    });

    const validCart = (customer.cart || []).filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart: validCart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error removing product from cart'
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart
};
