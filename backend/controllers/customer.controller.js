const bcrypt = require('bcrypt');
const Customer = require('../models/customer.model');
const generateToken = require('../utils/generateToken');

const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: 'Customer already exists with this email'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      phone
    });

    return res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(customer._id);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax'
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile'
    });
  }
};

const logoutCustomer = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax'
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, customer.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect old password'
      });
    }

    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(newPassword, salt);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getProfile,
  logoutCustomer,
  changePassword
};

