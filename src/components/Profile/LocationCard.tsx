 // components/LocationCard.tsx

import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';

import { Home, Briefcase, Dumbbell, BookOpen, MapPin } from 'lucide-react-native';
 
// ─── Tipos ───────────────────────────────────────────────────────────────────
 
export type LocationCategory = 'casa' | 'trabalho' | 'academia' | 'escola' | 'outro';
 
export interface Location {

  id: string;

  name: string;

  category: LocationCategory;

  address: string;

}
 
// ─── Config de categoria ──────────────────────────────────────────────────────
 
const categoryConfig: Record<

  LocationCategory,

  {

    label: string;

    icon: React.FC<{ size: number; color: string }>;

    iconColor: string;

    badgeBg: string;

    badgeText: string;

    accent: string;

  }
> = {

  casa: {

    label: 'Casa',

    icon: Home,

    iconColor: '#A78BFA',

    badgeBg: 'bg-primary-muted',

    badgeText: 'text-primary-light',

    accent: 'border-l-primary',

  },

  trabalho: {

    label: 'Trabalho',

    icon: Briefcase,

    iconColor: '#10B981',

    badgeBg: 'bg-safe-muted',

    badgeText: 'text-safe',

    accent: 'border-l-safe',

  },

  academia: {

    label: 'Academia',

    icon: Dumbbell,

    iconColor: '#F59E0B',

    badgeBg: 'bg-warning-muted',

    badgeText: 'text-warning',

    accent: 'border-l-warning',

  },

  escola: {

    label: 'Escola',

    icon: BookOpen,

    iconColor: '#F472B6',

    badgeBg: 'bg-emergency-muted',

    badgeText: 'text-emergency-light',

    accent: 'border-l-emergency-light',

  },

  outro: {

    label: 'Outro',

    icon: MapPin,

    iconColor: '#9B98B8',

    badgeBg: 'bg-surface-3',

    badgeText: 'text-text-muted',

    accent: 'border-l-border',

  },

};
 
// ─── Componente ───────────────────────────────────────────────────────────────
 
export function LocationCard({ item }: { item: Location }) {

  const config = categoryConfig[item.category];

  const Icon = config.icon;
 
  return (
<TouchableOpacity

      activeOpacity={0.8}

      className={`

        bg-surface rounded-2xl border border-border

        border-l-4 ${config.accent}

        px-4 py-4 flex-row items-center gap-4

      `}
>

      {/* Ícone */}
<View className="w-11 h-11 rounded-xl bg-surface-2 items-center justify-center">
<Icon size={20} color={config.iconColor} />
</View>
 
      {/* Conteúdo */}
<View className="flex-1">
<View className="flex-row items-center gap-2 mb-1">
<Text className="text-base font-semibold text-text">{item.name}</Text>
<View className={`px-2 py-0.5 rounded-full ${config.badgeBg}`}>
<Text className={`text-xs font-medium ${config.badgeText}`}>

              {config.label}
</Text>
</View>
</View>
 
        <View className="flex-row items-center gap-1.5">
<MapPin size={12} color="#5C5A7A" />
<Text className="text-sm text-text-muted flex-1" numberOfLines={1}>

            {item.address}
</Text>
</View>
</View>
 
      {/* Chevron */}
<Text className="text-text-dim text-lg">›</Text>
</TouchableOpacity>

  );

}
 