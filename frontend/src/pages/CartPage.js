import { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, increase, decrease, removeItem } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyWrap}>
        <h2 style={{fontWeight: 800}}>Your bag is empty.</h2>
        <button style={styles.primaryBtn} onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.cartList}>
        <h1 style={styles.heading}>Bag</h1>
        {cartItems.map(item => (
          <div key={item.id} style={styles.cartItem}>
            <div style={styles.itemInfo}>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p style={styles.itemPrice}>Rs {Number(item.price).toLocaleString()}</p>
              <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>Remove</button>
            </div>
            <div style={styles.qtyControls}>
              <button style={styles.qtyBtn} onClick={() => decrease(item.id)}>-</button>
              <span style={styles.qtyVal}>{item.quantity}</span>
              <button style={styles.qtyBtn} onClick={() => increase(item.id)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.summaryCard}>
        <h2 style={styles.subHeading}>Summary</h2>
        <div style={styles.summaryRow}>
          <span>Subtotal</span>
          <span>Rs {total.toLocaleString()}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Estimated Shipping</span>
          <span style={{color: '#10b981'}}>Free</span>
        </div>
        <hr style={styles.hr} />
        <div style={{...styles.summaryRow, fontWeight: 700, fontSize: 18}}>
          <span>Total</span>
          <span>Rs {total.toLocaleString()}</span>
        </div>
        <button style={styles.checkoutBtn} onClick={() => user ? navigate("/payment") : navigate("/login")}>
          Checkout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', gap: 40, padding: '40px 10%', flexWrap: 'wrap', background: '#fff' },
  cartList: { flex: 2, minWidth: 300 },
  summaryCard: { flex: 1, minWidth: 300, background: '#f9f9f9', padding: 30, borderRadius: 20, height: 'fit-content' },
  heading: { fontSize: 32, fontWeight: 800, marginBottom: 30 },
  subHeading: { fontSize: 24, fontWeight: 700, marginBottom: 20 },
  cartItem: { display: 'flex', justifyContent: 'space-between', padding: '24px 0', borderBottom: '1px solid #eee' },
  itemName: { fontSize: 18, fontWeight: 600, margin: 0 },
  itemPrice: { color: '#666', margin: '5px 0' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: 15 },
  qtyBtn: { width: 32, height: 32, borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' },
  qtyVal: { fontWeight: 600 },
  removeBtn: { background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: 0, fontSize: 13, textDecoration: 'underline' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 15 },
  checkoutBtn: { width: '100%', padding: '16px 0', background: '#000', color: '#fff', border: 'none', borderRadius: 30, fontWeight: 600, cursor: 'pointer', marginTop: 20 },
  emptyWrap: { textAlign: 'center', padding: '100px 0' },
  primaryBtn: { padding: '12px 30px', background: '#000', color: '#fff', borderRadius: 30, border: 'none', marginTop: 20, cursor: 'pointer' },
  hr: { border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }
};