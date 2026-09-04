import type { AdsClient } from './types'

/** Used on the web build — no ad SDK ships there. */
export const noopAdsClient: AdsClient = {
  async init() {},
  async showRewarded() {
    return 'unavailable'
  },
}
