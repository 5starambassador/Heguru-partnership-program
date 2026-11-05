import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.heguruindiapartnershipprogram.app',
  appName: 'Heguru Partnership Program',
  webDir: 'public',
  server: {
    url: 'https://partner.heguruindia.com', // Production Live URL
    cleartext: true
  },
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#DC2626", // Heguru Red
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
