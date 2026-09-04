export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
    cleartext?: boolean;
    url?: string;
  };
  android?: {
    allowMixedContent?: boolean;
    backgroundColor?: string;
    buildOptions?: {
      keystorePath?: string;
      releaseType?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const config: CapacitorConfig = {
  appId: 'com.aether.launcher',
  appName: 'AetherOS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#020617',
    buildOptions: {
      keystorePath: undefined,
      releaseType: 'APK'
    }
  }
};

export default config;
