import { Capacitor } from '@capacitor/core'
import type { IapClient } from './types'
import { noopIapClient } from './noop'

let client: IapClient = noopIapClient
let ready: Promise<void> | null = null

export function iap(): IapClient {
  return client
}

/** Loads the RevenueCat SDK only on-platform; the web bundle never pulls it in. */
export function initIap(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      if (Capacitor.isNativePlatform()) {
        const { revenueCatIapClient } = await import('./revenuecat')
        client = revenueCatIapClient
      }
      await client.init()
    })()
  }
  return ready
}
