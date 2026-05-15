import crypto from "node:crypto";

type RateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const checkoutAttempts = new Map<string, RateLimitEntry>();
const checkoutWindowMs = 10 * 60 * 1000;
const maxCheckoutAttemptsPerIp = 8;
const maxCheckoutAttemptsPerContact = 3;

export function checkCheckoutRateLimit(ipAddress: string, phone: string, email: string): RateLimitResult {
  cleanupExpired(checkoutAttempts);

  const ipResult = increment(`ip:${ipAddress}`, maxCheckoutAttemptsPerIp);
  if (ipResult.limited) return ipResult;

  const contactResult = increment(`contact:${hashValue(`${phone}:${email}`)}`, maxCheckoutAttemptsPerContact);
  if (contactResult.limited) return contactResult;

  return { limited: false, retryAfterSeconds: 0 };
}

function increment(key: string, limit: number): RateLimitResult {
  const now = Date.now();
  const current = checkoutAttempts.get(key);
  const entry = current && current.resetAt > now ? current : { count: 0, resetAt: now + checkoutWindowMs };
  entry.count += 1;
  checkoutAttempts.set(key, entry);

  return {
    limited: entry.count > limit,
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

function cleanupExpired(entries: Map<string, RateLimitEntry>) {
  const now = Date.now();
  for (const [key, entry] of entries) {
    if (entry.resetAt <= now) entries.delete(key);
  }
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
