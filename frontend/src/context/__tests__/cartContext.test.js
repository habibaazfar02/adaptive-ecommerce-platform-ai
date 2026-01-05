import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, CartContext } from '../cartContext';
import { useContext } from 'react';

const TestCart = () => {
  const { cartItems, addItem } = useContext(CartContext);
  return (
    <div>
      <button onClick={() => addItem({ id: 1, name: 'Item', price: "50.00" })}>Add</button>
      <div data-testid="count">{cartItems.length}</div>
    </div>
  );
};

test('CartProvider should normalize string prices to numbers', () => {
  render(
    <CartProvider>
      <TestCart />
    </CartProvider>
  );

  fireEvent.click(screen.getByText('Add'));
  expect(screen.getByTestId('count').textContent).toBe('1');
});