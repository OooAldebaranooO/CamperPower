import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vechline_configurator',
  appName: 'Vechline',
  webDir: 'www',
  server: {
    allowNavigation: [
      'www.google.com',
      '*.google.com',
      'maps.googleapis.com',
      'maps.gstatic.com',
      'www.tools-cmc-ea.fr',
    ]
  }
};

export default config;