import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added this
import { api } from "../services/Api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleSubmit = async () => {
    try {
      await api.post("/users/register", form);
      alert("Welcome aboard! Please login to continue.");
      navigate("/login"); // ✅ Redirect to login after success
    } catch (err) { alert("Error joining."); }
  };

  return (
    <div style={formStyles.wrapper}>
      <div style={formStyles.card}>
        <h2 style={formStyles.title}>Create Account</h2>
        <p style={formStyles.subtitle}>Join our community of trendsetters.</p>
        
        <input style={formStyles.input} name="name" placeholder="Full Name" onChange={(e) => setForm({...form, name: e.target.value})} />
        <input style={formStyles.input} name="email" placeholder="Email Address" onChange={(e) => setForm({...form, email: e.target.value})} />
        <input style={formStyles.input} type="password" name="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} />
        
        <button style={formStyles.btn} onClick={handleSubmit}>Sign Up</button>
        
        {/* ✅ Navigation Fix: Clicking Login now navigates to /login */}
        <p style={formStyles.footerText}>
          Already have an account?{" "}
          <span 
            style={{fontWeight: 600, cursor: 'pointer', color: '#000'}} 
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const formStyles = {
  wrapper: { height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' },
  card: { width: 400, padding: 40, background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.05)', textAlign: 'center' },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 10 },
  subtitle: { color: '#666', marginBottom: 30 },
  input: { width: '100%', padding: '15px 20px', marginBottom: 15, borderRadius: 12, border: '1px solid #eee', background: '#fdfdfd', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: 15, background: '#000', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', marginTop: 10 },
  footerText: { fontSize: 13, color: '#888', marginTop: 20 }
};