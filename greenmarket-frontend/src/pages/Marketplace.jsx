import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, AlertCircle } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { itemAPI } from '../services/api';

function Marketplace() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: 'all',
    condition: 'all',
    search: ''
  });

  // Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await itemAPI.getItems({
          limit: 50,
          page: 1
        });
        if (response.success) {
          setItems(response.data.items);
          setFilteredItems(response.data.items);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load donations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [filters, items]);

  const filterItems = () => {
    let filtered = items;

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Condition filter
    if (filters.condition !== 'all') {
      filtered = filtered.filter(item => item.condition === filters.condition);
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddToCart = (item) => {
    console.log('Item reserved:', item);
    // TODO: Implement reservation functionality
    alert(`${item.name} has been reserved! Contact the donor to arrange pickup.`);
  };

  const handleToggleFavorite = (itemId) => {
    console.log('Toggling favorite:', itemId);
    // TODO: Implement favorites functionality
  };

  if (loading) {
    return (
      <div className="container section">
        <div className="flex-center">
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      {/* Header */}
      <div className="text-center mb-4">
        <h1>Donation Board</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Browse items donated by students and faculty
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="grid grid-2" style={{ alignItems: 'end' }}>
          {/* Search */}
          <div>
            <label className="form-label">Search Items</label>
            <div style={{ position: 'relative' }}>
              <Search 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search for items..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-4 mt-3">
          {/* Category Filter */}
          <div>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="books">Books & Textbooks</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing & Shoes</option>
              <option value="furniture">Furniture</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="home">Home & Kitchen</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="form-label">Condition</label>
            <select
              className="form-select"
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
            >
              <option value="all">All Conditions</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          {/* Donor Name Filter */}
          <div>
            <label className="form-label">Sort By</label>
            <select
              className="form-select"
              value={filters.sortBy || 'newest'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Item Name (A-Z)</option>
            </select>
          </div>

          {/* Results Count */}
          <div>
            <label className="form-label">Results</label>
            <div style={{ paddingTop: '0.75rem', color: 'var(--text-light)' }}>
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center p-4">
          <p>Loading donations...</p>
        </div>
      ) : error ? (
        <div style={{
          padding: '2rem',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <AlertCircle size={24} style={{ color: '#c33', flexShrink: 0 }} />
          <div style={{ color: '#c33' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Failed to Load Donations</h4>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-3' : 'flex-column gap-3'}>
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-4">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No items found</h3>
          <p style={{ color: 'var(--text-light)' }}>
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}

export default Marketplace;