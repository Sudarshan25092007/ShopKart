import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginCustomer, getProfile } from '../services/api';

const Login = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate('/products', { replace: true });
      return;
    }
    getProfile()
      .then((res) => {
        if (setUser) setUser(res.data);
        navigate('/products', { replace: true });
      })
      .catch(() => {});
  }, [user, navigate, setUser]);



  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const successMessage = location.state?.successMessage;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await loginCustomer(formData);
      if (response.data.success) {
        const profileRes = await getProfile();
        const userData = profileRes.data;
        localStorage.setItem('shopkart_user', JSON.stringify(userData));
        if (setUser) {
          setUser(userData);
        }
        navigate('/products');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid Credentials');
      } else {
        setError(err.response?.data?.message || 'Invalid Credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">🔐</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in with your ShopKart credentials</p>
        </div>

        {successMessage && (
          <div className="alert alert-success" id="login-success-msg">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error" id="login-error-msg">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="e.g. john@gmail.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-submit"
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="auth-link" id="link-to-register">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
