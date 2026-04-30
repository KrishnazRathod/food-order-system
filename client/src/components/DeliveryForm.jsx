import React, { useState } from 'react';

const DeliveryForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    deliveryName: initialData.deliveryName || '',
    deliveryAddress: initialData.deliveryAddress || '',
    deliveryPhone: initialData.deliveryPhone || '',
    notes: initialData.notes || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Full Name</label>
        <input 
          required
          name="deliveryName"
          value={formData.deliveryName}
          onChange={handleChange}
          placeholder="Who is this for?" 
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem', color: '#fff' }} 
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Delivery Address</label>
        <textarea 
          required
          name="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={handleChange}
          placeholder="Where should we deliver?" 
          rows="3"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem', color: '#fff', resize: 'none' }} 
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Phone Number</label>
        <input 
          required
          name="deliveryPhone"
          value={formData.deliveryPhone}
          onChange={handleChange}
          placeholder="How can we reach you?" 
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem', color: '#fff' }} 
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Notes (Optional)</label>
        <input 
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any special instructions?" 
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem', color: '#fff' }} 
        />
      </div>
      
      <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
        Place Order
      </button>
    </form>
  );
};

export default DeliveryForm;
