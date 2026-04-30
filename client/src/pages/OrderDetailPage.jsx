import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OrderStatusBadge from '../components/OrderStatusBadge';
import OrderTimeline from '../components/OrderTimeline';
import useSocket from '../hooks/useSocket';
import api from '../api';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.on('order:statusUpdate', (data) => {
        if (data.orderId === parseInt(id)) {
          setOrder(prev => prev ? { ...prev, status: data.status } : null);
        }
      });
      return () => socket.off('order:statusUpdate');
    }
  }, [socket, id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/order/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>Loading order details...</div>
    </>
  );

  if (!order) return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
        <h2>Order not found</h2>
        <Link to="/orders" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Orders</Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container animate-fade-in" style={{ padding: '4rem 0 8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <Link to="/orders" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to History
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <h1 style={{ fontSize: '2.5rem' }}>Order #{order.id}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Amount</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>${parseFloat(order.totalAmount).toFixed(2)}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Tracking Timeline */}
            <div className="premium-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ marginBottom: '2.5rem' }}>Track Order</h3>
              <OrderTimeline currentStatus={order.status} />
            </div>

            {/* Items Summary */}
            <div className="premium-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ marginBottom: '2rem' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {order.orderItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '0.75rem', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        🍱
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.125rem' }}>{item.menuItem.name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span style={{ fontWeight: 600 }}>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="premium-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Delivery Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</label>
                  <p style={{ marginTop: '0.25rem', lineHeight: '1.6' }}>{order.deliveryAddress}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</label>
                  <p style={{ marginTop: '0.25rem' }}>{order.deliveryName}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</label>
                  <p style={{ marginTop: '0.25rem' }}>{order.deliveryPhone}</p>
                </div>
                {order.notes && (
                  <div>
                    <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes</label>
                    <p style={{ marginTop: '0.25rem', fontStyle: 'italic' }}>"{order.notes}"</p>
                  </div>
                )}
              </div>
            </div>

            <div className="premium-card" style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--primary)' }}>
              <p style={{ color: 'var(--primary)', fontWeight: 600 }}>Need Help?</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Contact our support team for assistance with your order.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
