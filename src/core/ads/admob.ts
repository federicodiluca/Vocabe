import { AdMob, AdmobConsentStatus, RewardAdPluginEvents } from '@capacitor-community/admob'
import type { AdsClient, RewardResult } from './types'

/** Google's public test unit — always safe to ship; swap via env before release. */
const REWARDED_UNIT_ID =
  import.meta.env.VITE_ADMOB_REWARDED_UNIT_ID_ANDROID || 'ca-app-pub-3940256099942544/5224354917'

let initialized = false

/** iOS App Tracking Transparency + Google UMP consent (required in the EU). Best-effort. */
async function requestConsent() {
  try {
    await AdMob.requestTrackingAuthorization()
  } catch {
    /* iOS < 14 or not available */
  }
  try {
    const info = await AdMob.requestConsentInfo()
    if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) {
      await AdMob.showConsentForm()
    }
  } catch {
    /* consent SDK unavailable — Google serves non-personalized ads by default */
  }
}

export const admobAdsClient: AdsClient = {
  async init() {
    if (initialized) return
    initialized = true
    await requestConsent()
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
