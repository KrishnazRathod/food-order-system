import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'received':
        return { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', text: 'Order Received' };
      case 'preparing':
        return { bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', text: 'Preparing' };
      case 'out_for_delivery':
        return { bg: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', text: 'Out for Delivery' };
      case 'delivered':
        return { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', text: 'Delivered' };
      case 'cancelled':
        return { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171', text: 'Cancelled' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', text: status };
    }
  };

  const styles = getStatusStyles();

  return (
    <span style={{ 
      backgroundColor: styles.bg, 
      color: styles.color, 
      padding: '0.25rem 0.75rem', 
      borderRadius: '2rem', 
      fontSize: '0.75rem', 
      fontWeight: 600,
      border: `1px solid ${styles.color}44`
    }}>
      {styles.text}
    </span>
  );
};

export default OrderStatusBadge;
