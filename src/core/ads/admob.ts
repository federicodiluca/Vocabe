import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob'
import type { AdsClient, RewardResult } from './types'

/** Google's public test unit — always safe to ship; swap via env before release. */
const REWARDED_UNIT_ID =
  import.meta.env.VITE_ADMOB_REWARDED_UNIT_ID_ANDROID || 'ca-app-pub-3940256099942544/5224354917'

let initialized = false

export const admobAdsClient: AdsClient = {
  async init() {
    if (initialized) return
    initialized = true
    await AdMob.initialize({ initializeForTesting: import.meta.env.DEV })
  },

  async showRewarded(): Promise<RewardResult> {
    try {
      await AdMob.prepareRewardVideoAd({ adId: REWARDED_UNIT_ID, isTesting: import.meta.env.DEV })
    } catch {
      return 'unavailable'
    }

    return new Promise<RewardResult>((resolve) => {
      let rewarded = false

      const rewardListener = AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        rewarded = true
      })
      const dismissListener = AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        rewardListener.then((l) => l.remove())
        dismissListener.then((l) => l.remove())
        resolve(rewarded ? 'rewarded' : 'closed')
      })
      const failListener = AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
        rewardListener.then((l) => l.remove())
        dismissListener.then((l) => l.remove())
        failListener.then((l) => l.remove())
        resolve('failed')
      })

      AdMob.showRewardVideoAd().catch(() => resolve('failed'))
    })
  },
}
