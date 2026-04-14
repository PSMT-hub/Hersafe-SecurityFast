import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';



import { MOCK_LOCATIONS } from '@/Data/Location';
import {LocationCard} from '@/components/Profile/LocationCard';
import {MapPin} from 'lucide-react-native';

type Field = {
  label: string;
  value: string;
  key: string;
  secure?: boolean;
};

const FIELDS: Field[] = [
  { label: 'Nome', value: 'Ana Silva', key: 'name' },
  { label: 'E-mail', value: 'ana@email.com', key: 'email' },
  { label: 'Senha', value: '••••••••', key: 'password', secure: true },
  { label: 'Telefone', value: '+55 11 99999-0000', key: 'phone' },
  { label: 'Contato de Emergência', value: '+55 11 88888-0000', key: 'emergency' },
];

export default function ProfileScreen() {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, f.value]))
  );

  const handleEdit = (key: string) => setEditing(key);
  const handleSave = () => setEditing(null);

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="items-center pt-14 pb-8 px-6">
        <View className="relative mb-4">
          <View className="w-24 h-24 rounded-full bg-surface-2 border-2 border-primary items-center justify-center overflow-hidden">
            <Text className="text-5xl">👤</Text>
          </View>
          <TouchableOpacity className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full items-center justify-center border-2 border-bg">
            <Text className="text-white text-xs">✏️</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-bold text-text">{form.name}</Text>
        <Text className="text-sm text-text-muted mt-1">{form.email}</Text>
      </View>

      {/* Divisor */}
      <View className="h-px bg-surface-3 mx-6 mb-6" />

      {/* Campos */}
      <View className="px-6 gap-3">
        <Text className="text-xs font-semibold text-text-dim uppercase tracking-widest mb-1">
          Informações pessoais
        </Text>

        {FIELDS.map((field) => (
          <FieldCard
            key={field.key}
            field={field}
            value={form[field.key]}
            isEditing={editing === field.key}
            onEdit={() => handleEdit(field.key)}
            onSave={handleSave}
            onChange={(val) => setForm((prev) => ({ ...prev, [field.key]: val }))}
          />
        ))}
      </View>

      {/* Meus Locais */}
   <View>
<SectionTitle>Meus locais</SectionTitle>
 
  <View className="gap-3">
    {MOCK_LOCATIONS.map((location) => (
<LocationCard key={location.id} item={location} />
    ))}
</View>
 
  <TouchableOpacity
    activeOpacity={0.8}
    className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4"
>
<MapPin size={16} color="#9B98B8" />
<Text className="text-sm text-text-muted font-medium">Adicionar local</Text>
</TouchableOpacity>
</View>

      {/* Sair */}
      <View className="px-6 mt-8">
        <TouchableOpacity className="bg-emergency-muted border border-emergency rounded-2xl py-4 items-center">
          <Text className="text-emergency font-semibold text-sm">Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Section Title ─────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-xs font-semibold text-text-dim uppercase tracking-widest mb-1 px-6 mt-6">
      {children}
    </Text>
  );
}

// ─── Field Card ────────────────────────────────────────────────────────────────

type FieldCardProps = {
  field: Field;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onChange: (val: string) => void;
};

function FieldCard({ field, value, isEditing, onEdit, onSave, onChange }: FieldCardProps) {
  return (
    <View className="bg-surface rounded-2xl border border-surface-3 px-4 py-3">
      <Text className="text-xs text-text-dim mb-1">{field.label}</Text>

      <View className="flex-row items-center justify-between">
        {isEditing ? (
          <TextInput
            className="flex-1 text-text text-sm"
            value={value}
            onChangeText={onChange}
            secureTextEntry={field.secure}
            autoFocus
            placeholderTextColor="#5C5A7A"
          />
        ) : (
          <Text className="flex-1 text-text text-sm">
            {field.secure ? '••••••••' : value}
          </Text>
        )}

        <TouchableOpacity
          onPress={isEditing ? onSave : onEdit}
          className="ml-3"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-primary-light text-xs font-medium">
            {isEditing ? 'Salvar' : 'Editar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
