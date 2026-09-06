/**
 * Feature flags. `MONETIZATION` gates every "pay / watch an ad" surface — the
 * RevenueCat + AdMob plumbing exists but has no account behind it yet, so the
 * UI stays hidden until it's ready. The bonus word is shown for free meanwhile.
 *
 * Keep this `false` on main (the deployed website): a paywall that can't take
 * money is worse than no paywall. Flip it to `true` only in the branch that
 * builds the store release, once the RevenueCat and AdMob keys are in `.env`.
 */
export const MONETIZATION = false
