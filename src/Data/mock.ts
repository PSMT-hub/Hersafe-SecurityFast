import { Home, Building2, Dumbbell } from 'lucide-react-native';
import { Person, SafePlace } from '../types';

const BASE = { latitude: -23.5505, longitude: -46.6333 };

export const MOCK_PERSONS: Person[] = [
  {
    id: '1',
    name: 'Mãe',
    initials: 'MÃ',
    status: 'safe',
    lastSeen: new Date(Date.now() - 2 * 60000).toISOString(),
    lastLocation: 'Casa',
    battery: 82,
    coordinate: { latitude: BASE.latitude + 0.008, longitude: BASE.longitude - 0.005 },
  },
  {
    id: '2',
    name: 'Ana',
    initials: 'AN',
    status: 'moving',
    lastSeen: new Date(Date.now() - 30000).toISOString(),
    lastLocation: 'A caminho do metrô',
    battery: 45,
    coordinate: { latitude: BASE.latitude - 0.004, longitude: BASE.longitude + 0.009 },
  },
  {
    id: '3',
    name: 'Bia',
    initials: 'BI',
    status: 'alert',
    lastSeen: new Date(Date.now() - 15 * 60000).toISOString(),
    lastLocation: 'Última: Av. Paulista',
    battery: 12,
    coordinate: { latitude: BASE.latitude + 0.002, longitude: BASE.longitude + 0.003 },
  },
];

export const MOCK_SAFE_PLACES: SafePlace[] = [
  {
    id: 'p1',
    name: 'Casa',
    icon: Home,
    coordinate: { latitude: BASE.latitude + 0.008, longitude: BASE.longitude - 0.005 },
  },
  {
    id: 'p2',
    name: 'Trabalho',
    icon: Building2,
    coordinate: { latitude: BASE.latitude - 0.003, longitude: BASE.longitude - 0.007 },
  },
  {
    id: 'p3',
    name: 'Academia',
    icon: Dumbbell,
    coordinate: { latitude: BASE.latitude + 0.005, longitude: BASE.longitude + 0.006 },
  },
];

export const fetchPersons = async (): Promise<Person[]> => {
  // TODO: return api.get('/network/persons')
  return MOCK_PERSONS;
};

export const fetchSafePlaces = async (): Promise<SafePlace[]> => {
  // TODO: return api.get('/places/safe')
  return MOCK_SAFE_PLACES;
};

export const triggerEmergency = async (personId: string): Promise<void> => {
  // TODO: api.post('/emergency/trigger', { personId })
  console.log('[EMERGENCY] triggered by', personId);
};