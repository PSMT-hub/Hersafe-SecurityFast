import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-bg">
      {/* Avatar */}
      <View className="w-24 h-24 rounded-full bg-primary-muted items-center justify-center mb-4 border-2 border-primary">
        <Text className="text-4xl">👤</Text>
      </View>

      <Text className="text-2xl font-bold text-text">Perfil</Text>
      <Text className="text-base text-text-muted mt-2">Configurações do usuário</Text>
    </View>
  );
}
