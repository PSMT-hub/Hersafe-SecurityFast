import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  type KeyboardTypeOptions,
} from 'react-native';

import { LocationCard } from '@/components/Profile/LocationCard';
import * as Location from 'expo-location';
import { BookOpen, Briefcase, Dumbbell, GraduationCap, Home, Map, MapPin, Plus, X } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../services/userService';
import type { LocationType, MyLocation, UpdateUserPayload } from '../types/user';

type EditableField = 'nome' | 'email' | 'telefone' | 'contatoNome' | 'contatoTelefone';

type ProfileForm = Record<EditableField, string>;

type LocationForm = {
  tipo?: LocationType;
  nome: string;
  endereco: string;
  latitude: string;
  longitude: string;
};

const EMPTY_LOCATION_FORM: LocationForm = {
  tipo: undefined,
  nome: '',
  endereco: '',
  latitude: '',
  longitude: '',
};

export default function ProfileScreen() {
  const { user, token, logout, refreshUser } = useAuth();

  const [editing, setEditing] = useState<EditableField | null>(null);
  const [savingField, setSavingField] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [editingLocationIndex, setEditingLocationIndex] = useState<number | null>(null);
  const [locationForm, setLocationForm] = useState<LocationForm>(EMPTY_LOCATION_FORM);
  const [form, setForm] = useState<ProfileForm>({
    nome: '',
    email: '',
    telefone: '',
    contatoNome: '',
    contatoTelefone: '',
  });

  const locations = useMemo(() => user?.meusLocais ?? [], [user?.meusLocais]);

  const syncFormFromUser = useCallback(() => {
    if (!user) return;

    setForm({
      nome: user.nome ?? '',
      email: user.email ?? '',
      telefone: user.telefone ?? '',
      contatoNome: user.contatoDeEmergencia?.nome ?? '',
      contatoTelefone: user.contatoDeEmergencia?.telefone ?? '',
    });
  }, [user]);

  useEffect(() => {
    syncFormFromUser();
  }, [syncFormFromUser]);

  const buildPayload = useCallback(
    (overrides: Partial<UpdateUserPayload> = {}): UpdateUserPayload => ({
      nome: user?.nome ?? '',
      email: user?.email ?? '',
      telefone: user?.telefone ?? '',
      contatoDeEmergencia: {
        nome: user?.contatoDeEmergencia?.nome ?? '',
        telefone: user?.contatoDeEmergencia?.telefone ?? '',
      },
      meusLocais: user?.meusLocais ?? [],
      ...overrides,
    }),
    [user]
  );

  const saveProfile = useCallback(
    async (payload: UpdateUserPayload) => {
      if (!user?.id || !token) return;

      await updateUser(user.id, payload, token);
      await refreshUser();
    },
    [refreshUser, token, user?.id]
  );

  const handleSaveField = useCallback(
    async (field: EditableField) => {
      if (!user || !token) return;

      const trimmedValue = form[field].trim();
      if (!trimmedValue && field !== 'contatoNome' && field !== 'contatoTelefone') {
        Alert.alert('Atencao', 'Este campo nao pode ficar vazio.');
        return;
      }

      setSavingField(true);
      try {
        const contatoDeEmergencia = {
          nome: field === 'contatoNome' ? trimmedValue : form.contatoNome.trim(),
          telefone: field === 'contatoTelefone' ? trimmedValue : form.contatoTelefone.trim(),
        };

        const payload = buildPayload(
          field === 'contatoNome' || field === 'contatoTelefone'
            ? { contatoDeEmergencia }
            : { [field]: trimmedValue }
        );

        await saveProfile(payload);
        setEditing(null);
      } catch (err: any) {
        Alert.alert('Erro', err.message ?? 'Nao foi possivel salvar.');
      } finally {
        setSavingField(false);
      }
    },
    [buildPayload, form, saveProfile, token, user]
  );

  const openCreateLocation = useCallback(() => {
    setEditingLocationIndex(null);
    setLocationForm(EMPTY_LOCATION_FORM);
    setLocationModalVisible(true);
  }, []);

  const openEditLocation = useCallback((location: MyLocation, index: number) => {
    setEditingLocationIndex(index);
    setLocationForm({
      tipo: location.tipo,
      nome: location.nome ?? '',
      endereco: location.endereco ?? '',
      latitude: location.latitude?.toString() ?? '',
      longitude: location.longitude?.toString() ?? '',
    });
    setLocationModalVisible(true);
  }, []);

  const closeLocationModal = useCallback(() => {
    setLocationModalVisible(false);
    setEditingLocationIndex(null);
    setLocationForm(EMPTY_LOCATION_FORM);
  }, []);

  const handleSaveLocation = useCallback(async () => {
    const nome = locationForm.nome.trim();
    const endereco = locationForm.endereco.trim();
    const latitude = locationForm.latitude.trim();
    const longitude = locationForm.longitude.trim();
    const tipo = locationForm.tipo;

    if (!tipo) {
      Alert.alert('Atencao', 'Selecione um tipo de local.');
      return;
    }

    if (!endereco) {
      Alert.alert('Atencao', 'Preencha o endereco do local.');
      return;
    }

    const parsedLatitude = latitude ? Number(latitude.replace(',', '.')) : undefined;
    const parsedLongitude = longitude ? Number(longitude.replace(',', '.')) : undefined;

    if (
      (latitude && Number.isNaN(parsedLatitude)) ||
      (longitude && Number.isNaN(parsedLongitude))
    ) {
      Alert.alert('Atencao', 'Latitude e longitude precisam ser numeros validos.');
      return;
    }

    const nextLocation: MyLocation = {
      ...(editingLocationIndex !== null ? locations[editingLocationIndex] : {}),
      nome: nome || (tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1) : ''),
      endereco,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      tipo,
    };

    const nextLocations =
      editingLocationIndex === null
        ? [...locations, nextLocation]
        : locations.map((item, index) => (index === editingLocationIndex ? nextLocation : item));

    setSavingLocation(true);
    try {
      await saveProfile(buildPayload({ meusLocais: nextLocations }));
      closeLocationModal();
    } catch (err: any) {
      Alert.alert('Erro', err.message ?? 'Nao foi possivel salvar o local.');
    } finally {
      setSavingLocation(false);
    }
  }, [
    buildPayload,
    closeLocationModal,
    editingLocationIndex,
    locationForm,
    locations,
    saveProfile,
  ]);

  const handleDeleteLocation = useCallback(
    (indexToDelete: number) => {
      Alert.alert('Remover local', 'Deseja remover este local do seu perfil?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const nextLocations = locations.filter((_, index) => index !== indexToDelete);
              await saveProfile(buildPayload({ meusLocais: nextLocations }));
            } catch (err: any) {
              Alert.alert('Erro', err.message ?? 'Nao foi possivel remover.');
            }
          },
        },
      ]);
    },
    [buildPayload, locations, saveProfile]
  );

  const handleLogout = useCallback(() => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  }, [logout]);

  if (!user) return null;

  const displayFields: {
    label: string;
    key: EditableField;
    keyboard?: KeyboardTypeOptions;
  }[] = [
    { label: 'Nome', key: 'nome', keyboard: 'default' },
    { label: 'E-mail', key: 'email', keyboard: 'email-address' },
    { label: 'Telefone', key: 'telefone', keyboard: 'phone-pad' },
    { label: 'Contato de emergencia', key: 'contatoNome', keyboard: 'default' },
    { label: 'Telefone do contato', key: 'contatoTelefone', keyboard: 'phone-pad' },
  ];

  return (
    <>
      <ScrollView
        className="flex-1 bg-bg"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className="items-center px-6 pb-8 pt-14">
          <View className="mb-4 h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-surface-2">
            <Text className="text-5xl">👤</Text>
          </View>

          <Text className="text-xl font-bold text-text">{user.nome}</Text>
          <Text className="mt-1 text-sm text-text-muted">{user.email}</Text>
        </View>

        <View className="mx-6 mb-6 h-px bg-surface-3" />

        <View className="gap-3 px-6">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-dim">
            Informacoes pessoais
          </Text>

          {displayFields.map(({ label, key, keyboard }) => (
            <FieldCard
              key={key}
              label={label}
              value={form[key]}
              isEditing={editing === key}
              isSaving={savingField && editing === key}
              keyboardType={keyboard}
              onEdit={() => setEditing(key)}
              onSave={() => handleSaveField(key)}
              onCancel={() => {
                syncFormFromUser();
                setEditing(null);
              }}
              onChange={(val) => setForm((prev) => ({ ...prev, [key]: val }))}
            />
          ))}
        </View>

        <View>
          <SectionTitle>Meus locais</SectionTitle>

          <View className="gap-3 px-6">
            {locations.length ? (
              locations.map((location, index) => (
                <LocationCard
                  key={location._id ?? `${location.nome}-${index}`}
                  item={location}
                  onEdit={() => openEditLocation(location, index)}
                  onDelete={() => handleDeleteLocation(index)}
                />
              ))
            ) : (
              <View className="items-center rounded-2xl border border-dashed border-border bg-surface px-4 py-6">
                <MapPin size={22} color="#9B98B8" />
                <Text className="mt-2 text-center text-sm text-text-muted">
                  Nenhum local cadastrado ainda.
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openCreateLocation}
            className="mx-6 mt-4 flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4">
            <Plus size={16} color="#9B98B8" />
            <Text className="text-sm font-medium text-text-muted">Adicionar local</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 px-6">
          <TouchableOpacity
            onPress={handleLogout}
            className="items-center rounded-2xl border border-emergency bg-emergency-muted py-4">
            <Text className="text-sm font-semibold text-emergency">Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LocationModal
        visible={locationModalVisible}
        isEditing={editingLocationIndex !== null}
        form={locationForm}
        saving={savingLocation}
        onChange={(patch) =>
          setLocationForm((prev) => ({
            ...prev,
            ...patch,
          }))
        }
        onClose={closeLocationModal}
        onSave={handleSaveLocation}
      />
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text className="mb-1 mt-6 px-6 text-xs font-semibold uppercase tracking-widest text-text-dim">
      {children}
    </Text>
  );
}

type FieldCardProps = {
  label: string;
  value: string;
  isEditing: boolean;
  isSaving: boolean;
  keyboardType?: KeyboardTypeOptions;
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
    <View className="rounded-2xl border border-surface-3 bg-surface px-4 py-3">
      <Text className="mb-1 text-xs text-text-dim">{label}</Text>

      <View className="flex-row items-center justify-between">
        {isEditing ? (
          <TextInput
            className="flex-1 text-sm text-text"
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
            autoFocus
            placeholderTextColor="#5C5A7A"
            autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          />
        ) : (
          <Text className="flex-1 text-sm text-text">{value || '-'}</Text>
        )}

        <View className="ml-3 flex-row gap-3">
          {isEditing ? (
            <>
              <TouchableOpacity
                onPress={onCancel}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text className="text-xs font-medium text-text-dim">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSave}
                disabled={isSaving}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                {isSaving ? (
                  <ActivityIndicator size="small" color="#A78BFA" />
                ) : (
                  <Text className="text-xs font-medium text-primary-light">Salvar</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text className="text-xs font-medium text-primary-light">Editar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

type LocationModalProps = {
  visible: boolean;
  isEditing: boolean;
  form: LocationForm;
  saving: boolean;
  onChange: (patch: Partial<LocationForm>) => void;
  onClose: () => void;
  onSave: () => void;
};

const LOCATION_TYPES: { label: string; value: LocationType; icon: any }[] = [
  { label: 'Trabalho', value: 'trabalho', icon: Briefcase },
  { label: 'Academia', value: 'academia', icon: Dumbbell },
  { label: 'Faculdade', value: 'faculdade', icon: GraduationCap },
  { label: 'Escola', value: 'escola', icon: BookOpen },
  { label: 'Casa', value: 'casa', icon: Home },
  { label: 'Casa passeio', value: 'casa passeio', icon: Map },
];

function LocationModal({
  visible,
  isEditing,
  form,
  saving,
  onChange,
  onClose,
  onSave,
}: LocationModalProps) {
  const [fetchingGPS, setFetchingGPS] = useState(false);

  useEffect(() => {
    if (visible && !isEditing && !form.latitude && !form.longitude) {
      (async () => {
        setFetchingGPS(true);
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Atenção', 'Permissão de localização negada. Preencha o endereço manualmente.');
            return;
          }
          const location = await Location.getCurrentPositionAsync({});
          onChange({
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
          });
        } catch (e) {
          Alert.alert('Erro', 'Não foi possível obter a localização atual via GPS.');
        } finally {
          setFetchingGPS(false);
        }
      })();
    }
  }, [visible, isEditing, form.latitude, form.longitude, onChange]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/60">
        <View className="rounded-t-3xl border-t border-border bg-bg px-6 pb-8 pt-5">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-text">
              {isEditing ? 'Editar local' : 'Novo local'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              disabled={saving}
              className="h-9 w-9 items-center justify-center rounded-full bg-surface">
              <X size={18} color="#9B98B8" />
            </TouchableOpacity>
          </View>

          <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-dim">
            Tipo de Local
          </Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {LOCATION_TYPES.map((type) => {
              const isSelected = form.tipo === type.value;
              const IconComponent = type.icon;
              return (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => onChange({ tipo: type.value })}
                  className={`flex-row items-center gap-2 rounded-xl border px-3 py-2 ${
                    isSelected ? 'border-primary bg-primary/10' : 'border-surface-3 bg-surface'
                  }`}>
                  <IconComponent size={16} color={isSelected ? '#A78BFA' : '#9B98B8'} />
                  <Text
                    className={`text-sm ${
                      isSelected ? 'font-bold text-primary-light' : 'font-medium text-text-muted'
                    }`}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ProfileInput
            label="Nome (Opcional)"
            value={form.nome}
            placeholder="Ex: Trabalho principal"
            onChangeText={(nome) => onChange({ nome })}
          />
          <ProfileInput
            label="Endereço"
            value={form.endereco}
            placeholder="Rua, numero, bairro"
            onChangeText={(endereco) => onChange({ endereco })}
          />

          {fetchingGPS && (
            <View className="mb-4 flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#A78BFA" />
              <Text className="text-xs text-text-muted">Obtendo localização GPS...</Text>
            </View>
          )}

          {!fetchingGPS && form.latitude && form.longitude ? (
            <View className="mb-4 flex-row items-center gap-2 rounded-xl bg-surface-2 p-3">
              <MapPin size={16} color="#4ADE80" />
              <Text className="text-xs text-text-dim">
                Localização capturada: {Number(form.latitude).toFixed(4)},{' '}
                {Number(form.longitude).toFixed(4)}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={onSave}
            disabled={saving || fetchingGPS}
            className="mt-4 items-center rounded-2xl bg-primary py-4">
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-bold text-white">
                {isEditing ? 'Salvar alterações' : 'Cadastrar local'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type ProfileInputProps = {
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  onChangeText: (value: string) => void;
};

function ProfileInput({
  label,
  value,
  placeholder,
  keyboardType,
  onChangeText,
}: ProfileInputProps) {
  return (
    <View className="mb-3">
      <Text className="mb-1 text-xs text-text-dim">{label}</Text>
      <TextInput
        className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#5C5A7A"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
      />
    </View>
  );
}
