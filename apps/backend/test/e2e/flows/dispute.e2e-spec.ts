test('escrow dispute resolution', async ({ request }) => {
  const client = new TestClient();
  await client.init();

  const { token } = await (await client.post('/auth/test-login', { userId: 'user1' })).json();
  client.setToken(token);

  const escrow = await (await client.post('/escrow', { amount: 50 })).json();

  await client.post(`/escrow/${escrow.id}/fund`, {});

  const dispute = await client.post(`/escrow/${escrow.id}/dispute`, {
    reason: 'Service not delivered',
  });

  expect(dispute.status()).toBe(201);
});