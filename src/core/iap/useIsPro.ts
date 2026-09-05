import { useSyncExternalStore } from 'react'
import { iap } from './index'

/** Re-renders whenever the Pro entitlement changes (purchase, restore, renewal, refund…). */
export function useIsPro(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => iap().onChange(() => onStoreChange()),
    () => iap().isPro(),
    () => false,
  )
}
