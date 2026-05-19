import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notificationService';
import { respondInvitation } from '../services/invitationService';
import { colors } from '../theme/colors';
import { AppNotification, AppNotificationType } from '../types/notification';

const getNotificationStyle = (type: AppNotificationType) => {
  switch (type) {
    case 'alerta_emergencia':
      return { icon: 'warning', color: colors.emergency, bg: colors.emergencyMuted };
    case 'convite_grupo':
      return { icon: 'people', color: colors.primary, bg: colors.primaryMuted };
    default:
      return { icon: 'information-circle', color: colors.textMuted, bg: colors.surface3 };
  }
};

function getRelativeTime(value: string): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs)) return '';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Ontem';
  return `${days} dias`;
}

function getInvitationStatus(item: AppNotification): 'pendente' | 'aceito' | 'recusado' | null {
  if (item.tipo !== 'convite_grupo' || !item.convite) return null;
  return item.convite.status;
}

export default function NotificationsScreen() {
  const { token } = useAuth();
  const { refreshUnreadCount, setUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    if (!token) return;

    try {
      const data = await getNotifications(token);
      setNotifications(data.notificacoes);
      setUnreadCount(data.naoLidas);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao carregar notificacoes.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [setUnreadCount, token]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const markAsRead = async (item: AppNotification) => {
    if (!token || item.lida) return;

    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === item._id ? { ...notification, lida: true } : notification
      )
    );
    setUnreadCount((current) => Math.max(0, current - 1));

    try {
      await markNotificationAsRead(item._id, token);
      refreshUnreadCount();
    } catch (error) {
      console.warn('Erro ao marcar notificacao como lida:', error);
      loadNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token || notifications.length === 0) return;

    try {
      await markAllNotificationsAsRead(token);
      setNotifications((prev) => prev.map((item) => ({ ...item, lida: true })));
      setUnreadCount(0);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao marcar notificacoes como lidas.');
    }
  };

  const handleRespondInvite = async (
    item: AppNotification,
    status: 'aceito' | 'recusado'
  ) => {
    if (!token || !item.convite?._id) return;

    setProcessingId(item._id);
    try {
      await respondInvitation(item.convite._id, status, token);
      await markNotificationAsRead(item._id, token);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === item._id
            ? { ...notification, lida: true, convite: { ...notification.convite!, status } }
            : notification
        )
      );
      refreshUnreadCount();
      Alert.alert('Sucesso', `Convite ${status} com sucesso.`);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao responder convite.');
    } finally {
      setProcessingId(null);
    }
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const styleInfo = getNotificationStyle(item.tipo);
    const invitationStatus = getInvitationStatus(item);
    const canRespondInvite = invitationStatus === 'pendente';

    return (
      <TouchableOpacity
        style={[styles.card, !item.lida && styles.cardUnread]}
        onPress={() => markAsRead(item)}
        activeOpacity={0.85}
      >
        <View style={[styles.iconContainer, { backgroundColor: styleInfo.bg }]}>
          <Ionicons
            name={styleInfo.icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color={styleInfo.color}
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, !item.lida && styles.titleUnread]} numberOfLines={2}>
              {item.titulo}
            </Text>
            <Text style={styles.timestamp}>{getRelativeTime(item.createdAt)}</Text>
          </View>

          <Text style={styles.message} numberOfLines={3}>
            {item.mensagem}
          </Text>

          {canRespondInvite && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.inviteButton, styles.declineButton]}
                disabled={processingId === item._id}
                onPress={() => handleRespondInvite(item, 'recusado')}
              >
                <Text style={styles.declineText}>Recusar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.inviteButton, styles.acceptButton]}
                disabled={processingId === item._id}
                onPress={() => handleRespondInvite(item, 'aceito')}
              >
                {processingId === item._id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.acceptText}>Aceitar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {invitationStatus && invitationStatus !== 'pendente' && (
            <Text style={styles.statusText}>Convite {invitationStatus}</Text>
          )}
        </View>

        {!item.lida && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Notificacoes</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead} activeOpacity={0.75}>
          <Text style={styles.toolbarAction}>Marcar lidas</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContainer,
            notifications.length === 0 && styles.emptyListContainer,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={36} color={colors.textDim} />
              <Text style={styles.emptyText}>Voce ainda nao tem notificacoes.</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  toolbarTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  toolbarAction: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
  loader: {
    marginTop: 40,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
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
    alignItems: 'flex-start',
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
    marginTop: 2,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  inviteButton: {
    minHeight: 38,
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    minWidth: 86,
  },
  declineText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  acceptText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  statusText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
    textTransform: 'capitalize',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
    marginTop: 20,
  },
});
