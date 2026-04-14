import React from 'react';

import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';

import { Plus } from 'lucide-react-native';

import GroupCard from '@/components/GrupCard';

import { MOCK_GROUPS } from '@/Data/mockgroups';
 
export default function GroupScreen() {

  const handleCreate = () => console.log('criar grupo');

  const handleEdit = (id: string) => console.log('editar:', id);

  const handlePress = (id: string) => console.log('abrir grupo:', id);
 
  return (
<View className="flex-1 bg-bg">
<StatusBar barStyle="light-content" />
 
      {/* Header */}
<View className="px-4 pt-14 pb-5">
<View className="flex-row items-center justify-between">
<View>
<Text className="text-text text-2xl font-bold">Grupos</Text>
<Text className="text-text-muted text-sm mt-1">

              {MOCK_GROUPS.length} grupos criados
</Text>
</View>
 
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
 
      {/* List */}
<ScrollView

        showsVerticalScrollIndicator={false}

        contentContainerStyle={{ paddingBottom: 32 }}
>

        {MOCK_GROUPS.map((group) => (
<GroupCard

            key={group.id}

            group={group}

            onEdit={handleEdit}

            onPress={handlePress}

          />

        ))}
</ScrollView>
</View>

  );

}
 