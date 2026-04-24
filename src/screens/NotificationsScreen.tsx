import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type NotificationType = 'arrival' | 'departure' | 'emergency' | 'group' | 'info';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Ana chegou em casa',
    message: 'Ana chegou no local "Casa" em segurança.',
    type: 'arrival',
    timestamp: 'Agora mesmo',
    read: false,
  },
  {
    id: '2',
    title: 'Laura acionou o botão de emergência',
    message: 'Atenção! Laura precisa de ajuda. Localização compartilhada.',
    type: 'emergency',
    timestamp: 'Há 5 minutos',
    read: false,
  },
  {
    id: '3',
    title: 'João saiu do trabalho',
    message: 'João saiu do local "Trabalho".',
    type: 'departure',
    timestamp: 'Há 15 minutos',
    read: true,
  },
  {
    id: '4',
    title: 'Nova Adição de Grupo',
    message: 'Julia foi adicionada no grupo "Família".',
    type: 'group',
    timestamp: 'Há 2 horas',
    read: true,
  },
  {
    id: '5',
    title: 'Atualização do Sistema',
    message: 'Novos recursos de segurança foram adicionados.',
    type: 'info',
    timestamp: 'Ontem',
    read: true,
  },
];

const getNotificationStyle = (type: NotificationType) => {
  switch (type) {
    case 'arrival':
      return { icon: 'home', color: colors.safe, bg: colors.safeMuted };
    case 'departure':
      return { icon: 'walk', color: colors.warning, bg: colors.warningMuted };
    case 'emergency':
      return { icon: 'warning', color: colors.emergency, bg: colors.emergencyMuted };
    case 'group':
      return { icon: 'people', color: colors.primary, bg: colors.primaryMuted };
    default:
      return { icon: 'information-circle', color: colors.textMuted, bg: colors.surface3 };
  }
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const styleInfo = getNotificationStyle(item.type);

    return (
      <TouchableOpacity
        style={[styles.card, !item.read && styles.cardUnread]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: styleInfo.bg }]}>
          <Ionicons name={styleInfo.icon as keyof typeof Ionicons.glyphMap} size={24} color={styleInfo.color} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, !item.read && styles.titleUnread]}>{item.title}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
        {!item.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cardUnread: {
    backgroundColor: colors.surface2,
    borderColor: colors.borderFocus,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  titleUnread: {
    color: colors.primaryLight,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textDim,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
});
