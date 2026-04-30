import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 1000, 
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
          background: 'rgba(0, 0, 0, 0.6)', 
          backdropFilter: 'blur(4px)' 
        }} 
      />
      
      {/* Drawer Content */}
      <div className="animate-fade-in" style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '400px', 
        height: '100%', 
        background: 'var(--bg-card)', 
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid var(--glass-border)'
      }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Your Cart</h2>
          <button onClick={onClose} style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>&times;</button>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
              <p style={{ color: 'var(--text-muted)' }}>Your cart is empty</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '0.75rem', objectFit: 'cover' }} />
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ color: 'var(--primary)' }}>-</button>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ color: 'var(--primary)' }}>+</button>
                      </div>
                      <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--danger)', fontSize: '1.25rem' }}>&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '2rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={() => {
              onClose();
              navigate('/cart');
            }}
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem' }}
          >
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
