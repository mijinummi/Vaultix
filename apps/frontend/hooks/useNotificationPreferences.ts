export function useNotificationPreferences() {

    const preferencesQuery =
  useQuery({
    queryKey: [
      'notification-preferences',
    ],
    queryFn: getPreferences,
  });

  const saveMutation =
  useMutation({
    mutationFn:
      updatePreferences,

    onSuccess() {
      toast.success(
        'Preferences updated',
      );
    },

    onError() {
      toast.error(
        'Failed to update preferences',
      );
    },
  });