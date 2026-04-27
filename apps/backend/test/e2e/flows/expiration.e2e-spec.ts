test('auto expire escrow', async () => {
  const client = new TestClient();
  await client.init();

  const { token } = await (await client.post('/auth/test-login', { userId: 'user1' })).json();
  client.setToken(token);

  const escrow = await (await client.post('/escrow', {
    amount: 20,
    expiresAt: new Date(Date.now() + 1000),
  })).json();

  await new Promise((r) => setTimeout(r, 2000));

  const res = await client.get(`/escrow/${escrow.id}`);
  const body = await res.json();

  expect(body.status).toBe('EXPIRED');
});