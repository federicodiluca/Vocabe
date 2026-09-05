import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.vocabe.mobile',
  appName: 'Vocabe',
  webDir: 'dist',
  backgroundColor: '#faf7f2',
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // hidden from JS once the app has mounted
      backgroundColor: '#1c1917',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_notification',
      iconColor: '#b45309',
    },
  },
}

export default config
