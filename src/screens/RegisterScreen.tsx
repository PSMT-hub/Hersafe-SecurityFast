import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { register, isLoading } = useAuth();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    try {
      await register(name, email, password, phone || undefined);
      // Navegação ocorre automaticamente via RootNavigator
    } catch (err: any) {
      Alert.alert('Erro', err.message ?? 'Não foi possível criar a conta.');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 items-center justify-center bg-bg px-6 py-10">
          <Text className="text-3xl font-bold text-text mb-1">Cadastro</Text>
          <Text className="text-base text-text-muted mb-8">Crie sua conta para continuar</Text>

          {/* ── Campos ────────────────────────────────── */}
          <TextInput
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text mb-3"
            placeholder="Nome completo"
            placeholderTextColor="#666"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text mb-3"
            placeholder="E-mail"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text mb-3"
            placeholder="Telefone (opcional)"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text mb-3"
            placeholder="Senha"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text mb-6"
            placeholder="Confirmar senha"
            placeholderTextColor="#666"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          {/* ── Botão ─────────────────────────────────── */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            className="w-full bg-primary rounded-xl py-4 items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Criar conta</Text>
            )}
          </TouchableOpacity>

          {/* ── Link Login ────────────────────────────── */}
          <TouchableOpacity onPress={() => navigation.goBack()} className="mt-6">
            <Text className="text-text-muted text-sm">
              Já tem conta?{'  '}
              <Text className="text-primary font-semibold">Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
