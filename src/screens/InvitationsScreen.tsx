import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Check, X } from 'lucide-react-native';

import { useAuth } from '@/context/AuthContext';
import { getPendingInvitations, respondInvitation } from '@/services/invitationService';

export default function InvitationsScreen() {
  const { token } = useAuth();
  
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadInvitations = async () => {
    if (!token) return;
    try {
      const data = await getPendingInvitations(token);
      setInvitations(data.convites);
    } catch (error) {
      console.warn('Erro ao carregar convites:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInvitations();
    }, [token])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadInvitations();
  };

  const handleRespond = async (invitationId: string, status: 'aceito' | 'recusado') => {
    if (!token) return;
    
    setProcessingId(invitationId);
    try {
      await respondInvitation(invitationId, status, token);
      Alert.alert('Sucesso', `Convite ${status} com sucesso!`);
      // Atualiza a lista removendo o convite respondido
      setInvitations(prev => prev.filter(inv => inv._id !== invitationId));
    } catch (error: any) {
      Alert.alert('Erro', error.message || `Falha ao ${status} convite.`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <View className="flex-1 bg-bg px-4 pt-4">
      {isLoading ? (
        <ActivityIndicator size="large" color="#A78BFA" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={invitations}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#A78BFA" />}
          ListEmptyComponent={
            <View className="items-center justify-center pt-20">
              <Text className="text-text-muted text-base">Você não tem convites pendentes.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="bg-surface p-4 rounded-xl mb-3 border border-border">
              <Text className="text-white font-semibold text-lg">{item.grupo.nome}</Text>
              <Text className="text-text-muted text-sm mt-1">
                Convite de: {item.remetente.nome}
              </Text>

              <View className="flex-row items-center gap-3 mt-4">
                <TouchableOpacity
                  onPress={() => handleRespond(item._id, 'recusado')}
                  disabled={processingId === item._id}
                  className="flex-1 bg-surface border border-border py-2.5 rounded-lg flex-row items-center justify-center gap-2"
                >
                  <X size={18} color="#EF4444" />
                  <Text className="text-text font-medium">Recusar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleRespond(item._id, 'aceito')}
                  disabled={processingId === item._id}
                  className="flex-1 bg-primary py-2.5 rounded-lg flex-row items-center justify-center gap-2"
                >
                  {processingId === item._id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Check size={18} color="#fff" />
                      <Text className="text-white font-medium">Aceitar</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
