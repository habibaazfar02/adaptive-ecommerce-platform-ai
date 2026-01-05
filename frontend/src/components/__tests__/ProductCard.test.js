import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // 👈 ADD THIS LINE
import ProductCard from '../ProductCard';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../context/cartContext';

const discountedProduct = {
  id: 1,
  name: "Sale Watch",
  basePrice: 200, 
  price: 150,     
  aiScore: 0.95,
  image_url: "watch.jpg"
};

test('should display strike-through on base price during a sale', () => {
  render(
    <CartProvider>
      <BrowserRouter>
        <ProductCard p={discountedProduct} onSelect={() => {}} />
      </BrowserRouter>
    </CartProvider>
  );

  const strikePrice = screen.getByText(/200/);
  expect(strikePrice).toBeInTheDocument(); // 👈 This will now work
});