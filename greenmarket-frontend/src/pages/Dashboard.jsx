import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Package, ShoppingCart, Settings, Plus, BarChart3, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { itemAPI } from '../services/api';
import ItemCard from '../components/ItemCard';

function Dashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Fetch user's items
  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        setLoading(true);
        const response = await itemAPI.getItemsByUser(user?.id);
        if (response.success) {
          setUserItems(response.data.items);
        }
      } catch (err) {
        console.error('Error fetching user items:', err);
        setError('Failed to load your donations');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserItems();
    }
  }, [user?.id]);

  // Calculate stats from actual items
  const userStats = {
    itemsDonated: userItems.length,
    itemsReceived: 0,
    sustainabilityPoints: userItems.length * 10,
    favoriteItems: 0,
    activityHistory: userItems.length
  };

  const recentActivity = [
    {
      id: 1,
      type: 'received',
      description: 'Received Textbook - Biology 101',
      date: '2025-10-06'
    },
    {
      id: 2,
      type: 'donated',
      description: 'Donated Desk Chair',
      date: '2025-10-05'
    },
    {
      id: 3,
      type: 'received',
      description: 'Received College Backpack',
      date: '2025-10-04'
    }
  ];

  return (
    <div className="container section">
      {/* Welcome Header */}
      <div className="flex-between mb-4">
        <div>
          <h1>Welcome back, {user?.firstName}! 👋</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
            Manage your donations and continue building our community
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/add-item" className="btn btn-primary">
            <Plus size={18} />
            Donate Item
          </a>
          <button className="btn btn-secondary">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4 mb-4">
        <div className="card text-center">
          <Package size={32} color="var(--primary-green)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0' }}>{userStats.itemsDonated}</h3>
          <p style={{ color: 'var(--text-light)', margin: 0 }}>Items Donated</p>
        </div>
        <div className="card text-center">
          <BarChart3 size={32} color="var(--accent-green)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0' }}>{userStats.itemsReceived}</h3>
          <p style={{ color: 'var(--text-light)', margin: 0 }}>Items Received</p>
        </div>
        
        <div className="card text-center">
          <ShoppingCart size={32} color="var(--primary-green)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0' }}>{userStats.activityHistory}</h3>
          <p style={{ color: 'var(--text-light)', margin: 0 }}>Community Actions</p>
        </div>
        
        <div className="card text-center">
          <div style={{
            width: '32px',
            height: '32px',
            margin: '0 auto 1rem',
            fontSize: '32px'
          }}>
            🌱
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>{userStats.sustainabilityPoints}</h3>
          <p style={{ color: 'var(--text-light)', margin: 0 }}>Eco Points</p>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Your Donations */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Your Donations 🎁</h3>
          {loading ? (
            <p style={{ color: 'var(--text-light)' }}>Loading your donations...</p>
          ) : error ? (
            <div style={{ 
              padding: '1rem', 
              background: '#fee', 
              border: '1px solid #fcc', 
              borderRadius: '8px',
              color: '#c33',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          ) : userItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                You haven't donated any items yet
              </p>
              <a href="/add-item" className="btn btn-primary">
                <Plus size={18} />
                Donate Your First Item
              </a>
            </div>
          ) : (
            <div>
              <div className="flex-column gap-2">
                {userItems.slice(0, 3).map(item => (
                  <div key={item.id} style={{
                    padding: '1rem',
                    background: 'var(--bg-light)',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--primary-green)'
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      {item.condition} • {item.category}
                    </div>
                    <div style={{ 
                      display: 'inline-block',
                      marginTop: '0.5rem',
                      fontSize: '0.85rem',
                      padding: '0.25rem 0.75rem',
                      background: item.isAvailable ? '#e8f5e9' : '#ffebee',
                      color: item.isAvailable ? '#2e7d32' : '#c62828',
                      borderRadius: '20px'
                    }}>
                      {item.isAvailable ? '✓ Available' : '✗ Taken'}
                    </div>
                  </div>
                ))}
              </div>
              {userItems.length > 3 && (
                <button className="btn btn-secondary mt-3" style={{ width: '100%' }}>
                  View All {userItems.length} Donations
                </button>
              )}
            </div>
          )}
        </div>
          <button className="btn btn-secondary mt-3" style={{ width: '100%' }}>
            View All Activity
          </button>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
          <div className="flex-column gap-2">
            <a href="/marketplace" className="btn btn-secondary" style={{ width: '100%' }}>
              <ShoppingCart size={18} />
              Browse Donations
            </a>
            
            <a href="/add-item" className="btn btn-primary" style={{ width: '100%' }}>
              <Plus size={18} />
              Donate New Item
            </a>
            
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              <User size={18} />
              Edit Profile
            </button>
            
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              <BarChart3 size={18} />
              View Impact
            </button>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="card mt-4">
        <h3 style={{ marginBottom: '1.5rem' }}>Account Information</h3>
        <div className="grid grid-3">
          <div>
            <label className="form-label">Name</label>
            <p style={{ margin: 0, fontWeight: '500' }}>
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div>
            <label className="form-label">Email</label>
            <p style={{ margin: 0, fontWeight: '500' }}>
              {user?.email}
            </p>
          </div>
          <div>
            <label className="form-label">Member Since</label>
            <div className="badge badge-info">
              Community Member
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Impact */}
      <div className="card mt-4" style={{
        background: 'linear-gradient(135deg, var(--light-green), var(--accent-green))',
        color: 'white'
      }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Your Community Impact 🌍</h3>
        <div className="grid grid-3">
          <div className="text-center">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>5</div>
            <p style={{ margin: 0, opacity: 0.9 }}>Items Donated</p>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>8</div>
            <p style={{ margin: 0, opacity: 0.9 }}>Items Received</p>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>13</div>
            <p style={{ margin: 0, opacity: 0.9 }}>Waste Reduction Wins</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;