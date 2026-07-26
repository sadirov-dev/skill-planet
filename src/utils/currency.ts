// Real-Time Currency Utility for Kyrgyzstani Som (сом / KGS) and US Dollars ($)
// Fetches live USD/KGS exchange rate dynamically

export interface ExchangeRateData {
  rate: number; // e.g. 89.50
  lastUpdated: string;
  isLive: boolean;
}

let cachedRate: ExchangeRateData = {
  rate: 89.50,
  lastUpdated: new Date().toLocaleTimeString(),
  isLive: false,
};

export async function fetchLiveKgsRate(): Promise<ExchangeRateData> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('API Response error');
    const data = await res.json();
    if (data && data.rates && data.rates.KGS) {
      cachedRate = {
        rate: Number(data.rates.KGS.toFixed(2)),
        lastUpdated: new Date().toLocaleTimeString(),
        isLive: true,
      };
    }
  } catch (err) {
    console.warn('Using default KGS exchange rate (89.50):', err);
  }
  return cachedRate;
}

export function getCachedRate(): ExchangeRateData {
  return cachedRate;
}

export function formatPriceKGS(priceUsd: number, rate = cachedRate.rate): { som: string; usd: string; full: string } {
  if (priceUsd === 0) {
    return {
      som: 'Бесплатно',
      usd: '$0',
      full: 'Бесплатно',
    };
  }

  const priceSom = Math.round(priceUsd * rate);
  const formattedSom = priceSom.toLocaleString('ru-RU') + ' сом';
  const formattedUsd = `$${priceUsd}`;

  return {
    som: formattedSom,
    usd: formattedUsd,
    full: `${formattedSom} (${formattedUsd})`,
  };
}

export function formatRevenueKGS(revenueUsd: number, rate = cachedRate.rate): { som: string; usd: string; full: string } {
  const revenueSom = Math.round(revenueUsd * rate);
  const formattedSom = revenueSom.toLocaleString('ru-RU') + ' сом';
  const formattedUsd = `$${revenueUsd.toLocaleString('en-US')}`;

  return {
    som: formattedSom,
    usd: formattedUsd,
    full: `${formattedSom} (${formattedUsd})`,
  };
}
