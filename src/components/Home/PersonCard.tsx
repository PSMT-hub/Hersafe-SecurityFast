import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  ShieldCheck,
  Navigation,
  AlertTriangle,
  WifiOff,
  Battery,
  BatteryLow,
  ChevronRight,
} from 'lucide-react-native';
import { Person, PersonStatus } from '@/types';
import { colors } from '@/theme/colors';

const STATUS_CONFIG: Record<PersonStatus, { label: string; color: string; Icon: any }> = {
  safe:    { label: 'Segura',       color: colors.safe,    Icon: ShieldCheck },
  moving:  { label: 'Em movimento', color: colors.primary, Icon: Navigation },
  alert:   { label: 'Atenção',      color: colors.warning, Icon: AlertTriangle },
  offline: { label: 'Offline',      color: colors.textDim, Icon: WifiOff },
};

function timeAgo(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
  return `${Math.floor(diff / 3600)}h atrás`;
}

interface Props {
  person: Person;
  onPress?: () => void;
}

export default function PersonCard({ person, onPress }: Props) {
  const { label, color, Icon } = STATUS_CONFIG[person.status];
  const isLowBattery = (person.battery ?? 100) < 20;
  const BatteryIcon = isLowBattery ? BatteryLow : Battery;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Avatar */}
      <View style={[styles.avatarRing, { borderColor: color }]}>
        <Text style={styles.initials}>{person.initials}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{person.name}</Text>
        <Text style={styles.location} numberOfLines={1}>
          {person.lastLocation}
        </Text>
      </View>

      {/* Right side */}
      <View style={styles.right}>
        <View style={styles.statusRow}>
          <Icon size={12} color={color} />
          <Text style={[styles.statusLabel, { color }]}>{label}</Text>
        </View>
        <Text style={styles.time}>{timeAgo(person.lastSeen)}</Text>
        {person.battery !== undefined && (
          <View style={styles.batteryRow}>
            <BatteryIcon
              size={11}
              color={isLowBattery ? colors.danger : colors.textDim}
            />
            <Text style={[styles.batteryText, isLowBattery && styles.batteryLow]}>
              {person.battery}%
            </Text>
          </View>
        )}
      </View>

      <ChevronRight size={14} color={colors.textDim} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 12,
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  },
  initials: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  location: {
    fontSize: 12,
    color: colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    gap: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  time: {
    fontSize: 10,
    color: colors.textDim,
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  batteryText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  batteryLow: {
    color: colors.danger,
  },
});