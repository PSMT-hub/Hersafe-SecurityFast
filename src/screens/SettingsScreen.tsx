import React from 'react';
import { View, Text, Switch } from 'react-native';
import { colors } from '../theme/colors';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  return (
    <View className="flex-1 p-6 bg-bg">
      <Text className="text-2xl font-bold text-text mb-6">Configurações</Text>

      {/* Card: Notificações */}
      <View className="flex-row items-center justify-between p-4 bg-surface rounded-lg border border-border mb-3">
        <View>
          <Text className="text-base font-semibold text-text">Notificações</Text>
          <Text className="text-sm text-text-muted mt-0.5">Receber alertas de segurança</Text>
        </View>
        <Switch
          trackColor={{ false: colors.surface3, true: colors.primaryMuted }}
          thumbColor={notificationsEnabled ? colors.primary : colors.textDim}
          onValueChange={() => setNotificationsEnabled(prev => !prev)}
          value={notificationsEnabled}
        />
      </View>

      {/* Card: Sair */}
      <View className="p-4 bg-surface rounded-lg border border-border">
        <Text className="text-base font-semibold text-danger">Sair da conta</Text>
        <Text className="text-sm text-text-muted mt-0.5" >Encerrar sessão atual</Text>
      </View>
    </View>
  );
}
