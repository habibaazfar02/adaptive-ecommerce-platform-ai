import * as tf from "@tensorflow/tfjs";

/**
 * Compute AI scores for products using TensorFlow.js tensors.
 * Logic: Normalizes stock and price to find the best 'value' for the user.
 */
export async function addAiScores(products) {
  if (!products?.length) return [];

  return tf.tidy(() => {
    const stocks = products.map(p => Number(p.stock || 0));
    const prices = products.map(p => Number(p.price || 0));

    const stockT = tf.tensor1d(stocks);
    const priceT = tf.tensor1d(prices);

    // Normalization (Avoid division by zero with small epsilon)
    const stockN = stockT.div(tf.max(stockT).add(tf.scalar(1e-6)));
    const priceN = priceT.div(tf.max(priceT).add(tf.scalar(1e-6)));

    // Score = High Stock (0.65 weight) + Low Price (0.35 weight)
    const scoreT = stockN.mul(0.65).add(tf.scalar(1).sub(priceN).mul(0.35));

    const scores = scoreT.arraySync();

    return products.map((p, i) => ({
      ...p,
      aiScore: Number(scores[i].toFixed(3)),
    })).sort((a, b) => b.aiScore - a.aiScore);
  });
}