import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserPlus, MapPin, Trash2 } from 'lucide-react-native';
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

  const loadGroup = async () => {
    if (!token) return;
    try {
      const data = await getGroupById(groupId, token);
      setGroup(data.grupo);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao carregar detalhes do grupo.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroup();
    }, [groupId, token])
  );

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

  if (isLoading || !group) {
    return (
      <View className="flex-1 bg-bg justify-center items-center">
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  const isCreator = typeof group.criador === 'object' && group.criador._id === currentUser?.id;

  // Filtrar membros com localização válida
  const membersWithLocation = (group.membros || []).filter((m: any) => m.ultimaLocalizacao && m.ultimaLocalizacao.latitude && m.ultimaLocalizacao.longitude);

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-4 pt-6 pb-4">
        <Text className="text-white text-2xl font-bold">{group.nome}</Text>
        {group.descricao ? (
          <Text className="text-text-muted mt-2">{group.descricao}</Text>
        ) : null}
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
          const isMe = member._id === currentUser?.id;
          const isMemberCreator = typeof group.criador === 'object' && group.criador._id === member._id;

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
