import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div className="glass-card" style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Enter your credentials to access your account</p>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await axios.post("http://localhost:8080/api/users/login", { email, password });
            login(res.data);
            navigate("/");
          } catch (err) { alert("Invalid credentials"); }
        }}>
          <input 
            type="email" placeholder="Email" style={styles.input}
            onChange={(e) => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Password" style={styles.input}
            onChange={(e) => setPassword(e.target.value)} required 
          />
          <button className="btn-modern" style={{width: '100%', marginTop: 20}}>Login</button>
        </form>
        
        {/* ✅ Navigation Fix: Clicking Register now navigates to /register */}
        <p style={styles.footer}>
          Don't have an account?{" "}
          <span 
            style={{color: '#2563eb', cursor: 'pointer', fontWeight: 600}} 
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { width: 400, padding: 40, textAlign: 'center' },
  title: { fontSize: 32, fontWeight: 800, margin: '0 0 10px 0' },
  subtitle: { color: '#666', marginBottom: 30, fontSize: 14 },
  input: { width: '100%', padding: '15px', marginBottom: 15, borderRadius: 12, border: '1px solid #ddd', boxSizing: 'border-box', outline: 'none' },
  footer: { marginTop: 20, fontSize: 13, color: '#888' }
};