import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import api from '../services/api';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/items/${id}`);
      if (response.data.success) {
        setItem(response.data.data.item);
      } else {
        setError('Failed to load item details');
      }
    } catch (err) {
      console.error('Error fetching item:', err);
      setError('Failed to load item details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--error-red)' }}>{error || 'Item not found'}</p>
        <button 
          onClick={() => navigate('/donations')}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary-green)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Donations
        </button>
      </div>
    );
  }

  const donor = item.donor || {};

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/donations')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          color: 'var(--primary-green)',
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={20} />
        Back to Donations
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        {/* Left: Item Details */}
        <div>
          {/* Image Placeholder */}
          <div style={{
            backgroundColor: '#f0f0f0',
            height: '300px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <span style={{ color: '#999' }}>No Image Available</span>
          </div>

          {/* Item Info */}
          <h1 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>
            {item.title}
          </h1>

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
              {item.condition || 'Good'}
            </span>
            <span className="badge" style={{
              backgroundColor: '#e8f5e9',
              color: 'var(--primary-green)',
              padding: '0.25rem 0.75rem'
            }}>
              {item.category || 'Misc'}
            </span>
          </div>

          <h3 style={{ margin: '1.5rem 0 0.5rem 0', fontSize: '1.1rem' }}>Description</h3>
          <p style={{
            color: '#666',
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            {item.description}
          </p>

          {item.location && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: '#666'
            }}>
              <MapPin size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{item.location}</span>
            </div>
          )}

          {item.createdAt && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#999',
              fontSize: '0.9rem'
            }}>
              <Clock size={16} />
              Posted {new Date(item.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Right: Donor Info & Contact */}
        <div>
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>
              Donor Information
            </h2>

            {/* Donor Card */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #ddd'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'var(--primary-green)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  {donor.firstName?.charAt(0) || 'D'}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                    {donor.firstName || 'Unknown'} {donor.lastName || 'Donor'}
                  </h3>
                  <p style={{ margin: 0, color: '#999', fontSize: '0.9rem' }}>
                    {donor.role === 'admin' ? 'Admin' : 'Community Member'}
                  </p>
                </div>
              </div>

              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid #eee'
              }}>
                <p style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  This item is being donated by a community member. Contact them to arrange pickup or delivery.
                </p>
              </div>
            </div>

            {/* Contact Methods */}
            <h3 style={{ margin: '1.5rem 0 1rem 0', fontSize: '1.1rem' }}>
              Contact Methods
            </h3>

            {donor.email && (
              <a
                href={`mailto:${donor.email}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginBottom: '0.75rem',
                  color: 'var(--primary-green)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
              >
                <Mail size={20} />
                <span>
                  Email: {donor.email}
                </span>
              </a>
            )}

            {item.contactMethod && item.contactMethod !== 'email' && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#e8f5e9',
                border: '1px solid var(--primary-green)',
                borderRadius: '6px',
                marginBottom: '0.75rem',
                color: 'var(--primary-green)'
              }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  This donor prefers to be contacted via {item.contactMethod === 'phone' ? 'phone' : 'email or phone'}
                </p>
              </div>
            )}

            {!donor.email && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fff3e0',
                borderRadius: '6px',
                color: '#f57c00',
                fontSize: '0.9rem'
              }}>
                <p style={{ margin: 0 }}>
                  No direct contact information available. Please contact the GreenMarket team at{' '}
                  <a href="mailto:greenmarket@umn.edu" style={{ color: 'inherit' }}>
                    greenmarket@umn.edu
                  </a>
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              <p style={{ margin: 0 }}>
                <strong>Tips:</strong> Be respectful and flexible with pickup/delivery times. Thank the donor for their generosity!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
