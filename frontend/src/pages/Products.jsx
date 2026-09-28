import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { getProducts, getWishlist } from '../services/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'All Categories';
  const sortParam = searchParams.get('sort') || '';

  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const syncWishlist = async () => {
    try {
      const res = await getWishlist();
      const ids = new Set((res.data.wishlist || []).map((p) => p._id));
      setWishlistIds(ids);
    } catch {
      // Unauthenticated or network error
    }
  };

  useEffect(() => {
    syncWishlist();
    const handleUpdate = () => syncWishlist();
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParam) {
        const next = new URLSearchParams(searchParams);
        if (searchInput.trim()) {
          next.set('search', searchInput.trim());
        } else {
          next.delete('search');
        }
        setSearchParams(next);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, searchParam, searchParams, setSearchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (searchParam) params.search = searchParam;
        if (categoryParam && categoryParam !== 'All Categories') {
          params.category = categoryParam;
        }
        if (sortParam) params.sort = sortParam;

        const res = await getProducts(params);
        setProducts(res.data.products || []);
      } catch {
        setError('Something went wrong while loading products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParam, categoryParam, sortParam]);

  const handleCategoryChange = (newCat) => {
    const next = new URLSearchParams(searchParams);
    if (newCat && newCat !== 'All Categories') {
      next.set('category', newCat);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  const handleSortChange = (newSort) => {
    const next = new URLSearchParams(searchParams);
    if (newSort) {
      next.set('sort', newSort);
    } else {
      next.delete('sort');
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1 className="products-title">Explore Catalog</h1>
          <p className="products-subtitle">Browse through our curated collection of products</p>
        </div>

        <SearchBar
          search={searchInput}
          setSearch={setSearchInput}
          category={categoryParam}
          setCategory={handleCategoryChange}
          sort={sortParam}
          setSort={handleSortChange}
        />

        {loading && (
          <div className="state-container">
            <div className="spinner"></div>
            <p className="state-text">Loading products...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-container error-state">
            <span className="state-icon">⚠️</span>
            <p className="state-text">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="state-container empty-state">
            <span className="state-icon">📦</span>
            <p className="state-text">No products found.</p>
            <button className="btn btn-outline reset-btn" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isInitiallyWishlisted={wishlistIds.has(product._id)}
                onWishlistChange={(id, saved) => {
                  setWishlistIds((prev) => {
                    const next = new Set(prev);
                    if (saved) next.add(id);
                    else next.delete(id);
                    return next;
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
