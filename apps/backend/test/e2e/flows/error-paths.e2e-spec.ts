test('unauthorized access blocked', async () => {
  const client = new TestClient();
  await client.init();

  const res = await client.get('/admin/users');

  expect(res.status()).toBe(401);
});