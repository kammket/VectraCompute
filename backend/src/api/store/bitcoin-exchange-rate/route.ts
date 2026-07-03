import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

type BitcoinExchangeRate = {
  usd: number;
  source: string;
  fetched_at: string;
};

let cachedRate: BitcoinExchangeRate | null = null;
let cachedAt = 0;

const CACHE_TTL_MS = 5 * 60 * 1000;

const fetchCoinGeckoRate = async (): Promise<BitcoinExchangeRate> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_last_updated_at=true",
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`CoinGecko returned ${response.status}`);
  }

  const payload = (await response.json()) as {
    bitcoin?: { usd?: number; last_updated_at?: number };
  };

  const usd = payload.bitcoin?.usd;
  if (!usd || !Number.isFinite(usd)) {
    throw new Error("CoinGecko returned an invalid BTC/USD rate");
  }

  return {
    usd,
    source: "CoinGecko",
    fetched_at: payload.bitcoin?.last_updated_at
      ? new Date(payload.bitcoin.last_updated_at * 1000).toISOString()
      : new Date().toISOString(),
  };
};

const fetchCoinbaseRate = async (): Promise<BitcoinExchangeRate> => {
  const response = await fetch(
    "https://api.coinbase.com/v2/exchange-rates?currency=BTC",
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Coinbase returned ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: { rates?: { USD?: string } };
  };
  const usd = Number(payload.data?.rates?.USD);

  if (!usd || !Number.isFinite(usd)) {
    throw new Error("Coinbase returned an invalid BTC/USD rate");
  }

  return {
    usd,
    source: "Coinbase",
    fetched_at: new Date().toISOString(),
  };
};

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  const now = Date.now();

  if (cachedRate && now - cachedAt < CACHE_TTL_MS) {
    return res.status(200).json({
      bitcoin_exchange_rate: cachedRate,
      cached: true,
    });
  }

  try {
    cachedRate = await fetchCoinGeckoRate();
  } catch {
    cachedRate = await fetchCoinbaseRate();
  }

  cachedAt = now;

  return res.status(200).json({
    bitcoin_exchange_rate: cachedRate,
    cached: false,
  });
}
