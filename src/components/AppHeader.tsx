import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/RootNavigator';
import logo from '../assets/image.png';
import { useNotifications } from '../context/NotificationContext';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { unreadCount } = useNotifications();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8 },
      ]}
    >
      {/* ── Logo / Nome do app ──────────────────────── */}
      <View style={styles.logoRow}>
        {/* Logo oficial ao lado do nome */}
        <Image source={logo} style={styles.logoImage} resizeMode="contain" />
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
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
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
  logoImage: {
    width: 24,
    height: 24,
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
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.emergency,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surface,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
  },
});
