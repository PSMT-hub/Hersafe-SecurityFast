import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

interface AppHeaderProps {
  /** Callback ao pressionar o ícone de ação no canto direito */
  onActionPress?: () => void;
  /** Ícone do botão de ação (padrão: sino de notificações) */
  actionIcon?: keyof typeof Ionicons.glyphMap;
}

export default function AppHeader({
  onActionPress,
  actionIcon = 'notifications-outline',
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8 },
      ]}
    >
      {/* ── Logo / Nome do app ──────────────────────── */}
      <View style={styles.logoRow}>
        {/* Ícone escudo pequeno ao lado do nome */}
        <Ionicons name="shield-half-outline" size={18} color={colors.primaryLight} />
        <Text style={styles.logoText}>HER</Text>
        <Text style={styles.logoAccent}>SAFE</Text>
      </View>

      {/* ── Ação direita: ícone com fundo primary ──── */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onActionPress}
        activeOpacity={0.75}
      >
        <Ionicons name={actionIcon} size={18} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    backgroundColor:  colors.surface,
    paddingHorizontal: 20,
    paddingBottom:    12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  logoText: {
    fontSize:    18,
    fontWeight:  '700',
    color:       colors.text,
    letterSpacing: 1.5,
    marginLeft:  4,
  },
  logoAccent: {
    fontSize:    18,
    fontWeight:  '700',
    color:       colors.primary,
    letterSpacing: 1.5,
  },
  actionButton: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: colors.primaryMuted,
    alignItems:      'center',
    justifyContent:  'center',
    // Brilho sutil no botão
    borderWidth:     1,
    borderColor:     colors.primaryDark,
  },
});
