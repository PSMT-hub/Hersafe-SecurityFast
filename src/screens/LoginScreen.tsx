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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login, isLoading } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    try {
      await login(email, password);
      // Navegação ocorre automaticamente via RootNavigator ao isAuthenticated virar true
    } catch (err: any) {
      Alert.alert('Erro', err.message ?? 'Não foi possível fazer login.');
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
        <View className="flex-1 items-center justify-center bg-bg px-6">
          <Text className="text-3xl font-bold text-text mb-1">Login</Text>
          <Text className="text-base text-text-muted mb-8">Faça login para continuar</Text>

          {/* ── Hint mock ─────────────────────────────── */}
          <View className="w-full bg-surface border border-border rounded-xl p-3 mb-6">
            <Text className="text-text-muted text-sm">
              🧪 Mock:{'  '}
              <Text className="text-primary font-semibold">ana@hersafe.com</Text>
              {'  '}|{'  '}
              <Text className="text-primary font-semibold">123456</Text>
            </Text>
          </View>

          {/* ── Campos ────────────────────────────────── */}
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
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text mb-6"
            placeholder="Senha"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* ── Botão ─────────────────────────────────── */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="w-full bg-primary rounded-xl py-4 items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Entrar</Text>
            )}
          </TouchableOpacity>

          {/* ── Link Cadastro ─────────────────────────── */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            className="mt-6"
          >
            <Text className="text-text-muted text-sm">
              Não tem conta?{'  '}
              <Text className="text-primary font-semibold">Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
