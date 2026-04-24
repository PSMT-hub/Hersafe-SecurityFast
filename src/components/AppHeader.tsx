import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

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

      {/* ── Ações direita (Dicas e Notificações) ──── */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Tips')}
          activeOpacity={0.75}
        >
          <Ionicons name="bulb-outline" size={18} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.75}
        >
          <Ionicons name="notifications-outline" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
