import React, { useState, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Package, Upload, DollarSign, Tag, Scale } from 'lucide-react';
import AuthContext from '../context/AuthContext';

function AddItem() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '0.00',
    category: 'books',
    quantity: 1,
    unit: 'each',
    image: null
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Product description is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      setError('Please enter a valid quantity');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful product creation
      console.log('Product created:', formData);
      
      setSuccess('Product added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'produce',
        quantity: 1,
        unit: 'piece',
        isOrganic: false,
        image: null
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section">
      <div className="flex-center">
        <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="text-center mb-4">
            <Package size={48} color="var(--primary-green)" />
            <h2>Donate an Item</h2>
            <p style={{ color: 'var(--text-light)' }}>
              Share an item with the GreenMarket community
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="form-group">
              <label className="form-label">Item Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g., Used Textbook, Furniture, Clothing"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Product Description */}
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Describe the item's condition, features, and why it's being shared"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Category and Price */}
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <div style={{ position: 'relative' }}>
                  <Tag 
                    size={20} 
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }}
                  />
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    style={{ paddingLeft: '40px' }}
                    required
                  >
                    <option value="books">Books & Textbooks</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing & Shoes</option>
                    <option value="furniture">Furniture</option>
                    <option value="sports">Sports & Outdoors</option>
                    <option value="home">Home & Kitchen</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Suggested Price (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign 
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
                    type="number"
                    name="price"
                    className="form-input"
                    placeholder="0.00 (leave blank for free)"
                    value={formData.price}
                    onChange={handleChange}
                    style={{ paddingLeft: '40px' }}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <div style={{ position: 'relative' }}>
                  <Scale 
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
                    type="number"
                    name="quantity"
                    className="form-input"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    style={{ paddingLeft: '40px' }}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Unit</label>
                <select
                  name="unit"
                  className="form-select"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="piece">Piece</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="lb">Pound (lb)</option>
                  <option value="dozen">Dozen</option>
                  <option value="bunch">Bunch</option>
                  <option value="bag">Bag</option>
                </select>
              </div>
            </div>

            {/* Product Image */}
            <div className="form-group">
              <label className="form-label">Product Image</label>
              <div style={{
                border: '2px dashed var(--border-light)',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                position: 'relative'
              }}>
                <Upload size={32} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--text-light)', margin: '0 0 1rem 0' }}>
                  Click to upload or drag and drop your product image
                </p>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                {formData.image && (
                  <p style={{ color: 'var(--primary-green)', marginTop: '0.5rem' }}>
                    Selected: {formData.image.name}
                  </p>
                )}
              </div>
            </div>

            {/* Organic Checkbox */}
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  name="isOrganic"
                  checked={formData.isOrganic}
                  onChange={handleChange}
                />
                <span style={{ fontWeight: '500' }}>
                  This is an organic product
                </span>
              </label>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                Check this box if your product is certified organic or grown without synthetic pesticides
              </p>
            </div>

            {/* Submit Button */}
            <div className="grid grid-2 gap-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Package size={18} />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Tips */}
          <div style={{ 
            marginTop: '2rem',
            padding: '1rem',
            background: 'var(--bg-light)',
            borderRadius: '8px',
            border: '1px solid var(--border-light)'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-green)' }}>
              💡 Tips for Success
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-light)' }}>
              <li>Use clear, high-quality images</li>
              <li>Write detailed descriptions highlighting sustainability benefits</li>
              <li>Set competitive prices for your local market</li>
              <li>Clearly state if products are organic or eco-certified</li>
              <li>Keep your inventory updated regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItem;