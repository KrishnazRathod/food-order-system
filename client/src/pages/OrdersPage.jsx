import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OrderStatusBadge from '../components/OrderStatusBadge';
import api from '../api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/order');
      setOrders(response.data.data.rows);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container animate-fade-in" style={{ padding: '4rem 0 8rem' }}>
        <h1 style={{ marginBottom: '3rem', fontSize: '2.5rem' }}>My Orders</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>Fetching your order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="premium-card" style={{ textAlign: 'center', padding: '5rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't placed any orders yet.</p>
            <Link to="/" className="btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`} className="premium-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>Order #{order.id}</h3>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                  <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                    {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'} • 
                    <span style={{ fontWeight: 600, color: '#fff', marginLeft: '0.5rem' }}>${parseFloat(order.totalAmount).toFixed(2)}</span>
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <span style={{ fontWeight: 600 }}>View Details</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
