import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Users, Users as DefaultIcon } from 'lucide-react-native';

type Props = {
  group: {
    id: string;
    name: string;
    description?: string;
    memberCount: number;
    members?: any[];
  };
  onEdit: (id: string) => void;
  onPress: (id: string) => void;
};
 
const VISIBLE_AVATARS = 4;
const AVATAR_OFFSET = -10;
 
export default function GroupCard({ group, onEdit, onPress }: Props) {
  const members = group.members || [];
  const visibleMembers = members.slice(0, VISIBLE_AVATARS);
  const remaining = group.memberCount > members.length ? group.memberCount - visibleMembers.length : members.length - visibleMembers.length;
  const Icon = DefaultIcon;
 
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
<View
                className="w-full h-full bg-primary items-center justify-center"
              >
                <Text className="text-white font-bold">{member?.nome?.charAt(0) || 'U'}</Text>
              </View>
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
            {group.memberCount} {group.memberCount === 1 ? 'membro' : 'membros'}
</Text>
</View>
</View>
</TouchableOpacity>
  );
}