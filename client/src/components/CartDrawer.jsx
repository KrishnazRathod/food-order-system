import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100vh', 
      zIndex: 2000, 
      display: 'flex', 
      justifyContent: 'flex-end' 
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'rgba(0, 0, 0, 0.7)', 
          backdropFilter: 'blur(8px)',
          transition: 'opacity 0.3s ease'
        }} 
      />
      
      {/* Drawer Content */}
      <div className="animate-fade-in" style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '450px', 
        height: '100%', 
        background: '#0f172a', 
        boxShadow: '-20px 0 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '2rem', 
          borderBottom: '1px solid rgba(255,255,255,0.1)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Your Cart</h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', margin: '0.25rem 0 0 0' }}>{cart.length} items</p>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              color: '#fff', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}
          >
            &times;
          </button>
        </div>

        {/* Items List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3 }}>🛒</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Empty cart?</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Add some delicious items from our menu to get started.</p>
              <button onClick={onClose} className="btn-primary" style={{ marginTop: '2rem' }}>Start Ordering</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', borderRadius: '1rem', objectFit: 'cover' }} />
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                      </div>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '2rem', 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>${cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            disabled={cart.length === 0}
            onClick={() => {
              onClose();
              navigate('/cart');
            }}
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '1.25rem', 
              fontSize: '1.1rem',
              fontWeight: 800,
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Checkout Now
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
