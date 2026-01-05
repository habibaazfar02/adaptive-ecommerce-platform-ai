import * as tf from "@tensorflow/tfjs";

export async function addAiScores(products) {
  if (!products || products.length === 0) return [];

  return tf.tidy(() => {
    const stocks = products.map((p) => Number(p.stock || 0));
    const prices = products.map((p) => Number(p.price || 0));

    const stockT = tf.tensor1d(stocks);
    const priceT = tf.tensor1d(prices);

    const stockN = stockT.div(tf.max(stockT).add(1e-6));
    const priceN = priceT.div(tf.max(priceT).add(1e-6));

    const scoreT = stockN.mul(0.7).add(tf.scalar(1).sub(priceN).mul(0.3));
    const scores = scoreT.arraySync();

    return products
      .map((p, i) => ({
        ...p,
        aiScore: scores[i],
      }))
      .sort((a, b) => b.aiScore - a.aiScore);
  });
}
