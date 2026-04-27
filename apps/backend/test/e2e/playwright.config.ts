import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './flows',
  timeout: 30_000,
  retries: 2, // prevent flakiness
  workers: 4,
  reporter: [['list'], ['html']],
  use: {
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  globalSetup: require.resolve('./global-setup'),
});