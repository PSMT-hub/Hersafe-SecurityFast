import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Person, SafePlace } from '@/types';
import PersonPin from './PersonPin';
import PlacePin from './PlacePin';

// Estilo escuro para o mapa (Google Maps custom style)
const MAP_DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1C1C27' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9B98B8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#121218' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2E2E42' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#121218' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3B1F6E' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0D0D1A' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

interface Props {
  persons: Person[];
  places: SafePlace[];
  onPersonPress?: (person: Person) => void;
}

export default function MapBackground({ persons, places, onPersonPress }: Props) {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      provider={PROVIDER_GOOGLE}
      customMapStyle={MAP_DARK_STYLE}
      initialRegion={{
        latitude: -23.5505,
        longitude: -46.6333,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }}
      showsUserLocation
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
    >
      {places.map((place) => (
        <PlacePin key={place.id} place={place} />
      ))}
      {persons.map((person) => (
        <PersonPin
          key={person.id}
          person={person}
          onPress={() => onPersonPress?.(person)}
        />
      ))}
    </MapView>
  );
}