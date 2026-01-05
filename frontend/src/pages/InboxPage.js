import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { api } from "../services/Api";

export default function InboxPage() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInbox = () => {
    if (user && user.id) {
      setLoading(true);
      api.get(`/inbox/${user.id}`)
        .then(res => {
          setMessages(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadInbox();
  }, [user]);

  const handleClearAll = () => {
    if (!user) return;
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      api.delete(`/inbox/user/${user.id}`)
        .then(() => {
          setMessages([]);
          loadInbox();
        })
        .catch(err => {
          console.error(err);
          alert("Failed to clear inbox. Ensure backend has @Transactional.");
        });
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.mainTitle}>Activity</h1>
            <p style={styles.subtitle}>You have {messages.length} updates</p>
          </div>
          {messages.length > 0 && (
            <button style={styles.glassBtn} onClick={handleClearAll}>
              Clear All
            </button>
          )}
        </div>

        {/* MESSAGES LIST */}
        <div style={styles.list}>
          {loading ? (
            <div style={styles.loader}>Syncing your feed...</div>
          ) : messages.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>✨</div>
              <p>You're all caught up!</p>
            </div>
          ) : (
            messages.map((n, i) => (
              <div key={n.id} style={{...styles.card, animationDelay: `${i * 0.05}s`}} className="modern-card">
                <div style={styles.accentBar} />
                <div style={styles.cardContent}>
                  <p style={styles.messageText}>{n.message}</p>
                  <span style={styles.timestamp}>
                    {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <button 
                  style={styles.closeBtn} 
                  onClick={() => api.delete(`/inbox/${n.id}`).then(loadInbox)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    padding: "60px 20px"
  },
  container: {
    maxWidth: "650px",
    margin: "0 auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "40px",
    padding: "0 10px"
  },
  mainTitle: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#1a1a1a",
    margin: 0,
    letterSpacing: "-1.5px"
  },
  subtitle: {
    color: "#555",
    margin: "5px 0 0 0",
    fontSize: "16px",
    fontWeight: "500"
  },
  glassBtn: {
    background: "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: "#d9534f",
    transition: "0.3s"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  card: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.07)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    position: "relative",
    overflow: "hidden"
  },
  accentBar: {
    width: "4px",
    height: "40px",
    background: "#2563eb",
    borderRadius: "10px",
    marginRight: "20px"
  },
  cardContent: {
    flex: 1
  },
  messageText: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    lineHeight: "1.4"
  },
  timestamp: {
    fontSize: "12px",
    color: "#888",
    display: "block",
    marginTop: "6px"
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    color: "#ccc",
    cursor: "pointer",
    padding: "5px",
    marginLeft: "15px"
  },
  emptyState: {
    textAlign: "center",
    padding: "100px 0",
    color: "#777"
  },
  emptyIcon: {
    fontSize: "60px",
    marginBottom: "15px"
  },
  loader: {
    textAlign: "center",
    padding: "40px",
    color: "#2563eb",
    fontWeight: "600"
  }
};