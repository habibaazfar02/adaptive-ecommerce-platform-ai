import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';

const Cart = () => {
  const { cartItems, removeItem, updateItemQuantity } = useContext(CartContext);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <section className="cart">
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            <img src={item.image} alt={item.name} />
            <div>{item.name}</div>
            <div>{item.quantity}</div>
            <div>${item.price}</div>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>Total: Rs {total}</div>
      <button>Checkout</button>
    </section>
  );
};

export default Cart;
