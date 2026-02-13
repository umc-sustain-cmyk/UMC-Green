import React, { useState } from 'react';
import { Heart, User, Bookmark, Check } from 'lucide-react';
import ImageCarousel from './ImageCarousel';

function ItemCard({ item, onToggleFavorite, onReserveItem }) {
  const [isReserved, setIsReserved] = useState(false);

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(item.id);
    }
  };

  const handleReserveItem = () => {
    setIsReserved(true);
    if (onReserveItem) {
      onReserveItem(item);
    }
    // Reset after 2 seconds
    setTimeout(() => {
      setIsReserved(false);
    }, 2000);
  };

  // Handle both old images array and new itemImages array
  let images = [];
  if (item.itemImages && Array.isArray(item.itemImages)) {
    // New structure: itemImages array of objects with url property
    images = item.itemImages
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map(img => img.url)
      .filter(url => url);
  } else if (item.images && Array.isArray(item.images)) {
    // Old structure: images array of URLs
    images = item.images.filter(img => img);
  } else if (item.image_url) {
    // Fallback: single image_url
    images = [item.image_url];
  }

  return (
    <div className="card">
      {/* Item Image Carousel */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <ImageCarousel images={images} title={item.name} />
        
        {/* Condition Badge */}
        {item.condition && (
          <div className="badge badge-success" style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            textTransform: 'capitalize',
            zIndex: 5
          }}>
            {item.condition}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5
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
              fontSize: '1.1rem', 
              fontWeight: 'bold', 
              color: 'var(--primary-green)' 
            }}>
              {item.price > 0 ? `$${item.price}` : 'FREE'}
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
            {item.condition}
          </div>
        </div>

        {/* Donor Info */}
        {item.donor && (
          <div className="flex gap-2 mb-3" style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
            <User size={16} />
            <span>From {item.donor.first_name} {item.donor.last_name}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={handleReserveItem}
            className={isReserved ? "btn btn-success" : "btn btn-primary"}
            style={{ flex: 1 }}
            disabled={!item.isAvailable || isReserved}
          >
            {isReserved ? (
              <>
                <Check size={16} />
                Item Reserved!
              </>
            ) : (
              <>
                <Bookmark size={16} />
                {item.isAvailable ? 'Reserve Item' : 'Not Available'}
              </>
            )}
          </button>
        </div>

        {/* Stock Status */}
        {!item.isAvailable && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            This item is no longer available
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemCard;
