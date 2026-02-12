import React, { useState, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Package, Upload, DollarSign, Tag, Scale } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { itemAPI } from '../services/api';

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
    condition: 'good',
    quantity: 1,
    unit: 'each',
    images: []
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      // Handle multiple file upload with max 3 images
      const newFiles = Array.from(files);
      const totalImages = formData.images.length + newFiles.length;
      if (totalImages > 3) {
        setError('Maximum 3 images allowed');
        return;
      }
      setFormData({
        ...formData,
        images: [...formData.images, ...newFiles]
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    setError('');
    setSuccess('');
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Item name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Item description is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (!formData.condition) {
      setError('Item condition is required');
      return false;
    }
    if (formData.images.length === 0) {
      setError('At least 1 image is required');
      return false;
    }
    if (formData.images.length > 3) {
      setError('Maximum 3 images allowed');
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
      // Upload images to Cloudinary
      const imageUrls = [];
      for (const imageFile of formData.images) {
        const cloudinaryData = new FormData();
        cloudinaryData.append('file', imageFile);
        cloudinaryData.append('upload_preset', 'greenmarket_unsigned');
        
        try {
          const cloudinaryResponse = await fetch(
            'https://api.cloudinary.com/v1_1/greenmarket/image/upload',
            {
              method: 'POST',
              body: cloudinaryData
            }
          );
          
          if (cloudinaryResponse.ok) {
            const data = await cloudinaryResponse.json();
            imageUrls.push(data.secure_url);
          }
        } catch (uploadErr) {
          console.error('Error uploading image to Cloudinary:', uploadErr);
          // Continue without this image
        }
      }

      // Prepare item data
      const itemData = {
        title: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        condition: formData.condition,
        quantity: parseInt(formData.quantity) || 1,
        unit: formData.unit,
        images: imageUrls // Upload image URLs
      };

      // Send to API
      const response = await itemAPI.createItem(itemData);
      console.log('Item created:', response);
      
      setSuccess('Item donated successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '0',
        category: 'books',
        condition: 'good',
        quantity: 1,
        unit: 'piece',
        images: []
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Error donating item:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to donate item. Please try again.';
      setError(errorMessage);
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
            {/* Item Name */}
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

            {/* Item Description */}
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

            {/* Product Images - Multiple */}
            <div className="form-group">
              <label className="form-label">Item Images (1-3 required) *</label>
              <div style={{
                border: '2px dashed var(--border-light)',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                position: 'relative'
              }}>
                <Upload size={32} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--text-light)', margin: '0 0 0.5rem 0' }}>
                  Click to upload or drag and drop item images
                </p>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: '0' }}>
                  Max 3 images ({formData.images.length}/3)
                </p>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
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
                  disabled={formData.images.length >= 3}
                />
              </div>

              {/* Preview selected images */}
              {formData.images.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                    Selected images:
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '0.5rem'
                  }}>
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          paddingBottom: '100%',
                          background: '#f0f0f0',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            padding: 0
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Item Condition */}
            <div className="form-group">
              <label className="form-label">Item Condition *</label>
              <select
                name="condition"
                className="form-select"
                value={formData.condition || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select condition...</option>
                <option value="new">New - Never used</option>
                <option value="like-new">Like New - Barely used</option>
                <option value="good">Good - Normal wear and tear</option>
                <option value="fair">Fair - Notable wear</option>
                <option value="poor">Poor - Significant damage</option>
              </select>
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
                    Donating Item...
                  </>
                ) : (
                  <>
                    <Package size={18} />
                    Donate Item
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
              <li>Write detailed descriptions about the item's condition and features</li>
              <li>Accurately describe the item's condition</li>
              <li>Be honest about any defects or damage</li>
              <li>Include pickup/delivery details if possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItem;