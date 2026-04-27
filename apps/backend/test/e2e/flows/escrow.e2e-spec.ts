import { test, expect } from '@playwright/test';
import { TestClient } from '../utils/test-client';

test.describe('Escrow Flow', () => {
  let client: TestClient;

  test.beforeEach(async () => {
    client = new TestClient();
    await client.init();

    const auth = await client.post('/auth/test-login', { userId: 'user1' });
    const { token } = await auth.json();
    client.setToken(token);
  });

  test('create → fund → release', async () => {
    const create = await client.post('/escrow', {
      amount: 100,
      currency: 'USDC',
    });

    expect(create.status()).toBe(201);
    const escrow = await create.json();

    const fund = await client.post(`/escrow/${escrow.id}/fund`, {});
    expect(fund.status()).toBe(200);

    const release = await client.post(`/escrow/${escrow.id}/release`, {});
    expect(release.status()).toBe(200);
  });
});