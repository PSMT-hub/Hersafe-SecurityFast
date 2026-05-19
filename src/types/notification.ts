import { Group, Invitation } from './group';
import { ApiUser } from './user';

export type AppNotificationType = 'convite_grupo' | 'alerta_emergencia' | 'info';

export interface AppNotification {
  _id: string;
  usuario: string;
  tipo: AppNotificationType;
  titulo: string;
  mensagem: string;
  lida: boolean;
  remetente?: ApiUser;
  grupo?: Group;
  convite?: Invitation | { _id: string; status: Invitation['status'] };
  dados?: {
    grupos?: Array<{ id: string; nome: string }>;
    telefone?: string;
    ultimaLocalizacao?: {
      latitude?: number;
      longitude?: number;
      atualizadoEm?: string;
    };
    acionadoEm?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}
