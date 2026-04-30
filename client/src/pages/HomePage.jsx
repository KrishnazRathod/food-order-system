import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import MenuCard from '../components/MenuCard';

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'pizza', 'burger', 'drink', 'dessert', 'side'];

  useEffect(() => {
    fetchMenu();
  }, [activeCategory]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const url = activeCategory === 'all' ? '/menu' : `/menu?category=${activeCategory}`;
      const response = await api.get(url);
      setMenuItems(response.data.data.rows);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container animate-fade-in">
        <header style={{ padding: '4rem 0', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Craving Something Delicious?
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Explore our curated selection of premium meals, prepared fresh and delivered straight to your door.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '2rem',
                  background: activeCategory === cat ? 'var(--primary)' : 'var(--bg-card)',
                  color: activeCategory === cat ? '#000' : '#fff',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  border: '1px solid var(--glass-border)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search for your favorite dish..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '1rem 1.5rem', 
                borderRadius: '2rem', 
                background: 'var(--bg-card)', 
                border: '1px solid var(--glass-border)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
            <p>Gathering our finest ingredients...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', paddingBottom: '6rem' }}>
            {filteredItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
            {filteredItems.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>No dishes found. Try a different search or category.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default HomePage;
