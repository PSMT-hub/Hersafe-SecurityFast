import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { Plus, Bell } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import GroupCard from '@/components/GrupCard';
import { getGroups } from '@/services/groupService';
import { useAuth } from '@/context/AuthContext';
import { Group } from '@/types/group';
import { AppStackParamList } from '@/navigation/RootNavigator';
 
export default function GroupScreen() {
  const { token } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadGroups = async () => {
    if (!token) return;
    try {
      const data = await getGroups(token);
      setGroups(data.grupos);
    } catch (error) {
      console.warn('Erro ao carregar grupos:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [token])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadGroups();
  };

  const handleCreate = () => {
    navigation.navigate('CreateGroup');
  };

  const handlePress = (id: string) => {
    navigation.navigate('GroupDetail', { groupId: id });
  };

  const handleOpenInvitations = () => {
    navigation.navigate('Invitations');
  };
 
  return (
<View className="flex-1 bg-bg">
<StatusBar barStyle="light-content" />
 
      {/* Header */}
<View className="px-4 pt-14 pb-5">
<View className="flex-row items-center justify-between">
<View>
<Text className="text-text text-2xl font-bold">Grupos</Text>
<Text className="text-text-muted text-sm mt-1">
              {groups.length} grupos
</Text>
</View>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={handleOpenInvitations} className="bg-surface p-2.5 rounded-full border border-border">
              <Bell size={20} color="#F0EFFE" />
            </TouchableOpacity>
 
          <TouchableOpacity

            onPress={handleCreate}

            activeOpacity={0.8}

            className="flex-row items-center gap-2 bg-primary px-4 py-2.5 rounded-xl"
>
<Plus size={16} color="#fff" />
<Text className="text-white font-semibold text-sm">Novo grupo</Text>
</TouchableOpacity>
</View>
</View>
</View>
 
      {/* List */}
<ScrollView

        showsVerticalScrollIndicator={false}

        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#A78BFA" />
        }
>
        {isLoading ? (
          <ActivityIndicator size="large" color="#A78BFA" style={{ marginTop: 40 }} />
        ) : groups.length === 0 ? (
          <View className="items-center justify-center pt-20">
            <Text className="text-text-muted text-base">Você não participa de nenhum grupo.</Text>
          </View>
        ) : (
          groups.map((group) => (
            <GroupCard
              key={group._id}
              group={{
                id: group._id,
                name: group.nome,
                memberCount: Array.isArray(group.membros) ? group.membros.length : 0,
              }}
              onEdit={() => {}}
              onPress={handlePress}
            />
          ))
        )}
</ScrollView>
</View>

  );

}
 