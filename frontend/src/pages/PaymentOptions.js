import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/UserContext";
import { api } from "../services/Api";

function PaymentOptions() {
  const [method, setMethod] = useState("");
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handlePay = async () => {
    if (!method) return alert("Please select a payment method.");
    if (!user) return navigate("/login");

    const payload = {
      userId: Number(user.id),
      paymentMethod: method,
      total: Number(total.toFixed(2)),
      items: cartItems.map(item => ({
        id: Number(item.id),
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price)
      }))
    };

    try {
      // 1. Send Order to Backend
      const res = await api.post("/orders", payload);
      
      // ✅ FIX: Extract the 'id' from the returned Order object
      // The backend returns { id: 3, userId: 1, ... }
      const orderId = res.data.id; 

      const orderSummary = {
        items: cartItems,
        total,
        method: method,
        orderId: orderId // Now this is '3' instead of the whole object
      };

      // 2. Clear Cart and Navigate
      clearCart();
      
      // We go to Success page first, which then forwards the state to Orderpage
      navigate("/order-success", { state: orderSummary });

    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Order failed. Stock might be insufficient or server is down.");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Secure Checkout</h2>
        <p style={styles.subtitle}>Choose your preferred payment method</p>

        <div style={styles.methodList}>
          <div 
            style={{
              ...styles.methodCard,
              borderColor: method === "CARD" ? "#000" : "#eee",
              background: method === "CARD" ? "#fcfcfc" : "#fff"
            }}
            onClick={() => setMethod("CARD")}
          >
            <div style={styles.iconBox}>💳</div>
            <div style={styles.methodInfo}>
              <span style={styles.methodTitle}>Credit / Debit Card</span>
              <span style={styles.methodDesc}>Visa, Mastercard, AMEX</span>
            </div>
          </div>

          <div 
            style={{
              ...styles.methodCard,
              borderColor: method === "COD" ? "#000" : "#eee",
              background: method === "COD" ? "#fcfcfc" : "#fff"
            }}
            onClick={() => setMethod("COD")}
          >
            <div style={styles.iconBox}>🚚</div>
            <div style={styles.methodInfo}>
              <span style={styles.methodTitle}>Cash on Delivery</span>
              <span style={styles.methodDesc}>Pay when you receive your order</span>
            </div>
          </div>
        </div>

        <div style={styles.summaryBox}>
          <div style={styles.totalRow}>
            <span>Grand Total</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>
        </div>

        <button 
          onClick={handlePay} 
          style={{
            ...styles.payBtn,
            opacity: method ? 1 : 0.6,
            cursor: method ? 'pointer' : 'not-allowed'
          }}
          disabled={!method}
        >
          Complete Purchase
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { minHeight: '100vh', background: '#f8f9fa', display: 'flex', justifyContent: 'center', padding: '60px 20px' },
  container: { width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', height: 'fit-content' },
  title: { fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' },
  subtitle: { color: '#666', marginBottom: '32px', fontSize: '15px' },
  methodList: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' },
  methodCard: { display: 'flex', alignItems: 'center', padding: '18px', border: '2px solid', borderRadius: '16px', cursor: 'pointer', transition: '0.2s ease-in-out', justifyContent: 'space-between' },
  iconBox: { fontSize: '24px', marginRight: '16px', background: '#f0f0f0', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' },
  methodInfo: { display: 'flex', flexDirection: 'column', flex: 1 },
  methodTitle: { fontWeight: '700', fontSize: '16px', color: '#1a1a1a' },
  methodDesc: { fontSize: '13px', color: '#888' },
  summaryBox: { background: '#f9f9f9', padding: '20px', borderRadius: '16px', marginBottom: '32px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '18px', color: '#000' },
  payBtn: { width: '100%', padding: '18px', background: '#000', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '700', transition: '0.3s' }
};

export default PaymentOptions;