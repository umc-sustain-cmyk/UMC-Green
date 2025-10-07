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
    priceRange: 'all',
    organic: false,
    search: ''
  });

  // Mock data for demonstration
  const mockItems = [
    {
      id: 1,
      name: "Organic Tomatoes",
      description: "Fresh, locally grown organic tomatoes perfect for salads and cooking",
      price: 4.99,
      category: "produce",
      image_url: null,
      in_stock: true,
      quantity: 50,
      unit: "lb",
      is_organic: true,
      seller: {
        id: 1,
        first_name: "John",
        last_name: "Farmer"
      }
    },
    {
      id: 2,
      name: "Whole Grain Bread",
      description: "Artisan whole grain bread made with organic flour and natural ingredients",
      price: 6.50,
      category: "grains",
      image_url: null,
      in_stock: true,
      quantity: 20,
      unit: "loaf",
      is_organic: true,
      seller: {
        id: 2,
        first_name: "Sarah",
        last_name: "Baker"
      }
    },
    {
      id: 3,
      name: "Free-Range Eggs",
      description: "Fresh eggs from free-range chickens, perfect for breakfast or baking",
      price: 8.99,
      category: "dairy",
      image_url: null,
      in_stock: true,
      quantity: 30,
      unit: "dozen",
      is_organic: false,
      seller: {
        id: 3,
        first_name: "Mike",
        last_name: "Poultry"
      }
    },
    {
      id: 4,
      name: "Organic Spinach",
      description: "Baby organic spinach leaves, perfect for salads and smoothies",
      price: 3.99,
      category: "produce",
      image_url: null,
      in_stock: true,
      quantity: 25,
      unit: "bunch",
      is_organic: true,
      seller: {
        id: 1,
        first_name: "John",
        last_name: "Farmer"
      }
    },
    {
      id: 5,
      name: "Cold-Pressed Juice",
      description: "Fresh cold-pressed green juice made with organic vegetables",
      price: 7.99,
      category: "beverages",
      image_url: null,
      in_stock: false,
      quantity: 0,
      unit: "bottle",
      is_organic: true,
      seller: {
        id: 4,
        first_name: "Emma",
        last_name: "Juice Co"
      }
    },
    {
      id: 6,
      name: "Grass-Fed Beef",
      description: "Premium grass-fed beef from local farms, antibiotic-free",
      price: 15.99,
      category: "meat",
      image_url: null,
      in_stock: true,
      quantity: 10,
      unit: "lb",
      is_organic: false,
      seller: {
        id: 5,
        first_name: "Robert",
        last_name: "Ranch"
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

    // Organic filter
    if (filters.organic) {
      filtered = filtered.filter(item => item.is_organic);
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under5':
          filtered = filtered.filter(item => item.price < 5);
          break;
        case '5to10':
          filtered = filtered.filter(item => item.price >= 5 && item.price <= 10);
          break;
        case 'over10':
          filtered = filtered.filter(item => item.price > 10);
          break;
      }
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
    console.log('Adding to cart:', item);
    // TODO: Implement cart functionality
    alert(`${item.name} added to cart!`);
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
        <h1>Sustainable Marketplace</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Discover eco-friendly products from local sellers
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="grid grid-2" style={{ alignItems: 'end' }}>
          {/* Search */}
          <div>
            <label className="form-label">Search Products</label>
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
                placeholder="Search for products..."
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
              <option value="produce">Produce</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="grains">Grains</option>
              <option value="beverages">Beverages</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="form-label">Price Range</label>
            <select
              className="form-select"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="under5">Under $5</option>
              <option value="5to10">$5 - $10</option>
              <option value="over10">Over $10</option>
            </select>
          </div>

          {/* Organic Filter */}
          <div>
            <label className="form-label">Organic Only</label>
            <div className="flex gap-2" style={{ alignItems: 'center', paddingTop: '0.75rem' }}>
              <input
                type="checkbox"
                checked={filters.organic}
                onChange={(e) => handleFilterChange('organic', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <span>Organic Products</span>
            </div>
          </div>

          {/* Results Count */}
          <div>
            <label className="form-label">Results</label>
            <div style={{ paddingTop: '0.75rem', color: 'var(--text-light)' }}>
              {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredItems.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-3' : 'flex-column gap-3'}>
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-4">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No products found</h3>
          <p style={{ color: 'var(--text-light)' }}>
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}

export default Marketplace;