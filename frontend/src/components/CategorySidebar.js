import React from "react";

/**
 * CategorySidebar Component
 * Redesigned for a high-end, professional look.
 * Matches modern "SaaS" and "Fintech" dashboard aesthetics.
 */
export default function CategorySidebar({ categories, active, onPick }) {
  
  const handlePick = (cat) => {
    console.log("Category Selected:", cat);
    onPick(cat);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Categories</h3>
      <div style={styles.list}>
        {/* ALL PRODUCTS BUTTON */}
        <button
          style={{
            ...styles.btn,
            ...(active === "ALL" ? styles.activeBtn : {})
          }}
          onClick={() => handlePick("ALL")}
        >
          All Products
        </button>

        {/* DYNAMIC CATEGORY BUTTONS */}
        {categories.map((c) => (
          <button
            key={c}
            style={{
              ...styles.btn,
              ...(active === c ? styles.activeBtn : {})
            }}
            onClick={() => handlePick(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: "20px", 
    background: "#fff", 
    borderRadius: "16px", 
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    height: "fit-content"
  },
  title: { 
    fontSize: "14px", 
    fontWeight: "800", 
    color: "#000000ff", 
    textTransform: "uppercase", 
    letterSpacing: "1.2px", 
    marginBottom: "20px" 
  },
  list: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "10px" 
  },
  btn: {
    padding: "12px 16px",
    textAlign: "left",
    background: "#f8fafc", // Very light gray/blue
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569", // Slate gray
    transition: "all 0.2s ease",
    outline: "none"
  },
  activeBtn: {
    background: "#0f172a", // Dark navy/black
    color: "#fff",
    // borderColor: "#0f172a",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  }
};