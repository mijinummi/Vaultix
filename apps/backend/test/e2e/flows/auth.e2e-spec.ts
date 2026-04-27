import { test, expect } from '@playwright/test';
import { TestClient } from '../utils/test-client';

test.describe('Auth Flow', () => {
  let client: TestClient;

  test.beforeEach(async () => {
    client = new TestClient();
    await client.init();
  });

  test('should complete wallet auth flow', async () => {
    const challengeRes = await client.post('/auth/challenge', {
      wallet: 'TEST_WALLET',
    });

    expect(challengeRes.status()).toBe(201);

    const { challenge } = await challengeRes.json();

    const verifyRes = await client.post('/auth/verify', {
      wallet: 'TEST_WALLET',
      signature: 'MOCK_SIGNATURE',
      challenge,
    });

    expect(verifyRes.status()).toBe(201);

    const body = await verifyRes.json();

    expect(body.accessToken).toBeDefined();
  });
});