export type PurchaseResult = 'purchased' | 'restored' | 'cancelled' | 'failed'

export interface IapClient {
  init(): Promise<void>
  isPro(): boolean
  /** Formatted price for the Pro unlock, e.g. "2,49 €" — null until the store responds. */
  proPriceLabel(): string | null
  purchasePro(): Promise<PurchaseResult>
  restore(): Promise<PurchaseResult>
  /** Notifies when entitlement status changes (purchase, restore, renewal, refund…). */
  onChange(cb: (isPro: boolean) => void): () => void
}
