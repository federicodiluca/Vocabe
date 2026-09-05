import type { IapClient } from './types'

/** Used on the web build — no store to purchase from. */
export const noopIapClient: IapClient = {
  async init() {},
  isPro: () => false,
  proPriceLabel: () => null,
  async purchasePro() {
    return 'failed'
  },
  async restore() {
    return 'failed'
  },
  onChange: () => () => {},
}
