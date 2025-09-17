// lib/rateLimit.ts
type Bucket = { tokens: number; lastRefill: number };
const BUCKETS = new Map<string, Bucket>();
const RATE = 5; // tokens per minute
const CAPACITY = 10;

export function allowRequest(key: string) {
  const now = Date.now();
  const bucket = BUCKETS.get(key) ?? { tokens: CAPACITY, lastRefill: now };
  const elapsedMinutes = (now - bucket.lastRefill) / 60000;
  const refill = Math.floor(elapsedMinutes * RATE);
  if (refill > 0) {
    bucket.tokens = Math.min(CAPACITY, bucket.tokens + refill);
    bucket.lastRefill = now;
  }
  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    BUCKETS.set(key, bucket);
    return true;
  }
  BUCKETS.set(key, bucket);
  return false;
}
