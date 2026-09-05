import { Capacitor } from '@capacitor/core'
import type { AdsClient } from './types'
import { noopAdsClient } from './noop'

let client: AdsClient = noopAdsClient
let ready: Promise<void> | null = null

export function ads(): AdsClient {
  return client
}

/** Loads the native AdMob SDK only on-platform; the web bundle never pulls it in. */
export function initAds(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      if (Capacitor.isNativePlatform()) {
        const { admobAdsClient } = await import('./admob')
        client = admobAdsClient
      }
      await client.init()
    })()
  }
  return ready
}
