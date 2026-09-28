const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

const addToWishlist = async (req, res) => {
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

    const wishlist = customer.wishlist || [];
    const isAlreadyWishlisted = wishlist.some((id) => id.toString() === productId);

    if (isAlreadyWishlisted) {
      return res.status(409).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    customer.wishlist.push(productId);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error adding product to wishlist'
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name description price category image stock'
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const validWishlist = (customer.wishlist || []).filter((item) => item !== null);

    return res.status(200).json({
      success: true,
      count: validWishlist.length,
      wishlist: validWishlist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving wishlist'
    });
  }
};

const removeFromWishlist = async (req, res) => {
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

    const wishlist = customer.wishlist || [];
    const index = wishlist.findIndex((id) => id.toString() === productId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }

    customer.wishlist.splice(index, 1);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error removing product from wishlist'
    });
  }
};

const toggleWishlist = async (req, res) => {
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

    const wishlist = customer.wishlist || [];
    const index = wishlist.findIndex((id) => id.toString() === productId);

    if (index !== -1) {
      customer.wishlist.splice(index, 1);
      await customer.save();
      return res.status(200).json({
        success: true,
        saved: false,
        message: 'Product removed from wishlist'
      });
    } else {
      customer.wishlist.push(productId);
      await customer.save();
      return res.status(200).json({
        success: true,
        saved: true,
        message: 'Product added to wishlist'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error toggling wishlist'
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist
};
