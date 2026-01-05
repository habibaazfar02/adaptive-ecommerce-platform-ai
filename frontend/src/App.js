import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentOptions from "./pages/PaymentOptions";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import InboxPage from "./pages/InboxPage";
import OrderPage from "./pages/Orderpage";
import OrderSuccess from "./pages/OrderSuccess";
import AdminPortal from './pages/AdminPortal';

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Shared state for suggestions

  return (
    <>
      {/* 1. Header receives products for live filtering (suggestions) */}
      <Header 
        products={allProducts} 
        onSearchTriggered={(q) => setSearchQuery(q)} 
      />

      <Routes>
        {/* 2. HomePage fetches products and shares them back up */}
        <Route path="/" element={
          <HomePage 
            searchQuery={searchQuery} 
            onProductsLoaded={setAllProducts} 
          />
        } />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment" element={<PaymentOptions />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/Orderpage" element={<OrderPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </>
  );
}

export default App;