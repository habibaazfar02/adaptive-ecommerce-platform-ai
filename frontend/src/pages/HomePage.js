import React, { useEffect, useState, useMemo } from "react";
import Hero from "../components/Hero";
import CategorySidebar from "../components/CategorySidebar";
import ProductGrid from "../components/ProductGrid";
import ProductDetails from "../components/ProductDetails";
import { api } from "../services/Api";
import { addAiScores } from "../services/ai";

/**
 * HomePage Component
 * Manages the main product feed, AI ranking, and dual-filter logic.
 */
export default function HomePage({ searchQuery, onProductsLoaded }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");

  // ✅ LOGIC: If a user types in the search bar, automatically reset category to "ALL"
  // This prevents the "No results found" error when searching across categories.
  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== "") {
      setActiveCategory("ALL");
    }
  }, [searchQuery]);

  useEffect(() => {
    /* ---------- INITIAL DATA LOAD ---------- */
    api.get("/products")
      .then(async (res) => {
        // Normalize product data for consistent UI rendering
        const normalized = res.data.map((p) => ({
          ...p,
          price: Number(p.currentPrice || p.price || 0),
          basePrice: Number(p.basePrice || p.currentPrice || p.price || 0),
          stock: p.stock || 0,
          imageUrl: p.image_url || p.imageUrl,
        }));

        try {
          // Apply local AI Scoring (TensorFlow.js)
          const scored = await addAiScores(normalized);
          setProducts(scored);
          // Sync with App.js for Header suggestions
          if (onProductsLoaded) onProductsLoaded(scored);
        } catch (err) {
          console.error("AI Layer failed, using raw data", err);
          setProducts(normalized);
          if (onProductsLoaded) onProductsLoaded(normalized);
        }
      })
      .catch((err) => console.error("Product fetch failed:", err));

    // Load available categories
    api.get("/products/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category fetch failed:", err));
  }, []);

  /* ---------- ADAPTIVE FILTER & SEARCH LOGIC ---------- */
  const filtered = useMemo(() => {
    let list = [...products];

    // 1. Filter by Category (only if search hasn't reset it)
    if (activeCategory !== "ALL") {
      list = list.filter(p => 
        String(p.category || "").toLowerCase() === String(activeCategory).toLowerCase()
      );
    }

    // 2. Filter by Search Query
    if (searchQuery && searchQuery.trim() !== "") {
      const term = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.category && p.category.toLowerCase().includes(term))
      );
    }

    // 3. Sort by AI Score (Recommended items first)
    return list.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
  }, [products, activeCategory, searchQuery]);

  return (
    <div style={styles.container}>
      {/* Dynamic Hero Title */}
      <Hero 
        products={filtered.slice(0, 5)} 
        onSelect={setSelected} 
        title={searchQuery ? `Global Results for "${searchQuery}"` : `${activeCategory} Collection`}
      />

      

      <div style={styles.mainLayout}>
        {/* LEFT: Sticky Category Navigation */}
        <aside style={styles.sidebar}>
          <CategorySidebar 
            categories={categories} 
            active={activeCategory} 
            onPick={setActiveCategory} 
          />
        </aside>

        {/* CENTER: Main Product Grid */}
        <main style={styles.gridSection}>
          <ProductGrid products={filtered} onSelect={setSelected} />
        </main>

        {/* RIGHT: Sticky Live Product View */}
        <aside style={styles.detailsSection}>
          {selected ? (
            <ProductDetails product={selected} />
          ) : (
            <div style={styles.emptyDetails}>
              <div style={styles.emptyIcon}>🔍</div>
              <p style={styles.emptyText}>Select a product to view the AI Match details</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ---------------- PROFESSIONAL STYLING ---------------- */

const styles = {
  container: { 
    padding: "0 40px", 
    maxWidth: "1600px", 
    margin: "0 auto", 
    background: "#fcfcfc",
    minHeight: "100vh"
  },
  mainLayout: { 
    display: "flex", 
    marginTop: "40px", 
    gap: "30px", 
    alignItems: "flex-start" 
  },
  sidebar: { 
    width: "250px", 
    position: "sticky", 
    top: "100px",
    height: "fit-content"
  },
  gridSection: { 
    flex: 1, 
    minHeight: "500px" 
  },
  detailsSection: { 
    width: "380px", 
    position: "sticky", 
    top: "100px",
    height: "fit-content"
  },
  emptyDetails: { 
    padding: "60px 30px", 
    background: "#fff", 
    borderRadius: "28px", 
    border: "2px dashed #e2e8f0", 
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  emptyIcon: { fontSize: "40px", marginBottom: "15px", opacity: 0.3 },
  emptyText: { color: "#94a3b8", fontSize: "14px", fontWeight: "500", lineHeight: "1.5" }
};