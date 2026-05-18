import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, UserPlus } from 'lucide-react-native';

import { AppStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/context/AuthContext';
import { searchUsers } from '@/services/userService';
import { sendInvitation } from '@/services/invitationService';
import { ApiUser } from '@/types/user';

export default function InviteUserScreen() {
  const { token } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, 'InviteUser'>>();
  const { groupId } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ApiUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [invitingId, setInvitingId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !token) return;
    
    setIsSearching(true);
    try {
      const data = await searchUsers(searchQuery, token);
      setResults(data.usuarios);
    } catch (error) {
      console.warn('Erro ao buscar usuários:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInvite = async (userId: string) => {
    if (!token) return;
    
    setInvitingId(userId);
    try {
      await sendInvitation(userId, groupId, token);
      Alert.alert('Sucesso', 'Convite enviado com sucesso!');
      // remove da lista de resultados
      setResults(prev => prev.filter(u => (u._id ?? u.id) !== userId));
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao enviar convite.');
    } finally {
      setInvitingId(null);
    }
  };

  return (
    <View className="flex-1 bg-bg px-4 pt-6">
      <View className="flex-row items-center bg-surface rounded-xl px-4 py-2 border border-border mb-6">
        <Search size={20} color="#A1A1AA" />
        <TextInput
          className="flex-1 text-text ml-3 py-2"
          placeholder="Buscar usuário por nome..."
          placeholderTextColor="#A1A1AA"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {isSearching && <ActivityIndicator size="small" color="#A78BFA" />}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item._id ?? item.id}
        ListEmptyComponent={
          !isSearching && searchQuery.length > 0 ? (
            <Text className="text-center text-text-muted mt-10">Nenhum usuário encontrado.</Text>
          ) : null
        }
        renderItem={({ item }) => {
          const userId = item._id ?? item.id;
          return (
            <View className="bg-surface p-4 rounded-xl mb-3 flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-white font-medium text-base">{item.nome}</Text>
                <Text className="text-text-muted text-sm">{item.email}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleInvite(userId)}
                disabled={invitingId === userId}
                className="bg-primary px-3 py-2 rounded-lg flex-row items-center gap-2"
              >
                {invitingId === userId ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <UserPlus size={16} color="#fff" />
                    <Text className="text-white font-semibold text-sm">Convidar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
