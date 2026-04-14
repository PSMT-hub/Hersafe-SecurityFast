import { Home, Heart, Briefcase, Dumbbell, Users, Star } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

export type Member = {
    id: string;
    name: string;
    avatar: string;
};

export type Group = {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    members: Member[];
};

export const MOCK_GROUPS: Group[] = [
    {
        id: '1',
        name: 'Família',
        description: 'Minha família próxima',
        icon: Home,
        members: [
            { id: '1', name: 'Ana', avatar: 'https://i.pravatar.cc/150?img=1' },
            { id: '2', name: 'Carlos', avatar: 'https://i.pravatar.cc/150?img=2' },
            { id: '3', name: 'Júlia', avatar: 'https://i.pravatar.cc/150?img=3' },
        ],
    },
    {
        id: '2',
        name: 'Melhores Amigas',
        description: 'Sempre juntas',
        icon: Heart,
        members: [
            { id: '4', name: 'Bea', avatar: 'https://i.pravatar.cc/150?img=5' },
            { id: '5', name: 'Lara', avatar: 'https://i.pravatar.cc/150?img=6' },
            { id: '6', name: 'Mari', avatar: 'https://i.pravatar.cc/150?img=7' },
            { id: '7', name: 'Isa', avatar: 'https://i.pravatar.cc/150?img=8' },
            { id: '8', name: 'Gabi', avatar: 'https://i.pravatar.cc/150?img=9' },
        ],
    },
    {
        id: '3',
        name: 'Trabalho',
        description: 'Colegas de escritório',
        icon: Briefcase,
        members: [
            { id: '9', name: 'Pedro', avatar: 'https://i.pravatar.cc/150?img=11' },
            { id: '10', name: 'Rafa', avatar: 'https://i.pravatar.cc/150?img=12' },
        ],
    },
    {
        id: '4',
        name: 'Academia',
        description: 'Parceiras de treino',
        icon: Dumbbell,
        members: [
            { id: '11', name: 'Fê', avatar: 'https://i.pravatar.cc/150?img=15' },
            { id: '12', name: 'Day', avatar: 'https://i.pravatar.cc/150?img=16' },
            { id: '13', name: 'Tati', avatar: 'https://i.pravatar.cc/150?img=17' },
        ],
    },
];