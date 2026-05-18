import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Building2, Dumbbell, GraduationCap, Home, MapPin } from 'lucide-react-native';
import MapBackground from '@/components/Home/MapBackground';
import PeopleDrawer from '@/components/Home/PeopleDrawer';
import EmergencyButton from '@/components/Home/EmergencySlider';
import { Person, SafePlace } from '@/types';
import { Group } from '@/types/group';
import { ApiUser, MyLocation } from '@/types/user';
import { getGroupById, getGroups } from '@/services/groupService';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/colors';

function getUserId(user: ApiUser): string {
  return user.id ?? user._id ?? '';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

function hasValidCoordinate(latitude?: number, longitude?: number): latitude is number {
  return typeof latitude === 'number' && Number.isFinite(latitude)
    && typeof longitude === 'number' && Number.isFinite(longitude);
}

function getPersonStatus(updatedAt?: string): Person['status'] {
  if (!updatedAt) return 'offline';

  const timestamp = new Date(updatedAt).getTime();
  if (Number.isNaN(timestamp)) return 'offline';

  const diffMinutes = (Date.now() - timestamp) / 60000;
  return diffMinutes <= 30 ? 'safe' : 'offline';
}

function normalizeMembers(members: Group['membros']): Person[] {
  return members
    .filter((member): member is ApiUser => typeof member === 'object' && member !== null)
    .filter((member) =>
      hasValidCoordinate(
        member.ultimaLocalizacao?.latitude,
        member.ultimaLocalizacao?.longitude
      )
    )
    .map((member) => ({
      id: getUserId(member),
      name: member.nome,
      initials: getInitials(member.nome),
      status: getPersonStatus(member.ultimaLocalizacao?.atualizadoEm),
      lastSeen: member.ultimaLocalizacao?.atualizadoEm ?? new Date().toISOString(),
      lastLocation: 'Ultima localizacao registrada',
      coordinate: {
        latitude: member.ultimaLocalizacao!.latitude,
        longitude: member.ultimaLocalizacao!.longitude,
      },
    }));
}

function getLocationIcon(type: MyLocation['tipo']) {
  switch (type) {
    case 'casa':
      return Home;
    case 'trabalho':
      return Building2;
    case 'academia':
      return Dumbbell;
    case 'faculdade':
    case 'escola':
      return GraduationCap;
    default:
      return MapPin;
  }
}

function normalizePlaces(members: Group['membros']): SafePlace[] {
  return members
    .filter((member): member is ApiUser => typeof member === 'object' && member !== null)
    .flatMap((member) =>
      (member.meusLocais ?? [])
        .filter((location) => hasValidCoordinate(location.latitude, location.longitude))
        .map((location, index) => ({
          id: `${getUserId(member)}-${location._id ?? index}`,
          name: location.nome || location.tipo || 'Local cadastrado',
          icon: getLocationIcon(location.tipo),
          coordinate: {
            latitude: location.latitude!,
            longitude: location.longitude!,
          },
        }))
    );
}

export default function HomeScreen() {
  const { token } = useAuth();
  const detailRequestId = useRef(0);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [places, setPlaces] = useState<SafePlace[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingGroupDetail, setIsLoadingGroupDetail] = useState(false);

  const selectedGroupName = useMemo(
    () => {
      if (selectedGroup?._id === selectedGroupId) return selectedGroup.nome;
      return groups.find((group) => group._id === selectedGroupId)?.nome;
    },
    [groups, selectedGroup, selectedGroupId]
  );

  useEffect(() => {
    if (!token) return;

    let isActive = true;

    async function loadGroups() {
      setIsLoadingGroups(true);
      try {
        const data = await getGroups(token!);
        if (!isActive) return;

        setGroups(data.grupos);
        setSelectedGroupId((current) => {
          const currentStillExists = data.grupos.some((group) => group._id === current);
          return currentStillExists ? current : data.grupos[0]?._id ?? null;
        });
      } catch (error: any) {
        if (isActive) {
          Alert.alert('Erro', error.message || 'Falha ao carregar grupos.');
        }
      } finally {
        if (isActive) setIsLoadingGroups(false);
      }
    }

    loadGroups();

    return () => {
      isActive = false;
    };
  }, [token]);

  const loadGroupDetail = useCallback(async () => {
    if (!token || !selectedGroupId) {
      detailRequestId.current += 1;
      setSelectedGroup(null);
      setPersons([]);
      setPlaces([]);
      return;
    }

    const requestId = detailRequestId.current + 1;
    detailRequestId.current = requestId;
    setIsLoadingGroupDetail(true);

    try {
      const data = await getGroupById(selectedGroupId, token);
      if (detailRequestId.current !== requestId) return;

      setSelectedGroup(data.grupo);
      setPersons(normalizeMembers(data.grupo.membros));
      setPlaces(normalizePlaces(data.grupo.membros));
    } catch (error: any) {
      if (detailRequestId.current !== requestId) return;

      Alert.alert('Erro', error.message || 'Falha ao carregar dados do grupo.');
      setSelectedGroup(null);
      setPersons([]);
      setPlaces([]);
    } finally {
      if (detailRequestId.current === requestId) {
        setIsLoadingGroupDetail(false);
      }
    }
  }, [selectedGroupId, token]);

  useEffect(() => {
    loadGroupDetail();
  }, [loadGroupDetail]);

  const handlePersonPress = (person: Person) => {
    console.log('[HomeScreen] person pressed:', person.id);
  };

  const handleEmergencyTrigger = () => {
    console.log('[HomeScreen] emergency triggered');
  };

  return (
    <View style={styles.root}>
      <MapBackground
        persons={persons}
        places={places}
        onPersonPress={handlePersonPress}
      />

      <PeopleDrawer
        persons={persons}
        groups={groups}
        selectedGroupId={selectedGroupId}
        selectedGroupName={selectedGroupName}
        isLoading={isLoadingGroups || isLoadingGroupDetail}
        placesCount={places.length}
        onSelectGroup={setSelectedGroupId}
        onPersonPress={handlePersonPress}
      />

      <EmergencyButton onTrigger={handleEmergencyTrigger} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
