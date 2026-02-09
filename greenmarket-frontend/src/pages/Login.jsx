import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { authAPI } from '../services/api';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate UMN email domain (@umn.edu or @crk.umn.edu)
    const umnEmailRegex = /^[a-zA-Z0-9._%+-]+@(crk\.)?umn\.edu$/;
    if (!umnEmailRegex.test(formData.email)) {
      setError('Please use your UMN email (@umn.edu or @crk.umn.edu)');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(formData);
      
      if (response.success) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section">
      <div className="flex-center">
        <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="text-center mb-4">
            <h2>Welcome Back</h2>
            <p style={{ color: 'var(--text-light)' }}>
              Sign in to your GreenMarket account
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                  value={formData.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
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
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="flex-between mb-3">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                  Remember me
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                style={{ 
                  color: 'var(--primary-green)', 
                  textDecoration: 'none',
                  fontSize: '0.9rem'
                }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
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

          <div style={{ 
            textAlign: 'center', 
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-light)'
          }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
              Don't have an account?
            </p>
            <Link to="/register" className="btn btn-secondary" style={{ width: '100%' }}>
              Create Account
            </Link>
          </div>

          {/* Demo Credentials */}
          <div style={{ 
            marginTop: '1.5rem',
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
              Email: demo@greenmarket.com<br />
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;