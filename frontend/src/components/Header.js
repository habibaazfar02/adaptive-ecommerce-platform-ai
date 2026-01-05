import { useContext, useState } from "react";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Header({ products = [], onSearchTriggered }) {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/");
  };

  /* ---------- LIVE SUGGESTION LOGIC ---------- */
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim().length > 0) {
      // Logic: Filter based on user input (e.g., 's' -> 'Smart Watch')
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5); // Limit to top 5
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchAction = (searchTerm) => {
    setQuery(searchTerm);
    onSearchTriggered(searchTerm);
    setSuggestions([]);
    navigate("/"); // Ensure we view results on the Home page
  };

  return (
    <header className="app-header">
      <div className="logo" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
        Adaptive E-Commerce
      </div>

      <div className="search-box" style={{ position: 'relative', display: 'flex', gap: '8px' }}>
        <input
          placeholder="Search products..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearchAction(query)}
        />
        
        <button className="btn" onClick={() => handleSearchAction(query)}>
          Search
        </button>

        {/* ---------- SUGGESTION DROPDOWN ---------- */}
        {suggestions.length > 0 && (
          <div style={styles.dropdown}>
            {suggestions.map(p => (
              <div 
                key={p.id} 
                style={styles.suggestionItem}
                onClick={() => handleSearchAction(p.name)}
              >
                <span>{p.name}</span>
                <small style={{color: '#94a3b8'}}>{p.category}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="header-actions">
        <button className="btn secondary" onClick={() => navigate("/")}>🏠 Home</button>
        <button className="btn secondary" onClick={() => navigate("/cart")}>🛒 Cart ({cartCount})</button>
        {user ? (
          <>
            <button className="btn secondary" onClick={() => navigate("/inbox")}>📥 Inbox</button>
            <span>{user.name}</span>
            <button className="btn danger" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => navigate("/login")}>Login</button>
            <button className="btn secondary" onClick={() => navigate("/register")}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
}

const styles = {
  dropdown: {
    position: 'absolute', top: '45px', left: 0, width: '100%',
    background: '#fff', borderRadius: '12px', zIndex: 1000,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9'
  },
  suggestionItem: {
    padding: '12px 20px', cursor: 'pointer', display: 'flex', 
    justifyContent: 'space-between', borderBottom: '1px solid #f8fafc'
  }
  
};