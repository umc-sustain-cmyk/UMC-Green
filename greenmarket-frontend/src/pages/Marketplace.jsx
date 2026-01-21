import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import ItemCard from '../components/ItemCard';

function Marketplace() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: 'all',
    condition: 'all',
    search: ''
  });

  // Mock data for demonstration - Campus donations
  const mockItems = [
    {
      id: 1,
      name: "Used Textbook - Biology 101",
      description: "Excellent condition, minimal highlighting. Great for study prep.",
      price: 0.00,
      category: "books",
      condition: "good",
      image_url: null,
      in_stock: true,
      donor: {
        id: 1,
        first_name: "Sarah",
        last_name: "Johnson"
      }
    },
    {
      id: 2,
      name: "Desk Lamp",
      description: "LED desk lamp in good working condition. Perfect for studying.",
      price: 0.00,
      category: "home",
      condition: "like-new",
      image_url: null,
      in_stock: true,
      donor: {
        id: 2,
        first_name: "Mike",
        last_name: "Chen"
      }
    },
    {
      id: 3,
      name: "Winter Jacket",
      description: "Warm winter jacket, barely worn. Size Medium.",
      price: 0.00,
      category: "clothing",
      condition: "like-new",
      image_url: null,
      in_stock: true,
      donor: {
        id: 3,
        first_name: "Emma",
        last_name: "Williams"
      }
    },
    {
      id: 4,
      name: "Computer Monitor",
      description: "24-inch monitor, working perfectly. Great for online classes.",
      price: 0.00,
      category: "electronics",
      condition: "good",
      image_url: null,
      in_stock: true,
      donor: {
        id: 4,
        first_name: "John",
        last_name: "Davis"
      }
    },
    {
      id: 5,
      name: "Science Fiction Book Set",
      description: "Set of 3 classic sci-fi novels in excellent condition.",
      price: 0.00,
      category: "books",
      condition: "like-new",
      image_url: null,
      in_stock: true,
      donor: {
        id: 5,
        first_name: "Alex",
        last_name: "Robinson"
      }
    },
    {
      id: 6,
      name: "Skateboard",
      description: "Lightly used skateboard, all components working great.",
      price: 0.00,
      category: "sports",
      condition: "good",
      image_url: null,
      in_stock: true,
      donor: {
        id: 6,
        first_name: "Jordan",
        last_name: "Martinez"
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems(mockItems);
      setFilteredItems(mockItems);
      setLoading(false);
    }, 1000);
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
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
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
      {filteredItems.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-3' : 'flex-column gap-3'}>
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onReserveItem={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
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