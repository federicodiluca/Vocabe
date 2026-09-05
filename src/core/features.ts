/**
 * Feature flags. `MONETIZATION` gates every "pay / watch an ad" surface — the
 * RevenueCat + AdMob plumbing exists but has no account behind it yet, so the
 * UI stays hidden until it's ready. The bonus word is shown for free meanwhile.
 */
export const MONETIZATION = false
