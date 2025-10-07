import React from 'react';
import { ShoppingCart, Heart, User } from 'lucide-react';

function ItemCard({ item, onAddToCart, onToggleFavorite }) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(item.id);
    }
  };

  return (
    <div className="card">
      {/* Item Image */}
      <div style={{
        height: '200px',
        background: item.image_url 
          ? `url(${item.image_url})` 
          : 'linear-gradient(135deg, var(--light-green), var(--accent-green))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
        marginBottom: '1rem',
        position: 'relative'
      }}>
        {!item.image_url && (
          <div className="flex-center" style={{ height: '100%', color: 'white', fontSize: '3rem' }}>
            🌱
          </div>
        )}
        
        {/* Organic Badge */}
        {item.is_organic && (
          <div className="badge badge-success" style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.5rem'
          }}>
            Organic
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Heart size={16} color="var(--primary-green)" />
        </button>
      </div>

      {/* Item Info */}
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
          {item.name}
        </h3>
        
        <p style={{ 
          color: 'var(--text-light)', 
          fontSize: '0.9rem',
          margin: '0 0 1rem 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {item.description}
        </p>

        {/* Category */}
        <div className="badge badge-info" style={{ marginBottom: '1rem' }}>
          {item.category}
        </div>

        {/* Price and Quantity */}
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <div>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: 'var(--primary-green)' 
            }}>
              ${item.price}
            </span>
            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              /{item.unit}
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
            Qty: {item.quantity}
          </div>
        </div>

        {/* Seller Info */}
        {item.seller && (
          <div className="flex gap-2 mb-3" style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
            <User size={16} />
            <span>Sold by {item.seller.first_name} {item.seller.last_name}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={!item.in_stock}
          >
            <ShoppingCart size={16} />
            {item.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>

        {/* Stock Status */}
        {!item.in_stock && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            Currently out of stock
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemCard;