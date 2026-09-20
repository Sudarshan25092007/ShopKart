import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import { getProfile } from './services/api';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicOnlyRoute = ({ user, children }) => {
  if (user) {
    return <Navigate to="/products" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shopkart_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    getProfile()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('shopkart_user', JSON.stringify(res.data));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('shopkart_user');
      });
  }, []);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar user={user} setUser={setUser} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to={user ? "/products" : "/login"} replace />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute user={user}>
                  <Login setUser={setUser} />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute user={user}>
                  <Register />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute user={user}>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute user={user}>
                  <ProductDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute user={user}>
                  <Home user={user} setUser={setUser} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={user ? "/products" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
