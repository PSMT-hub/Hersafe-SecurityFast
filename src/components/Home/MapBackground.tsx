import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Person, SafePlace } from '@/types';
import PersonPin from './PersonPin';
import PlacePin from './PlacePin';

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

const DEFAULT_REGION = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

interface Props {
  persons: Person[];
  places: SafePlace[];
  onPersonPress?: (person: Person) => void;
}

export default function MapBackground({ persons, places, onPersonPress }: Props) {
  const mapRef = useRef<MapView | null>(null);

  const coordinates = useMemo(
    () => [
      ...persons.map((person) => person.coordinate),
      ...places.map((place) => place.coordinate),
    ],
    [persons, places]
  );

  useEffect(() => {
    if (coordinates.length === 0) return;

    const timeoutId = setTimeout(() => {
      if (coordinates.length === 1) {
        mapRef.current?.animateToRegion(
          {
            ...coordinates[0],
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          350
        );
        return;
      }

      mapRef.current?.fitToCoordinates(coordinates, {
        animated: true,
        edgePadding: {
          top: 120,
          right: 60,
          bottom: 260,
          left: 60,
        },
      });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [coordinates]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      provider={PROVIDER_GOOGLE}
      customMapStyle={MAP_DARK_STYLE}
      initialRegion={DEFAULT_REGION}
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
