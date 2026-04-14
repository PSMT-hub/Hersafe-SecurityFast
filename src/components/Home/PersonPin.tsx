import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';
import { Person, PersonStatus } from '@/types';
import { colors } from '@/theme/colors';

const STATUS_COLOR: Record<PersonStatus, string> = {
  safe:    colors.safe,
  moving:  colors.primary,
  alert:   colors.warning,
  offline: colors.textDim,
};

interface Props {
  person: Person;
  onPress?: () => void;
}

export default function PersonPin({ person, onPress }: Props) {
  const ringColor = STATUS_COLOR[person.status];

  return (
    <Marker coordinate={person.coordinate} onPress={onPress} anchor={{ x: 0.5, y: 1 }}>
      <View style={styles.wrapper}>
        <View style={[styles.ring, { borderColor: ringColor }]}>
          <View style={styles.bubble}>
            <Text style={styles.initials}>{person.initials}</Text>
          </View>
        </View>
        <MapPin size={10} color={ringColor} style={styles.tail} />
        <Text style={styles.name}>{person.name}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  ring: {
    borderWidth: 2.5,
    borderRadius: 999,
    padding: 2,
  },
  bubble: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  tail: {
    marginTop: -2,
  },
  name: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    backgroundColor: colors.surface + 'CC',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 1,
    overflow: 'hidden',
  },
});