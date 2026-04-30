import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import MenuCard from '../components/MenuCard';
import heroImage from '../assets/hero.png';

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'pizza', 'burger', 'drink', 'dessert', 'side'];

  useEffect(() => {
    // Debounce search to prevent excessive API calls
    const delayDebounceFn = setTimeout(() => {
      fetchMenu();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [activeCategory, searchQuery]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      let url = '/menu?';
      if (activeCategory !== 'all') url += `category=${activeCategory}&`;
      if (searchQuery) url += `search=${searchQuery}`;
      
      const response = await api.get(url);
      setMenuItems(response.data.data.rows);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container animate-fade-in">
        <header style={{ 
          padding: '6rem 2rem', 
          textAlign: 'center', 
          marginTop: '2rem',
          borderRadius: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-premium)'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ 
              fontSize: '4rem', 
              marginBottom: '1.5rem', 
              lineHeight: 1.1,
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(to right, #fff, var(--primary))', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              Gourmet Food <br/> Delivered in Minutes
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Experience the finest cuisine from local top-rated restaurants, prepared fresh and delivered with care.
            </p>
            
            <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search for your favorite dish (e.g. Pizza, Burger)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1.25rem 2rem', 
                  borderRadius: '3rem', 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '1.125rem',
                  outline: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>
        </header>

        <div style={{ marginTop: '4rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Explore Categories</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '2rem',
                  background: activeCategory === cat ? 'var(--primary)' : 'var(--bg-card)',
                  color: activeCategory === cat ? '#000' : '#fff',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  border: '1px solid var(--glass-border)',
                  transition: 'var(--transition)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
            <p>Gathering our finest ingredients...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', paddingBottom: '6rem' }}>
            {menuItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
            {menuItems.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>No dishes found. Try a different search or category.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <footer style={{ 
        background: 'var(--bg-card)', 
        padding: '4rem 0', 
        marginTop: '6rem', 
        borderTop: '1px solid var(--glass-border)' 
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
          <div>
            <h3 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>FoodOrder</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.8' }}>
              Delivering premium gourmet experiences to your doorstep since 2024. Quality you can taste, speed you can trust.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <li>Browse Menu</li>
              <li>Track Order</li>
              <li>About Us</li>
              <li>Contact Support</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <li>Italian Pizza</li>
              <li>Gourmet Burgers</li>
              <li>Healthy Salads</li>
              <li>Artisan Desserts</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Contact</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>support@foodorder.com</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>1-800-FOOD-ORDER</p>
          </div>
        </div>
        <div className="container" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          &copy; 2024 FoodOrder Inc. All rights reserved.
        </div>
      </footer>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default HomePage;
