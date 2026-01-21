import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Package, ShoppingCart, Settings, Plus, BarChart3 } from 'lucide-react';
import AuthContext from '../context/AuthContext';

function Dashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Mock user stats
  const userStats = {
    itemsDonated: 5,
    itemsReceived: 8,
    sustainabilityPoints: 156,
    favoriteItems: 5,
    activityHistory: 12
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
        <>
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
          </>
        ) : null}
        
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
        {/* Recent Activity */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
          <div className="flex-column gap-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex-between" style={{
                padding: '1rem',
                background: 'var(--bg-light)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {activity.description}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                  fontWeight: 'bold',
                  color: activity.type === 'received' ? 'var(--primary-green)' : 'var(--accent-green)'
                }}>
                  {activity.type === 'received' ? '📦' : '🎁'}
                </div>
              </div>
            ))}
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