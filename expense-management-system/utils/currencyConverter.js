// utils/currencyConverter.js
// Minimal example: convert by fetching exchange rates (could use exchangerate-api).
// Here we provide a stub: assume 1:1 if same currency; otherwise returns mocked conversion factor.

const fetch = require('node-fetch');

async function convertAmount(amount, fromCurrency, toCurrency) {
  if (!fromCurrency || !toCurrency) return amount;
  if (fromCurrency === toCurrency) return amount;

  // For real production: call exchangerate API.
  // Minimal implementation: try public API, fallback to 1:1.
  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}`);
    if (!res.ok) throw new Error('rate fetch failed');
    const data = await res.json();
    const rate = data?.rates?.[toCurrency];
    if (!rate) return amount;
    return amount * rate;
  } catch (err) {
    console.warn('Currency convert failed, using 1:1 fallback', err.message);
    return amount; // fallback
  }
}

module.exports = { convertAmount };
