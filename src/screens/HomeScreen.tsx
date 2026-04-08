import React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <Text className="text-3xl font-bold text-text">Início</Text>
      <Text className="text-base text-text-muted mt-2">Bem-vindo ao HERSAFE!</Text>
    </View>
  );
}
