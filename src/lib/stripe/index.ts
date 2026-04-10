import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

// Convenience alias
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const STRIPE_PRICES = {
  STARTER_MONTHLY: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "",
  STARTER_YEARLY: process.env.STRIPE_PRICE_STARTER_YEARLY ?? "",
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
  PRO_YEARLY: process.env.STRIPE_PRICE_PRO_YEARLY ?? "",
  MASTER_MONTHLY: process.env.STRIPE_PRICE_MASTER_MONTHLY ?? "",
  MASTER_YEARLY: process.env.STRIPE_PRICE_MASTER_YEARLY ?? "",
} as const;

export function tierFromPriceId(priceId: string): "STARTER" | "PRO" | "MASTER" | null {
  if (priceId === STRIPE_PRICES.STARTER_MONTHLY || priceId === STRIPE_PRICES.STARTER_YEARLY) return "STARTER";
  if (priceId === STRIPE_PRICES.PRO_MONTHLY || priceId === STRIPE_PRICES.PRO_YEARLY) return "PRO";
  if (priceId === STRIPE_PRICES.MASTER_MONTHLY || priceId === STRIPE_PRICES.MASTER_YEARLY) return "MASTER";
  return null;
}
