export async function getWebhooks() {
  const response =
    await api.get('/webhooks');

  return response.data;
}

export async function createWebhook(
  payload: CreateWebhookDto,
) {
  const response =
    await api.post(
      '/webhooks',
      payload,
    );

  return response.data;
}

export async function deleteWebhook(
  id: string,
) {
  await api.delete(
    `/webhooks/${id}`,
  );
}