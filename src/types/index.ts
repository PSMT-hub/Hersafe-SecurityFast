import { LucideIcon } from 'lucide-react-native';

export type PersonStatus = 'safe' | 'moving' | 'alert' | 'offline';

export interface Person {
  id: string;
  name: string;
  initials: string; // ex: "MA" para Maria Ana
  status: PersonStatus;
  lastSeen: string;
  lastLocation: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  battery?: number;
}

export interface SafePlace {
  id: string;
  name: string;
  icon: LucideIcon;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

export type EmergencyState = 'idle' | 'triggered' | 'sent';