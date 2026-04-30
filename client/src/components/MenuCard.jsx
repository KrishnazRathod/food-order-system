import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addToCart(item);
    showToast(`${item.name} added to cart!`);
  };

  return (
    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img 
          src={item.image} 
          alt={item.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <span style={{ 
          position: 'absolute', 
          top: '1rem', 
          right: '1rem', 
          background: 'rgba(15, 23, 42, 0.8)', 
          backdropFilter: 'blur(4px)',
          padding: '0.25rem 0.75rem', 
          borderRadius: '2rem', 
          fontSize: '0.75rem', 
          fontWeight: 600,
          textTransform: 'capitalize',
          border: '1px solid var(--glass-border)'
        }}>
          {item.category}
        </span>
      </div>
      
      <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>{item.name}</h3>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.125rem' }}>${item.price}</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flexGrow: 1 }}>
          {item.description}
        </p>
        
        <button 
          onClick={handleAddToCart}
          className="btn-primary" 
          style={{ width: '100%' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
