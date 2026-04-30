import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 0' }}>
        <div className="premium-card" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Join FoodOrder</h2>
            <p style={{ color: 'var(--text-muted)' }}>Experience premium food delivery.</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>First Name</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.75rem', color: '#fff' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Last Name</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.75rem', color: '#fff' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.75rem', color: '#fff' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Password</label>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.75rem', color: '#fff' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Confirm Password</label>
              <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.75rem', color: '#fff' }} />
            </div>
            
            <button disabled={loading} type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log In</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
