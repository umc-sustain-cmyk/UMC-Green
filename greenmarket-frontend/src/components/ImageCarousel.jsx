import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ImageCarousel({ images = [], title = 'Item' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle cases where images might be a string, array, or array of objects
  let imageArray = [];
  if (typeof images === 'string') {
    imageArray = [images];
  } else if (Array.isArray(images)) {
    imageArray = images.filter(img => img); // Filter out null/undefined
  }

  if (imageArray.length === 0) {
    return (
      <div style={{
        height: '200px',
        background: 'linear-gradient(135deg, var(--light-green), var(--accent-green))',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '3rem'
      }}>
        🎁
      </div>
    );
  }

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1));
  };

  const currentImage = imageArray[currentIndex];

  return (
    <div style={{
      position: 'relative',
      height: '200px',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#f0f0f0',
      marginBottom: '1rem'
    }}>
      {/* Main Image */}
      <img
        src={currentImage}
        alt={`${title} - Image ${currentIndex + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* Navigation - Only show if multiple images */}
      {imageArray.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            style={{
              position: 'absolute',
              left: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicator Dots */}
          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 10
          }}>
            {imageArray.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ImageCarousel;
