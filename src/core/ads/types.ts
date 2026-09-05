export type RewardResult = 'rewarded' | 'closed' | 'failed' | 'unavailable'

export interface AdsClient {
  init(): Promise<void>
  /** Shows a rewarded video; resolves once the ad is closed. */
  showRewarded(): Promise<RewardResult>
}
