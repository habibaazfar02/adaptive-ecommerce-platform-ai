import { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { BACKEND_BASE_URL } from "../services/Config";

/**
 * ProductCard Component
 * Displays individual product details with dynamic real-time pricing.
 * Handles the "Observer" visual feedback for price slashes.
 */
export default function ProductCard({ p, onSelect, showAddToCart = true }) {
  const { addItem } = useContext(CartContext);

  // 1. Normalize image path (handles local uploads and external links)
  const rawImg = p.image_url || p.imageUrl;
  const imgUrl = rawImg 
    ? (rawImg.startsWith("http") ? rawImg : `${BACKEND_BASE_URL}/images/${rawImg}`)
    : "https://via.placeholder.com/200";

  // 2. Pricing Logic for Strike-Through
  // 'original' is the base price from the DB.
  // 'current' is the price calculated by the Observer (PriceManager).
  const original = Number(p.basePrice || 0);
  const current = Number(p.price || p.currentPrice || 0);
  
  // The condition that triggers the adaptive UI
  const hasDiscount = current > 0 && original > 0 && current < original;

  return (
    <div style={styles.card}>
      {/* Product Image */}
      <img 
        src={imgUrl} 
        alt={p.name} 
        style={styles.image} 
        onClick={() => onSelect(p)} 
      />
      
      <div style={styles.body} onClick={() => onSelect(p)}>
        <h4 style={styles.title}>{p.name}</h4>
        <p style={styles.categoryBadge}>{p.category || "General"}</p>
        
        {/* REAL-TIME ADAPTIVE PRICING DISPLAY */}
        <div style={styles.priceContainer}>
          {hasDiscount ? (
            <>
              {/* Main Price (Strike-through Grey) */}
              <span style={styles.strikePrice}>Rs {original.toFixed(2)}</span>
              
              {/* Discounted Price (Bold Red Writing) */}
              <span style={styles.discountPrice}>Rs {current.toFixed(2)}</span>
            </>
          ) : (
            <span style={styles.normalPrice}>Rs {current.toFixed(2)}</span>
          )}
        </div>

        {/* DECORATOR BADGES (e.g., MEGA DEAL, LOW STOCK) */}
        <div style={styles.badgeRow}>
            {p.badges?.map((badge, index) => (
                <span key={index} style={styles.badge}>{badge}</span>
            ))}
        </div>

        <div style={styles.stockInfo}>
          Stock: <span style={{ fontWeight: 600 }}>{p.stock}</span>
        </div>
      </div>

      {showAddToCart && (
        <button
          style={{
            ...styles.cartBtn,
            opacity: p.stock === 0 ? 0.6 : 1,
            cursor: p.stock === 0 ? "not-allowed" : "pointer"
          }}
          disabled={p.stock === 0}
          onClick={(e) => {
            e.stopPropagation(); // Prevents opening details when clicking the button
            addItem(p);
          }}
        >
          {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      )}
    </div>
  );
}

const styles = {
  card: { 
    background: "#fff", 
    borderRadius: 16, 
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)", 
    overflow: "hidden", 
    display: "flex", 
    flexDirection: "column",
    transition: "0.3s ease"
  },
  image: { width: "100%", height: 180, objectFit: "cover", cursor: "pointer" },
  body: { padding: 16, cursor: "pointer", flex: 1 },
  title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#111" },
  categoryBadge: { fontSize: 11, color: '#888', margin: '4px 0', textTransform: 'uppercase' },
  
  // Adaptive Price Styling
  priceContainer: { display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '10px' },
  
  strikePrice: { 
    textDecoration: 'line-through', 
    color: '#9ca3af', // Soft grey color
    fontSize: '14px', 
    fontWeight: '400' 
  },
  
  discountPrice: { 
    color: '#ef4444', // Red color for attention
    fontWeight: '800', 
    fontSize: '20px',
    letterSpacing: '-0.5px'
  },
  
  normalPrice: { 
    fontWeight: '700', 
    fontSize: '18px', 
    color: '#111' 
  },

  stockInfo: { fontSize: 12, marginTop: 8, color: "#555" },
  badgeRow: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' },
  badge: { 
    background: '#fef2f2', 
    color: '#991b1b', 
    padding: '2px 8px', 
    borderRadius: '4px', 
    fontSize: '10px', 
    fontWeight: 'bold',
    border: '1px solid #fee2e2'
  },
  
  cartBtn: { 
    width: '100%', 
    padding: '14px', 
    background: '#000', 
    color: '#fff', 
    border: 'none', 
    fontWeight: '700',
    fontSize: '14px'
  }
};