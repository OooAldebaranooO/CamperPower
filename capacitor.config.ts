import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vechline_configurator',
  appName: 'Vechline Configurator',
  webDir: 'www',
  server: {
    allowNavigation: [
      'www.google.com',
      '*.google.com',
      'maps.googleapis.com',
      'maps.gstatic.com',
      'www.tools-cmc-ea.fr',
      'nominatim.openstreetmap.org',
      'geo.api.gouv.fr',
    ]
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      showDuration: 2000,
    }
  }
};

export default config;