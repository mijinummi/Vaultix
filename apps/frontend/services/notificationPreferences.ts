export async function getPreferences() {
  const response = await api.get(
    '/notifications/preferences',
  );

  return response.data;
}

export async function updatePreferences(
  preferences: NotificationPreference[],
) {
  const response = await api.put(
    '/notifications/preferences',
    {
      preferences,
    },
  );

  return response.data;
}

