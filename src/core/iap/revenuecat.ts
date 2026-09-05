import { Purchases, LOG_LEVEL, PURCHASES_ERROR_CODE } from '@revenuecat/purchases-capacitor'
import type { CustomerInfo, PurchasesError, PurchasesPackage } from '@revenuecat/purchases-capacitor'
import type { IapClient, PurchaseResult } from './types'

/** Must match the entitlement identifier configured in the RevenueCat dashboard. */
const ENTITLEMENT_ID = import.meta.env.VITE_REVENUECAT_ENTITLEMENT_ID || 'pro'
const API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY_ANDROID as string | undefined

let pro = false
let priceLabel: string | null = null
const listeners = new Set<(isPro: boolean) => void>()

function setPro(next: boolean) {
  if (next === pro) return
  pro = next
  listeners.forEach((cb) => cb(pro))
}

function applyCustomerInfo(info: CustomerInfo) {
  setPro(Boolean(info.entitlements.active[ENTITLEMENT_ID]))
}

async function bestPackage(): Promise<PurchasesPackage | null> {
  const offerings = await Purchases.getOfferings()
  const current = offerings.current
  return current?.lifetime ?? current?.availablePackages[0] ?? null
}

export const revenueCatIapClient: IapClient = {
  async init() {
    if (!API_KEY) {
      console.warn('[iap] VITE_REVENUECAT_API_KEY_ANDROID non impostata: acquisti disattivati.')
      return
    }
    await Purchases.setLogLevel({ level: import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR })
    await Purchases.configure({ apiKey: API_KEY })
    Purchases.addCustomerInfoUpdateListener((info) => applyCustomerInfo(info))

    try {
      const { customerInfo } = await Purchases.getCustomerInfo()
      applyCustomerInfo(customerInfo)
      const pkg = await bestPackage()
      priceLabel = pkg?.product.priceString ?? null
    } catch {
      /* offline at boot — retried on the next purchase/restore attempt */
    }
  },

  isPro: () => pro,
  proPriceLabel: () => priceLabel,

  async purchasePro(): Promise<PurchaseResult> {
    if (!API_KEY) return 'failed'
    try {
      const aPackage = await bestPackage()
      if (!aPackage) return 'failed'
      const { customerInfo } = await Purchases.purchasePackage({ aPackage })
      applyCustomerInfo(customerInfo)
      return 'purchased'
    } catch (e) {
      const err = e as PurchasesError
      return err.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ? 'cancelled' : 'failed'
    }
  },

  async restore(): Promise<PurchaseResult> {
    if (!API_KEY) return 'failed'
    try {
      const { customerInfo } = await Purchases.restorePurchases()
      applyCustomerInfo(customerInfo)
      return customerInfo.entitlements.active[ENTITLEMENT_ID] ? 'restored' : 'failed'
    } catch {
      return 'failed'
    }
  },

  onChange(cb) {
    listeners.add(cb)
    return () => listeners.delete(cb)
  },
}
