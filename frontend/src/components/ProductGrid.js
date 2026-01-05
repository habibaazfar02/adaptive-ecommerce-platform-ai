import React from "react";
import ProductCard from "./ProductCard";

/**
 * ProductGrid Component
 * Orchestrates the collection of ProductCards.
 * It receives the 'products' array which has been pre-scored by the AI Layer.
 */
export default function ProductGrid({ products, onSelect }) {
  if (!products || products.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>Curating the best deals for you...</p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          p={p}
          onSelect={onSelect}
          showAddToCart={true}
        />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "25px",
    padding: "10px",
  },
  emptyState: {
    textAlign: "center",
    padding: "50px",
    opacity: 0.5,
    fontSize: "16px",
  }
};