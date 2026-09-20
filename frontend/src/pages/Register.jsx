import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCustomer, getProfile } from '../services/api';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then(() => navigate('/products', { replace: true }))
      .catch(() => {});
  }, [navigate]);


  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });


  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const response = await registerCustomer(formData);
      if (response.data.success) {
        navigate('/login', {
          state: { successMessage: 'Registration successful! Please login to your account.' }
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">✨</div>
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join ShopKart and start exploring great deals</p>
        </div>

        {serverError && (
          <div className="alert alert-error" id="register-error">
            <span>⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="e.g. john@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-input ${errors.phone ? 'input-error' : ''}`}
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-submit"
            id="register-submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link" id="link-to-login">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
