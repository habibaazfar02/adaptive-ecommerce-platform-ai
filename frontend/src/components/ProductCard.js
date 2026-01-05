import React, { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { BACKEND_BASE_URL } from "../services/Config";

/**
 * ProductCard Component
 * Features: Adaptive Pricing (Slashed Prices) + AI Match Percentage Badge
 */
export default function ProductCard({ p, onSelect, showAddToCart = true }) {
  const { addItem } = useContext(CartContext);

  // 1. Normalize Image Path
  const rawImg = p.image_url || p.imageUrl;
  const imgUrl = rawImg 
    ? (rawImg.startsWith("http") ? rawImg : `${BACKEND_BASE_URL}/images/${rawImg}`)
    : "https://via.placeholder.com/200";

  // 2. Pricing Logic (Maintain Discounts)
  const original = Number(p.basePrice || 0);
  const current = Number(p.price || p.currentPrice || 0);
  const hasDiscount = current > 0 && original > 0 && current < original;

  // 3. AI Match Logic
  const matchPercentage = p.aiScore ? Math.round(p.aiScore * 100) : null;
  const isHighMatch = p.aiScore > 0.75;

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer} onClick={() => onSelect(p)}>
        <img src={imgUrl} alt={p.name} style={styles.image} />
        
        {/* BADGE OVERLAY: AI MATCH & SAVINGS */}
        <div style={styles.badgeOverlay}>
          {matchPercentage && (
            <div style={{
              ...styles.aiBadge, 
              background: isHighMatch 
                ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" 
                : "#64748b"
            }}>
              ✨ {matchPercentage}% Match
            </div>
          )}
          {hasDiscount && (
            <div style={styles.saveBadge}>SAVE Rs {(original - current).toLocaleString()}</div>
          )}
        </div>
      </div>

      <div style={styles.body} onClick={() => onSelect(p)}>
        <h3 style={styles.title}>{p.name}</h3>
        <p style={styles.category}>{p.category}</p>
        
        <div style={styles.priceRow}>
          {hasDiscount ? (
            <>
              <span style={styles.currentPrice}>Rs {current.toLocaleString()}</span>
              <span style={styles.originalPrice}>Rs {original.toLocaleString()}</span>
            </>
          ) : (
            <span style={styles.currentPrice}>Rs {current.toLocaleString()}</span>
          )}
        </div>
      </div>

      {showAddToCart && (
        <button 
          style={{...styles.cartBtn, opacity: p.stock === 0 ? 0.5 : 1}}
          disabled={p.stock === 0}
          onClick={(e) => {
            e.stopPropagation();
            addItem(p);
          }}
        >
          {p.stock === 0 ? "Sold Out" : "Add to Bag"}
        </button>
      )}
    </div>
  );
}

const styles = {
  card: { background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", position: 'relative', border: '1px solid #f1f5f9' },
  imageContainer: { position: "relative", height: "200px", cursor: "pointer" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  
  badgeOverlay: { position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "6px" },
  aiBadge: { color: "#fff", padding: "5px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)" },
  saveBadge: { background: "#ef4444", color: "#fff", padding: "5px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: "bold" },
  
  body: { padding: "20px", flex: 1 },
  title: { margin: "0", fontSize: "16px", fontWeight: "700", color: "#0f172a" },
  category: { fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", margin: "4px 0 12px", fontWeight: "700" },
  priceRow: { display: "flex", gap: "10px", alignItems: "baseline" },
  currentPrice: { fontSize: "19px", fontWeight: "900", color: "#000" },
  originalPrice: { fontSize: "13px", color: "#94a3b8", textDecoration: "line-through" },
  cartBtn: { width: "100%", padding: "16px", background: "#0f172a", color: "#fff", border: "none", fontWeight: "700", cursor: "pointer" }
};