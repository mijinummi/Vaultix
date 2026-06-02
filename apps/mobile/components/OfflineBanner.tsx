import React from "react";
import { View, Text } from "react-native";

type Props = {
  visible: boolean;
};

export default function OfflineBanner({
  visible,
}: Props) {

  if (!visible) return null;

  return (
    <View className="bg-yellow-500 px-4 py-3">
      <Text className="text-black text-sm font-medium text-center">
        Offline mode — showing cached data
      </Text>
    </View>
  );
}