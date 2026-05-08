import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { MOCK_LOCATIONS } from '@/Data/Location';
import { LocationCard } from '@/components/Profile/LocationCard';
import { MapPin } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../services/userService';

// ─── Tipos ─────────────────────────────────────────────────────────────────────

type EditableField = 'nome' | 'email' | 'telefone';

// ─── Tela ──────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, token, logout, refreshUser } = useAuth();

  const [editing, setEditing] = useState<EditableField | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado local espelha os dados do usuário para edição inline
  const [form, setForm] = useState({
    nome: user?.nome ?? '',
    email: user?.email ?? '',
    telefone: user?.telefone ?? '',
  });

  // ── Salvar campo editado ────────────────────────────────────────────────────
  const handleSave = useCallback(
    async (field: EditableField) => {
      if (!user || !token) return;
      setSaving(true);
      try {
        await updateUser(user.id, { [field]: form[field] }, token);
        await refreshUser();
        setEditing(null);
      } catch (err: any) {
        Alert.alert('Erro', err.message ?? 'Não foi possível salvar.');
      } finally {
        setSaving(false);
      }
    },
    [user, token, form, refreshUser],
  );

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  }, [logout]);

  if (!user) return null;

  const displayFields: { label: string; key: EditableField; keyboard?: any }[] = [
    { label: 'Nome', key: 'nome', keyboard: 'default' },
    { label: 'E-mail', key: 'email', keyboard: 'email-address' },
    { label: 'Telefone', key: 'telefone', keyboard: 'phone-pad' },
  ];

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
        </View>

        <Text className="text-xl font-bold text-text">{user.nome}</Text>
        <Text className="text-sm text-text-muted mt-1">{user.email}</Text>
      </View>

      {/* Divisor */}
      <View className="h-px bg-surface-3 mx-6 mb-6" />

      {/* Campos editáveis */}
      <View className="px-6 gap-3">
        <Text className="text-xs font-semibold text-text-dim uppercase tracking-widest mb-1">
          Informações pessoais
        </Text>

        {displayFields.map(({ label, key, keyboard }) => (
          <FieldCard
            key={key}
            label={label}
            value={form[key]}
            isEditing={editing === key}
            isSaving={saving && editing === key}
            keyboardType={keyboard}
            onEdit={() => {
              // Sincroniza o form com os dados mais recentes antes de editar
              setForm({
                nome: user.nome ?? '',
                email: user.email ?? '',
                telefone: user.telefone ?? '',
              });
              setEditing(key);
            }}
            onSave={() => handleSave(key)}
            onCancel={() => setEditing(null)}
            onChange={(val) => setForm((prev) => ({ ...prev, [key]: val }))}
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
          className="mt-4 mx-6 flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4"
        >
          <MapPin size={16} color="#9B98B8" />
          <Text className="text-sm text-text-muted font-medium">Adicionar local</Text>
        </TouchableOpacity>
      </View>

      {/* Sair */}
      <View className="px-6 mt-8">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-emergency-muted border border-emergency rounded-2xl py-4 items-center"
        >
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
  label: string;
  value: string;
  isEditing: boolean;
  isSaving: boolean;
  keyboardType?: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (val: string) => void;
};

function FieldCard({
  label,
  value,
  isEditing,
  isSaving,
  keyboardType,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: FieldCardProps) {
  return (
    <View className="bg-surface rounded-2xl border border-surface-3 px-4 py-3">
      <Text className="text-xs text-text-dim mb-1">{label}</Text>

      <View className="flex-row items-center justify-between">
        {isEditing ? (
          <TextInput
            className="flex-1 text-text text-sm"
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
            autoFocus
            placeholderTextColor="#5C5A7A"
          />
        ) : (
          <Text className="flex-1 text-text text-sm">{value || '—'}</Text>
        )}

        <View className="flex-row gap-3 ml-3">
          {isEditing ? (
            <>
              <TouchableOpacity
                onPress={onCancel}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text className="text-text-dim text-xs font-medium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSave}
                disabled={isSaving}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#A78BFA" />
                ) : (
                  <Text className="text-primary-light text-xs font-medium">Salvar</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={onEdit}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-primary-light text-xs font-medium">Editar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
