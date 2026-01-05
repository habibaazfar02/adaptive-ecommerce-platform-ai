import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ SINGLE SOURCE OF TRUTH FOR PRICE
  const normalizePrice = (price) => {
    if (typeof price === "number") return price;

    if (typeof price === "string") {
      const p = Number(price);
      return isNaN(p) ? null : p;
    }

    if (typeof price === "object" && price !== null) {
      if ("value" in price) {
        const p = Number(price.value);
        return isNaN(p) ? null : p;
      }
      if ("amount" in price) {
        const p = Number(price.amount);
        return isNaN(p) ? null : p;
      }
    }

    return null;
  };

  const addItem = (product) => {
    const price = normalizePrice(product.price);

    if (price === null) {
      console.error("❌ Invalid product price:", product.price);
      alert("This product has invalid price data");
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...product, price, quantity: 1 }];
    });
  };

  const increase = (id) =>
    setCartItems((items) =>
      items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );

  const decrease = (id) =>
    setCartItems((items) =>
      items
        .map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );

  const removeItem = (id) =>
    setCartItems((items) => items.filter((i) => i.id !== id));

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        increase,
        decrease,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
