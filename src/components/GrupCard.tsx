import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Pencil, Users } from 'lucide-react-native';
import { Group } from '@/data/mockGroups';
 
type Props = {
  group: Group;
  onEdit: (id: string) => void;
  onPress: (id: string) => void;
};
 
const VISIBLE_AVATARS = 4;
const AVATAR_OFFSET = -10;
 
export default function GroupCard({ group, onEdit, onPress }: Props) {
  const visibleMembers = group.members.slice(0, VISIBLE_AVATARS);
  const remaining = group.members.length - VISIBLE_AVATARS;
  const Icon = group.icon;
 
  return (
<TouchableOpacity
      onPress={() => onPress(group.id)}
      activeOpacity={0.8}
      className="bg-surface border border-border rounded-2xl p-4 mb-3 mx-4"
>
      {/* Header */}
<View className="flex-row items-center justify-between mb-3">
<View className="flex-row items-center gap-3">
<View className="w-11 h-11 rounded-xl bg-primary-muted items-center justify-center">
<Icon size={20} color="#A78BFA" />
</View>
<View>
<Text className="text-text font-semibold text-base">{group.name}</Text>
<Text className="text-text-muted text-xs mt-0.5">{group.description}</Text>
</View>
</View>
 
        <TouchableOpacity
          onPress={() => onEdit(group.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-8 h-8 rounded-lg bg-surface-2 items-center justify-center"
>
<Pencil size={14} color="#9B98B8" />
</TouchableOpacity>
</View>
 
      {/* Divider */}
<View className="h-px bg-border mb-3" />
 
      {/* Footer */}
<View className="flex-row items-center justify-between">
<View className="flex-row items-center">
          {visibleMembers.map((member, index) => (
<View
              key={member.id}
              className="w-8 h-8 rounded-full border-2 border-surface overflow-hidden"
              style={{ marginLeft: index === 0 ? 0 : AVATAR_OFFSET }}
>
<Image
                source={{ uri: member.avatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
</View>
          ))}
          {remaining > 0 && (
<View
              className="w-8 h-8 rounded-full border-2 border-surface bg-surface-3 items-center justify-center"
              style={{ marginLeft: AVATAR_OFFSET }}
>
<Text className="text-text-muted text-xs font-semibold">+{remaining}</Text>
</View>
          )}
</View>
 
        <View className="flex-row items-center gap-1.5">
<Users size={13} color="#9B98B8" />
<Text className="text-text-muted text-xs">
            {group.members.length} {group.members.length === 1 ? 'membro' : 'membros'}
</Text>
</View>
</View>
</TouchableOpacity>
  );
}