import { useLocation, useNavigate } from "react-router-dom";

export default function OrderPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) { navigate("/"); return null; }
  const { items, total, method } = state;

  return (
    <div style={styles.page}>
      <div style={styles.ticket}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.title}>Payment Received</h2>
        <p style={styles.subtitle}>A confirmation has been sent to your email.</p>

        <div style={styles.detailsBox}>
          <div style={styles.metaRow}>
            <div>
              <span style={styles.label}>Method</span>
              <span style={styles.value}>{method}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={styles.label}>Date</span>
              <span style={styles.value}>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div style={styles.dashedDivider} />

          <div style={styles.itemSection}>
            {items.map((item, idx) => (
              <div key={idx} style={styles.itemRow}>
                <span style={styles.itemName}>{item.name} <small>x{item.quantity}</small></span>
                <span style={styles.itemPrice}>Rs {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={styles.grandTotal}>
            <span>Amount Paid</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>
        </div>

        <button style={styles.homeBtn} onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#F9FAFB', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  ticket: { background: '#fff', width: '100%', maxWidth: '440px', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 32px rgba(0,0,0,0.05)', textAlign: 'center' },
  successIcon: { width: '56px', height: '56px', background: '#10B981', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 20px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#101828', marginBottom: '8px' },
  subtitle: { color: '#667085', fontSize: '14px', marginBottom: '32px' },
  detailsBox: { textAlign: 'left', background: '#fff', borderRadius: '16px' },
  metaRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '24px' },
  label: { fontSize: '11px', color: '#98A2B3', textTransform: 'uppercase', fontWeight: '700', display: 'block' },
  value: { fontSize: '15px', fontWeight: '600', color: '#1D2939' },
  dashedDivider: { height: '1px', borderTop: '2px dashed #EAECF0', margin: '20px 0' },
  itemRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  itemName: { fontSize: '14px', color: '#475467' },
  itemPrice: { fontWeight: '600', color: '#101828' },
  grandTotal: { display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #F2F4F7', fontSize: '18px', fontWeight: '900', color: '#101828' },
  homeBtn: { width: '100%', marginTop: '32px', padding: '16px', background: '#101828', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }
};