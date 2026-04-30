import React from 'react';

const OrderTimeline = ({ currentStatus }) => {
  const steps = [
    { id: 'received', label: 'Order Received', icon: '📝' },
    { id: 'preparing', label: 'Preparing Food', icon: '🍳' },
    { id: 'out_for_delivery', label: 'On the Way', icon: '🛵' },
    { id: 'delivered', label: 'Delivered', icon: '✅' },
  ];

  const getStatusIndex = (status) => {
    return steps.findIndex(step => step.id === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex || currentStatus === 'delivered';
        const isActive = index === currentIndex && currentStatus !== 'delivered';
        const isFuture = index > currentIndex;

        return (
          <div key={step.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', opacity: isFuture ? 0.4 : 1 }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: isCompleted ? 'var(--success)' : (isActive ? 'var(--primary)' : 'var(--bg-card)'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                border: '2px solid var(--glass-border)',
                zIndex: 2,
                boxShadow: isActive ? '0 0 15px var(--primary)' : 'none'
              }}>
                {isCompleted ? '✓' : step.icon}
              </div>
              {index < steps.length - 1 && (
                <div style={{ 
                  position: 'absolute', 
                  top: '40px', 
                  width: '2px', 
                  height: 'calc(2rem + 10px)', 
                  backgroundColor: isCompleted ? 'var(--success)' : 'var(--glass-border)',
                  zIndex: 1
                }} />
              )}
            </div>
            <div>
              <h4 style={{ color: isActive ? 'var(--primary)' : '#fff', fontSize: '1.125rem' }}>{step.label}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {isCompleted ? 'Done' : (isActive ? 'Current Step' : 'Pending')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
