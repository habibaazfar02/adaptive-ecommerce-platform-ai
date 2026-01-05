import { useLocation, useNavigate } from "react-router-dom";

/**
 * OrderSuccess Component
 * Provides a post-purchase confirmation with options to view the receipt or continue shopping.
 */
export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation(); // ✅ Catch the order data from PaymentOptions

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* SUCCESS ICON */}
        <div style={styles.iconCircle}>✓</div>
        
        <h1 style={styles.title}>Payment Successful</h1>
        <p style={styles.subtitle}>
          Your order has been placed and is being prepared for shipment.
        </p>
        
        <div style={styles.actionArea}>
          {/* PRIMARY ACTION: VIEW RECEIPT */}
          <button 
            style={styles.primaryBtn} 
            // ✅ Forward the data state so the receipt page can display it
            onClick={() => navigate("/Orderpage", { state: state })}
          >
            View Receipt
          </button>

          {/* SECONDARY ACTION: CONTINUE SHOPPING */}
          <button 
            style={styles.secondaryBtn} 
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { 
    minHeight: "100vh", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    background: "#F9FAFB", // Subtle off-white background
    fontFamily: "'Inter', sans-serif"
  },
  card: { 
    maxWidth: 450, 
    width: "90%",
    padding: "50px 40px", 
    textAlign: "center", 
    background: "#fff", 
    borderRadius: 32, 
    boxShadow: "0 20px 60px rgba(0,0,0,0.05)" 
  },
  iconCircle: { 
    width: 72, 
    height: 72, 
    background: "#10b981", 
    color: "#fff", 
    borderRadius: "50%", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: 32, 
    margin: "0 auto 25px",
    boxShadow: "0 10px 20px rgba(16, 185, 129, 0.2)" 
  },
  title: { 
    fontSize: "30px", 
    fontWeight: "800", 
    marginBottom: "12px",
    color: "#111827" 
  },
  subtitle: { 
    color: "#6B7280", 
    marginBottom: "35px", 
    lineHeight: "1.6",
    fontSize: "16px" 
  },
  actionArea: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "12px" 
  },
  primaryBtn: { 
    padding: "18px", 
    background: "#000", 
    color: "#fff", 
    borderRadius: "16px", 
    border: "none", 
    fontWeight: "700", 
    fontSize: "16px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  secondaryBtn: { 
    padding: "18px", 
    background: "transparent", 
    color: "#374151", 
    borderRadius: "16px", 
    border: "1px solid #E5E7EB", 
    fontWeight: "600", 
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  }
};