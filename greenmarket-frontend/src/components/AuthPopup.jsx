import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function AuthPopup({ isOpen, onClose }) {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  }); 

  // Don't show popup if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate UMN Crookston email domain
    const umnEmailRegex = /^[a-zA-Z0-9._%+-]+@crk\.umn\.edu$/;
    if (!umnEmailRegex.test(loginData.email)) {
      setError('Please use your UMN Crookston email (@crk.umn.edu)');
      setLoading(false);
      return;
    }

    try {
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        onClose();
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!registerData.firstName.trim() || !registerData.lastName.trim()) {
        setError('First and last name are required');
        setLoading(false);
        return;
      }
      if (!registerData.email.trim() || !registerData.password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }
      
      // Validate UMN Crookston email domain
      const umnEmailRegex = /^[a-zA-Z0-9._%+-]+@crk\.umn\.edu$/;
      if (!umnEmailRegex.test(registerData.email)) {
        setError('Please use your UMN Crookston email (@crk.umn.edu)');
        setLoading(false);
        return;
      }
      
      if (registerData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const result = await register(registerData);
      
      if (result.success) {
        onClose();
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setLoginData({ email: '', password: '' });
    setRegisterData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1001 }}>
      <div className="modal" style={{ maxWidth: '450px' }}>
        {/* Header */}
        <div className="flex-between mb-3">
          <h2 style={{ margin: 0 }}>
            {isLoginMode ? 'Welcome Back!' : 'Join GreenMarket'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} color="var(--text-light)" />
          </button>
        </div>

        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
          {isLoginMode 
            ? 'Sign in with your UMN Crookston email to access the donation board' 
            : 'Create your account using your UMN Crookston email address'
          }
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Login Form */}
        {isLoginMode ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail 
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
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="your.name@crk.umn.edu"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  style={{ paddingLeft: '40px' }}
                  title="Please use your UMN Crookston email (@crk.umn.edu)"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock 
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
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-light)'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit}>
            <div className="grid grid-2 gap-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div style={{ position: 'relative' }}>
                  <User 
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
                    name="firstName"
                    className="form-input"
                    placeholder="First name"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-input"
                  placeholder="Last name"
                  value={registerData.lastName}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail 
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
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="your.name@crk.umn.edu"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  style={{ paddingLeft: '40px' }}
                  title="Please use your UMN Crookston email (@crk.umn.edu)"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select
                name="role"
                className="form-select"
                value={registerData.role}
                onChange={handleRegisterChange}
              >
                <option value="user">Student/Faculty - Donate or receive items</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock 
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
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Create a password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-light)'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                Password must be at least 6 characters long
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Switch Mode */}
        <div style={{ 
          textAlign: 'center', 
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-light)'
        }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            onClick={switchMode}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            {isLoginMode ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        {/* Demo Credentials (only show in login mode) */}
        {isLoginMode && (
          <div style={{ 
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--bg-light)',
            borderRadius: '8px',
            border: '1px solid var(--border-light)'
          }}>
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-light)', 
              margin: '0 0 0.5rem 0',
              fontWeight: 'bold'
            }}>
              Demo Credentials:
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>
              Email: demo@crk.umn.edu<br />
              Password: demo123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPopup;