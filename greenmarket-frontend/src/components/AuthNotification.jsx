import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';

function AuthNotification({ onDismiss, onShowAuth }) {
  const [countdown, setCountdown] = useState(5);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (countdown > 0 && isVisible) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && isVisible) {
      onShowAuth();
      setIsVisible(false);
    }
  }, [countdown, isVisible, onShowAuth]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'var(--primary-green)',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      zIndex: 999,
      minWidth: '280px',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <div className="flex-between gap-3">
        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <Clock size={20} />
          <div>
            <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>
              Join GreenMarket!
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              Sign up in {countdown} second{countdown !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white'
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default AuthNotification;