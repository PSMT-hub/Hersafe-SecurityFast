import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Dimensions, RefreshControl } from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserPlus, Trash2 } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { AppStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/context/AuthContext';
import { getGroupById, removeMember, deleteGroup } from '@/services/groupService';

export default function GroupDetailScreen() {
  const { token, user: currentUser } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, 'GroupDetail'>>();
  const { groupId } = route.params;

  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadGroup = async (silent = false) => {
    if (!token) return;
    if (!silent) setIsLoading(true);
    try {
      const data = await getGroupById(groupId, token);
      setGroup(data.grupo);
    } catch (error: any) {
      if (!silent) {
        Alert.alert('Erro', error.message || 'Falha ao carregar detalhes do grupo.');
        navigation.goBack();
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroup();
      // Auto-refresh a cada 30 segundos enquanto a tela está em foco
      const interval = setInterval(() => loadGroup(true), 30 * 1000);
      return () => clearInterval(interval);
    }, [groupId, token])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadGroup();
  };

  const handleInvite = () => {
    navigation.navigate('InviteUser', { groupId });
  };

  const handleRemoveMember = (memberId: string) => {
    Alert.alert('Confirmar', 'Deseja realmente remover este membro?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Remover', 
        style: 'destructive',
        onPress: async () => {
          try {
            await removeMember(groupId, memberId, token!);
            loadGroup();
          } catch (e: any) {
            Alert.alert('Erro', e.message);
          }
        }
      }
    ]);
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      'Deletar Grupo',
      `Tem certeza que deseja deletar "${group?.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGroup(groupId, token!);
              navigation.goBack();
            } catch (e: any) {
              Alert.alert('Erro', e.message);
            }
          },
        },
      ]
    );
  };

  if (isLoading || !group) {
    return (
      <View className="flex-1 bg-bg justify-center items-center">
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  // Compara IDs usando String() nos dois lados para evitar problemas com ObjectId vs string
  const creatorId = typeof group.criador === 'object' ? String(group.criador._id) : String(group.criador);
  const isCreator = creatorId === String(currentUser?.id);

  // Filtrar membros com localização válida
  const membersWithLocation = (group.membros || []).filter((m: any) => m.ultimaLocalizacao && m.ultimaLocalizacao.latitude && m.ultimaLocalizacao.longitude);

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#A78BFA" />
      }
    >
      <View className="px-4 pt-6 pb-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white text-2xl font-bold">{group.nome}</Text>
            {group.descricao ? (
              <Text className="text-text-muted mt-2">{group.descricao}</Text>
            ) : null}
          </View>
          {isCreator && (
            <TouchableOpacity
              onPress={handleDeleteGroup}
              className="p-2 mt-1 bg-red-500/10 rounded-xl"
            >
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Mapa */}
      {membersWithLocation.length > 0 ? (
        <View className="h-64 mt-2 mb-6">
          <MapView
            provider={PROVIDER_DEFAULT}
            style={{ width: Dimensions.get('window').width, height: '100%' }}
            initialRegion={{
              latitude: membersWithLocation[0].ultimaLocalizacao.latitude,
              longitude: membersWithLocation[0].ultimaLocalizacao.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {membersWithLocation.map((member: any) => (
              <Marker
                key={member._id}
                coordinate={{
                  latitude: member.ultimaLocalizacao.latitude,
                  longitude: member.ultimaLocalizacao.longitude,
                }}
                title={member.nome}
                description={`Atualizado em: ${new Date(member.ultimaLocalizacao.atualizadoEm).toLocaleTimeString()}`}
              />
            ))}
          </MapView>
        </View>
      ) : (
        <View className="h-40 mt-2 mb-6 bg-surface items-center justify-center">
          <Text className="text-text-muted">Nenhuma localização disponível</Text>
        </View>
      )}

      {/* Membros */}
      <View className="px-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-lg font-semibold">Membros ({group.membros?.length || 0})</Text>
          <TouchableOpacity onPress={handleInvite} className="bg-primary/20 px-3 py-1.5 rounded-full flex-row items-center gap-1">
            <UserPlus size={16} color="#A78BFA" />
            <Text className="text-primary font-medium text-sm">Convidar</Text>
          </TouchableOpacity>
        </View>

        {group.membros?.map((member: any) => {
          const isMe = String(member._id) === String(currentUser?.id);
          const isMemberCreator = String(member._id) === creatorId;

          return (
            <View key={member._id} className="bg-surface p-4 rounded-xl mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
                  <Text className="text-primary font-bold text-base">{member.nome.charAt(0).toUpperCase()}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium text-base">
                    {member.nome} {isMe ? '(Você)' : ''}
                  </Text>
                  <Text className="text-text-muted text-xs">
                    {isMemberCreator ? 'Administrador' : 'Membro'}
                  </Text>
                </View>
              </View>

              {(!isMemberCreator && (isCreator || isMe)) && (
                <TouchableOpacity onPress={() => handleRemoveMember(member._id)} className="p-2">
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
