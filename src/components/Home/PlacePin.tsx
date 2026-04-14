import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';
import { SafePlace } from '@/types';
import { colors } from '@/theme/colors';

interface Props {
  place: SafePlace;
}

export default function PlacePin({ place }: Props) {
  const Icon = place.icon;

  return (
    <Marker coordinate={place.coordinate} anchor={{ x: 0.5, y: 1 }}>
      <View style={styles.wrapper}>
        <View style={styles.bubble}>
          <Icon size={16} color={colors.primaryLight} />
        </View>
        <MapPin size={10} color={colors.primary} style={styles.tail} />
        <Text style={styles.name}>{place.name}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  bubble: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tail: {
    marginTop: -2,
  },
  name: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    backgroundColor: colors.surface + 'CC',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginTop: 1,
    overflow: 'hidden',
  },
});