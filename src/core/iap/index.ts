import { Capacitor } from '@capacitor/core'
import type { IapClient } from './types'
import { noopIapClient } from './noop'

let client: IapClient = noopIapClient
let ready: Promise<void> | null = null

export function iap(): IapClient {
  return client
}

/** Loads the RevenueCat SDK for the current platform (native or Web Billing) lazily. */
export function initIap(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      if (Capacitor.isNativePlatform()) {
        const { revenueCatIapClient } = await import('./revenuecat')
        client = revenueCatIapClient
      } else {
        const { webIapClient } = await import('./web')
        client = webIapClient
      }
      await client.init()
    })()
  }
  return ready
}
