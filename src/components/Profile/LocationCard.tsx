import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  BookOpen,
  Briefcase,
  Dumbbell,
  Edit3,
  GraduationCap,
  Home,
  Map,
  MapPin,
  Trash2,
} from 'lucide-react-native';

import type { MyLocation } from '../../types/user';

type LocationCardProps = {
  item: MyLocation;
  onEdit: () => void;
  onDelete: () => void;
};

const TYPE_ICONS: Record<string, any> = {
  trabalho: Briefcase,
  academia: Dumbbell,
  faculdade: GraduationCap,
  escola: BookOpen,
  casa: Home,
  'casa passeio': Map,
};

export function LocationCard({ item, onEdit, onDelete }: LocationCardProps) {
  const IconComponent = item.tipo && TYPE_ICONS[item.tipo] ? TYPE_ICONS[item.tipo] : MapPin;

  return (
    <View className="rounded-2xl border border-l-4 border-border border-l-primary bg-surface px-4 py-4">
      <View className="flex-row items-start gap-4">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-surface-2">
          <IconComponent size={20} color="#A78BFA" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-text" numberOfLines={1}>
            {item.nome}
          </Text>
          <View className="mt-1 flex-row items-center gap-1.5">
            <MapPin size={12} color="#5C5A7A" />
            <Text className="flex-1 text-sm text-text-muted" numberOfLines={2}>
              {item.endereco}
            </Text>
          </View>

          {item.latitude !== undefined && item.longitude !== undefined ? (
            <Text className="mt-2 text-xs text-text-dim">
              {item.latitude}, {item.longitude}
            </Text>
          ) : null}
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Edit3 size={18} color="#A78BFA" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Trash2 size={18} color="#FB7185" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
