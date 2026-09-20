import React from 'react';

const categoryList = [
  { name: 'All Categories', icon: '🛒' },
  { name: 'Electronics', icon: '⚡' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Books', icon: '📚' },
  { name: 'Home', icon: '🏠' }
];

const SearchBar = ({ search, setSearch, category, setCategory, sort, setSort }) => {
  return (
    <div className="search-filter-section">
      <div className="search-filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear-btn" onClick={() => setSearch('')}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="category-pills">
        {categoryList.map((cat) => (
          <button
            key={cat.name}
            type="button"
            className={`category-pill ${category === cat.name ? 'active-pill' : ''}`}
            onClick={() => setCategory(cat.name)}
          >
            <span className="pill-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
