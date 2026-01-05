import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/Api";
export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => {
      setOrder(res.data);
    });
  }, [id]);

  if (!order) return <div style={{padding: 100, textAlign: 'center', opacity: 0.5}}>Syncing order details...</div>;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
            <div style={styles.statusBadge}>{order.status}</div>
        </div>
        
        <div style={styles.titleSection}>
          <h2 style={styles.title}>Receipt</h2>
          <p style={styles.orderId}>ID: #{order.id}</p>
        </div>

        <div style={styles.metaRow}>
          <div style={styles.metaItem}>
            <span style={styles.label}>Payment Method</span>
            <span style={styles.value}>{order.paymentMethod}</span>
          </div>
          <div style={{...styles.metaItem, textAlign: 'right'}}>
            <span style={styles.label}>Order Date</span>
            <span style={styles.value}>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div style={styles.itemsList}>
          <h3 style={styles.sectionTitle}>Purchased Items</h3>
          {order.items.map(item => (
            <div key={item.id} style={styles.itemRow}>
              <div style={styles.itemMain}>
                <span style={styles.itemName}>{item.productName}</span>
                <span style={styles.itemQty}>Qty: {item.quantity}</span>
              </div>
              <div style={styles.itemPrice}>Rs {(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <div style={styles.totalRow}>
            <span>Grand Total</span>
            <span>Rs {order.total.toLocaleString()}</span>
          </div>
          <button style={styles.doneBtn} onClick={() => navigate("/")}>Done</button>
        </div>
      </div>
    </div>  );
}

const styles = {
  pageWrapper: { minHeight: '100vh', background: '#f4f4f4', padding: '60px 20px' },
  container: { maxWidth: '550px', margin: '0 auto', background: '#fff', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 40px 0' },
  backBtn: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontWeight: '600' },
  statusBadge: { background: '#000', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' },
  titleSection: { textAlign: 'center', padding: '20px 0 40px', borderBottom: '1px dashed #eee' },
  title: { margin: 0, fontWeight: 800, fontSize: '32px', letterSpacing: '-1.5px' },
  orderId: { color: '#888', margin: '5px 0 0', fontSize: '14px' },
  metaRow: { display: 'flex', justifyContent: 'space-between', padding: '25px 40px', borderBottom: '1px solid #f9f9f9' },
  label: { fontSize: '10px', textTransform: 'uppercase', color: '#bbb', fontWeight: 700, display: 'block', marginBottom: '4px' },
  value: { fontSize: '14px', fontWeight: 600, color: '#1a1a1a' },
  itemsList: { padding: '40px' },
  sectionTitle: { fontSize: '12px', fontWeight: '800', color: '#bbb', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  itemMain: { display: 'flex', flexDirection: 'column' },
  itemName: { fontWeight: '600', fontSize: '16px', color: '#1a1a1a' },
  itemQty: { fontSize: '12px', color: '#999' },
  itemPrice: { fontWeight: '700', fontSize: '16px' },
  footer: { padding: '30px 40px', background: '#fafafa', textAlign: 'center' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: 900, marginBottom: '25px', color: '#000' },
  doneBtn: { width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer' }
};