import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vechline.app',
  appName: 'Vechline Configurator',
  webDir: 'www',
  server: {
    allowNavigation: [
      'www.tools-cmc-ea.fr'
    ]
  }
};

export default config;
