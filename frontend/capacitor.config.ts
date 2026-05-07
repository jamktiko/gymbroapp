import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'laanhema.dev.gymbro.app',
  appName: 'GymBroApp',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '949356362637-8k499680i9rc1pi3is0d3d2jd61lli5k.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    }
  }
};

export default config;