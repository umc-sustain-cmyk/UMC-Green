import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, User, ShoppingCart, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav style={{
      background: 'var(--bg-white)',
      boxShadow: '0 2px 10px var(--shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container">
        <div className="flex-between" style={{ padding: '1rem 0' }}>
          {/* Logo */}
          <Link to="/" className="flex gap-2" style={{ textDecoration: 'none' }}>
            <Leaf size={32} color="var(--primary-green)" />
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--primary-green)'
            }}>
              GreenMarket
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex gap-3" style={{ display: window.innerWidth < 768 ? 'none' : 'flex' }}>
            <Link to="/" className="btn btn-secondary">Home</Link>
            <Link to="/marketplace" className="btn btn-secondary">Marketplace</Link>
            <Link to="/about" className="btn btn-secondary">About</Link>
            <Link to="/contact" className="btn btn-secondary">Contact</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-secondary">
                  <User size={18} />
                  Dashboard
                </Link>
                <Link to="/add-item" className="btn btn-primary">
                  <Plus size={18} />
                  Sell Item
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="btn btn-secondary"
            style={{ display: window.innerWidth >= 768 ? 'none' : 'flex' }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div style={{
            background: 'var(--bg-white)',
            padding: '1rem 0',
            borderTop: '1px solid var(--border-light)'
          }}>
            <div className="flex-column gap-2">
              <Link to="/" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/marketplace" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                Marketplace
              </Link>
              <Link to="/about" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    <User size={18} />
                    Dashboard
                  </Link>
                  <Link to="/add-item" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                    <Plus size={18} />
                    Sell Item
                  </Link>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;