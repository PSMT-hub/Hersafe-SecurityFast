import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapBackground from '@/components/Home/MapBackground';
import PeopleDrawer from '@/components/Home/PeopleDrawer';
import EmergencyButton from '@/components/Home/EmergencySlider';
import { Person, SafePlace } from '@/types';
import { fetchPersons, fetchSafePlaces, triggerEmergency } from '@/Data/mock';
import { colors } from '@/theme/colors';

export default function HomeScreen() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [places, setPlaces] = useState<SafePlace[]>([]);

  useEffect(() => {
    fetchPersons().then(setPersons);
    fetchSafePlaces().then(setPlaces);
  }, []);

  const handlePersonPress = (person: Person) => {
    // TODO: centralizar mapa / abrir modal de detalhes
    console.log('[HomeScreen] person pressed:', person.id);
  };

  return (
    <View style={styles.root}>
      {/* Camada 1 — Mapa */}
      <MapBackground
        persons={persons}
        places={places}
        onPersonPress={handlePersonPress}
      />

      {/* Camada 2 — Drawer arrastável */}
      <PeopleDrawer persons={persons} onPersonPress={handlePersonPress} />

      {/* Camada 3 — FAB de emergência (posição absoluta própria) */}
      <EmergencyButton onTrigger={() => triggerEmergency('me')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});