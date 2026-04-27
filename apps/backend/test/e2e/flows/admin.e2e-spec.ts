test('admin operations', async () => {
  const client = new TestClient();
  await client.init();

  const { token } = await (await client.post('/auth/admin-login', {})).json();
  client.setToken(token);

  const users = await client.get('/admin/users');
  expect(users.status()).toBe(200);

  const escrows = await client.get('/admin/escrows');
  expect(escrows.status()).toBe(200);
});