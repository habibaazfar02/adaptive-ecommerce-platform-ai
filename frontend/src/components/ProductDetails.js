import { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { BACKEND_BASE_URL } from "../services/Config"; 

export default function ProductDetails({ product }) {
  const { addItem } = useContext(CartContext);
  if (!product) return null;

  const rawImg = product.image_url || product.imageUrl;
  const fullUrl = rawImg 
    ? (rawImg.startsWith("http") ? rawImg : `${BACKEND_BASE_URL}/images/${rawImg}`)
    : "https://via.placeholder.com/200";

  const currentPrice = Number(product.currentPrice ?? product.price ?? 0);

  return (
    <div style={styles.card}>
      <div style={styles.imageWrapper}>
        <img src={fullUrl} alt={product.name} style={styles.image} />
        
        {/* AI MATCH PROGRESS BAR */}
        {product.aiScore && (
          <div style={styles.aiMatchBox}>
             <div style={styles.aiHeader}>
                <span style={styles.aiTitle}>✨ Adaptive AI Match</span>
                <span style={styles.aiPercent}>{Math.round(product.aiScore * 100)}%</span>
             </div>
             <div style={styles.progressBg}>
                <div style={{...styles.progressFill, width: `${product.aiScore * 100}%`}}></div>
             </div>
          </div>
        )}
      </div>

      <h2 style={styles.title}>{product.name}</h2>
      <p style={styles.desc}>{product.description}</p>

      <div style={styles.metaGrid}>
        <div style={styles.metaItem}>
            <span style={styles.label}>Collection</span>
            <span style={styles.value}>{product.category}</span>
        </div>
        <div style={styles.metaItem}>
            <span style={styles.label}>Inventory</span>
            <span style={styles.value}>{product.stock > 0 ? `${product.stock} Units` : 'Out of Stock'}</span>
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.priceContainer}>
            <span style={styles.priceLabel}>Current Price</span>
            <span style={styles.priceValue}>Rs {currentPrice.toLocaleString()}</span>
        </div>
        <button
          style={{...styles.cartBtn, opacity: product.stock === 0 ? 0.5 : 1}}
          disabled={product.stock === 0}
          onClick={() => addItem(product)}
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { background: "#fff", borderRadius: 28, padding: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.04)", border: '1px solid #f1f5f9', display: "flex", flexDirection: "column", gap: 20 },
  imageWrapper: { position: 'relative' },
  image: { width: "100%", height: 260, objectFit: "cover", borderRadius: 20 },
  
  aiMatchBox: { 
    marginTop: 15, background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0" 
  },
  aiHeader: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  aiTitle: { fontSize: "11px", fontWeight: "800", color: "#6366f1", textTransform: "uppercase" },
  aiPercent: { fontSize: "14px", fontWeight: "900", color: "#6366f1" },
  progressBg: { height: "6px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #6366f1, #a855f7)", borderRadius: "10px" },

  title: { fontSize: 24, fontWeight: 900, color: "#0f172a", margin: 0 },
  desc: { fontSize: 14, color: "#64748b", lineHeight: 1.6 },
  metaGrid: { display: 'flex', gap: '30px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' },
  metaItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: "800" },
  value: { fontSize: '14px', fontWeight: "700", color: "#1e293b" },
  
  footer: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '15px' },
  priceContainer: { display: 'flex', flexDirection: 'column' },
  priceLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '700' },
  priceValue: { fontSize: '28px', fontWeight: '900', color: '#000' },
  cartBtn: { width: "100%", padding: "18px", background: "#0f172a", color: "#fff", borderRadius: "16px", border: "none", fontWeight: "700", cursor: "pointer" }
};