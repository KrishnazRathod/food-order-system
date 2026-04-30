import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import DeliveryForm from '../components/DeliveryForm';
import api from '../api';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (deliveryData) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const orderData = {
        ...deliveryData,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        }))
      };
      const response = await api.post('/order', orderData);
      clearCart();
      navigate(`/orders/${response.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '10rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn-primary">Browse Menu</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container animate-fade-in" style={{ padding: '4rem 0 8rem' }}>
        <h1 style={{ marginBottom: '3rem', fontSize: '2.5rem' }}>Your Order Summary</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>
          {/* Cart Items */}
          <div className="premium-card" style={{ padding: '2rem' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', borderRadius: '1rem', objectFit: 'cover' }} />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>Remove</button>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{item.category}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem', padding: '0.25rem 1rem' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ fontSize: '1.25rem', padding: '0.25rem' }}>-</button>
                      <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ fontSize: '1.25rem', padding: '0.25rem' }}>+</button>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Total Amount</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Form */}
          <div className="premium-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Delivery Details</h3>
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            {!user && (
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
                Please <Link to="/login" style={{ fontWeight: 700, textDecoration: 'underline' }}>Login</Link> to place your order.
              </div>
            )}
            <DeliveryForm 
              onSubmit={handlePlaceOrder} 
              initialData={{ 
                deliveryName: user ? `${user.firstName} ${user.lastName}` : '',
                deliveryEmail: user ? user.email : '' 
              }} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
