import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../services/Config";

export default function Hero({ onSelect }) {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_BASE_URL}/api/recommendations/1`)
      .then((res) => {
        const clean = res.data.map((p) => {
          const price =
            Number(p.price ?? p.currentPrice ?? p.current_price ?? 0);
          const basePrice =
            Number(p.basePrice ?? price);

          const hasDiscount =
            basePrice > 0 && price > 0 && price < basePrice;

          const rawImg = p.imageUrl || p.image_url;

          return {
            ...p,
            price,
            basePrice,
            hasDiscount,
            displayImage: rawImg
              ? rawImg.startsWith("http")
                ? rawImg
                : `${BACKEND_BASE_URL}/images/${rawImg}`
              : "https://via.placeholder.com/200",
          };
        });

        setRecs(clean.slice(0, 3));
      })
      .catch((err) => console.error("Hero Fetch Error:", err));
  }, []);

  return (
    <section style={styles.hero}>
      <h2 style={styles.title}>✨ Strategy-Based Recommendations</h2>

      <div style={styles.row}>
        {recs.map((p) => (
          <div
            key={p.id}
            style={styles.card}
            onClick={() => onSelect && onSelect(p)}
          >
            <img src={p.displayImage} alt={p.name} style={styles.img} />

            {/* DECORATOR BADGES */}
            <div style={styles.badges}>
              {p.badges?.map((b, i) => (
                <span key={i} style={styles.badge}>{b}</span>
              ))}
            </div>

            <div style={styles.content}>
              <h4>{p.name}</h4>

              {/* DISCOUNT DISPLAY */}
              {p.hasDiscount ? (
                <div style={styles.priceRow}>
                  <span style={styles.strike}>
                    Rs {p.basePrice.toFixed(2)}
                  </span>
                  <span style={styles.discount}>
                    Rs {p.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <p style={styles.normalPrice}>
                  Rs {p.price.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  hero: {
    padding: "20px",
    background: "#f0f4f8",
    borderRadius: "15px",
    margin: "20px",
  },
  title: { fontSize: "20px", marginBottom: "15px" },
  row: { display: "flex", gap: "15px", overflowX: "auto" },
  card: {
    minWidth: "220px",
    background: "#fff",
    borderRadius: "12px",
    cursor: "pointer",
    overflow: "hidden",
    border: "1px solid #ddd",
    position: "relative",
  },
  img: { width: "100%", height: "120px", objectFit: "cover" },
  content: { padding: "10px" },

  priceRow: { display: "flex", gap: "8px", alignItems: "baseline" },
  strike: {
    textDecoration: "line-through",
    fontSize: "12px",
    color: "#9ca3af",
  },
  discount: {
    color: "#ef4444",
    fontWeight: "800",
    fontSize: "16px",
  },
  normalPrice: {
    color: "#2563eb",
    fontWeight: "bold",
  },

  badges: {
    position: "absolute",
    top: "8px",
    left: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  badge: {
    background: "#ef4444",
    color: "#fff",
    fontSize: "10px",
    padding: "4px 6px",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};
