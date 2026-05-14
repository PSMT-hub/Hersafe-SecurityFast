import { ApiUser } from './user';

export interface Group {
  _id: string;
  nome: string;
  descricao?: string;
  criador: ApiUser | string;
  membros: ApiUser[] | string[];
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  _id: string;
  remetente: ApiUser;
  destinatario: string;
  grupo: Group;
  status: 'pendente' | 'aceito' | 'recusado';
  createdAt: string;
  updatedAt: string;
}
