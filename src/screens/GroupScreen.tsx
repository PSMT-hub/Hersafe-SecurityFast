import React from 'react';
import { View, Text } from 'react-native';

export default function GroupScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <Text className="text-3xl font-bold text-text">Grupos</Text>
      <Text className="text-base text-text-muted mt-2">Gerencie seus grupos de confiança.</Text>
    </View>
  );
}
