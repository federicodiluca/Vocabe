import { Purchases, LogLevel, ErrorCode } from '@revenuecat/purchases-js'
import type { CustomerInfo, PurchasesError, Package as RcPackage } from '@revenuecat/purchases-js'
import type { IapClient, PurchaseResult } from './types'

/** Must match the entitlement identifier configured in the RevenueCat dashboard. */
const ENTITLEMENT_ID = import.meta.env.VITE_REVENUECAT_ENTITLEMENT_ID || 'pro'
const API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY_WEB as string | undefined

/** RevenueCat has no concept of "no account" — we mint one id per browser and keep it. */
const ANON_ID_KEY = 'vocabe:rc-uid'

function anonymousUserId(): string {
  try {
    const existing = localStorage.getItem(ANON_ID_KEY)
    if (existing) return existing
    const id = Purchases.generateRevenueCatAnonymousAppUserId()
    localStorage.setItem(ANON_ID_KEY, id)
    return id
  } catch {
    return Purchases.generateRevenueCatAnonymousAppUserId()
  }
}

let pro = false
let priceLabel: string | null = null
let purchases: Purchases | null = null
const listeners = new Set<(isPro: boolean) => void>()

function setPro(next: boolean) {
  if (next === pro) return
  pro = next
  listeners.forEach((cb) => cb(pro))
}

function applyCustomerInfo(info: CustomerInfo) {
  setPro(Boolean(info.entitlements.active[ENTITLEMENT_ID]))
}

async function bestPackage(): Promise<RcPackage | null> {
  if (!purchases) return null
  const offerings = await purchases.getOfferings()
  const current = offerings.current
  return current?.lifetime ?? current?.availablePackages[0] ?? null
}

export const webIapClient: IapClient = {
  async init() {
    if (!API_KEY) {
      console.warn('[iap] VITE_REVENUECAT_API_KEY_WEB non impostata: acquisti disattivati.')
      return
    }
    Purchases.setLogLevel(import.meta.env.DEV ? LogLevel.Debug : LogLevel.Error)
    purchases = Purchases.configure({ apiKey: API_KEY, appUserId: anonymousUserId() })

    try {
      applyCustomerInfo(await purchases.getCustomerInfo())
      const pkg = await bestPackage()
      priceLabel = pkg?.webBillingProduct.currentPrice.formattedPrice ?? null
    } catch {
      /* offline at boot — retried on the next purchase attempt */
    }
  },

  isPro: () => pro,
  proPriceLabel: () => priceLabel,

  async purchasePro(): Promise<PurchaseResult> {
    if (!purchases) return 'failed'
    try {
      const rcPackage = await bestPackage()
      if (!rcPackage) return 'failed'
      const { customerInfo } = await purchases.purchase({ rcPackage })
      applyCustomerInfo(customerInfo)
      return 'purchased'
    } catch (e) {
      const err = e as PurchasesError
      return err.errorCode === ErrorCode.UserCancelledError ? 'cancelled' : 'failed'
    }
  },

  async restore(): Promise<PurchaseResult> {
    // Web Billing has no separate restore call — the browser's anonymous id already
    // maps to any purchase made from it, so re-reading customer info is the restore.
    if (!purchases) return 'failed'
    try {
      const info = await purchases.getCustomerInfo()
      applyCustomerInfo(info)
      return info.entitlements.active[ENTITLEMENT_ID] ? 'restored' : 'failed'
    } catch {
      return 'failed'
    }
  },

  onChange(cb) {
    listeners.add(cb)
    return () => listeners.delete(cb)
  },
}
