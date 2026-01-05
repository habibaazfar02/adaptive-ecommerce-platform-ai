import { addAiScores } from '../ai';

describe('AI Strategy Service', () => {
  test('should rank high-stock/low-price items higher', async () => {
    const products = [
      { id: 1, name: 'Bad Deal', stock: 1, price: 1000 },
      { id: 2, name: 'Good Deal', stock: 100, price: 10 }
    ];

    const results = await addAiScores(products);
    
    // The "Good Deal" should have a higher score and appear first
    expect(results[0].name).toBe('Good Deal');
    expect(results[0].aiScore).toBeGreaterThan(results[1].aiScore);
  });
});