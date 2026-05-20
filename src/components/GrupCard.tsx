import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Users, ChevronRight } from 'lucide-react-native';

type Props = {
  group: {
    id: string;
    name: string;
    description?: string;
    memberCount: number;
    members?: any[];
  };
  onEdit?: (id: string) => void;
  onPress: (id: string) => void;
};

const VISIBLE_AVATARS = 4;
const AVATAR_OFFSET = -10;

const AVATAR_COLORS = [
  'bg-purple-600',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
];

export default function GroupCard({ group, onPress }: Props) {
  const members = group.members || [];
  const visibleMembers = members.slice(0, VISIBLE_AVATARS);
  const remaining = Math.max(0, group.memberCount - visibleMembers.length);

  return (
    <TouchableOpacity
      onPress={() => onPress(group.id)}
      activeOpacity={0.85}
      className="bg-surface border border-surface-3/60 rounded-2xl p-4 mb-3.5 mx-4 shadow-sm"
    >
      {/* Header Info */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-2">
          {/* Icon Container */}
          <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center border border-primary/20 mr-3">
            <Users size={22} color="#A78BFA" />
          </View>
          
          {/* Text Stack */}
          <View className="flex-1">
            <Text className="text-text font-bold text-base leading-snug">{group.name}</Text>
            <Text className="text-text-muted text-xs mt-1" numberOfLines={1}>
              {group.description || 'Círculo de proteção e segurança'}
            </Text>
          </View>
        </View>

        {/* Action Button (Chevron) */}
        <View className="w-8 h-8 rounded-lg bg-surface-2 items-center justify-center border border-surface-3/30">
          <ChevronRight size={16} color="#9B98B8" />
        </View>
      </View>

      {/* Subtle Divider */}
      <View className="h-px bg-surface-3/45 my-3.5" />

      {/* Footer Info */}
      <View className="flex-row items-center justify-between">
        {/* Members Avatars Overlap Stack */}
        <View className="flex-row items-center">
          {visibleMembers.map((member, index) => {
            const initial = member.nome ? member.nome.charAt(0).toUpperCase() : 'U';
            const colorClass = AVATAR_COLORS[(member.nome ? member.nome.charCodeAt(0) : 0) % AVATAR_COLORS.length];
            return (
              <View
                key={member._id ?? member.id ?? String(index)}
                className={`w-8 h-8 rounded-full border-2 border-surface ${colorClass} items-center justify-center overflow-hidden`}
                style={{ marginLeft: index === 0 ? 0 : AVATAR_OFFSET }}
              >
                <Text className="text-white font-bold text-xs">{initial}</Text>
              </View>
            );
          })}
          
          {remaining > 0 && (
            <View
              className="w-8 h-8 rounded-full border-2 border-surface bg-surface-3 items-center justify-center"
              style={{ marginLeft: AVATAR_OFFSET }}
            >
              <Text className="text-text-muted text-xs font-bold">+{remaining}</Text>
            </View>
          )}
        </View>

        {/* Member Count Badge */}
        <View className="flex-row items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
          <Users size={12} color="#A78BFA" />
          <Text className="text-primary-light text-xs font-semibold">
            {group.memberCount} {group.memberCount === 1 ? 'membro' : 'membros'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}