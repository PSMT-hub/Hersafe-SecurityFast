import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/context/AuthContext';
import { createGroup } from '@/services/groupService';

export default function CreateGroupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { token } = useAuth();
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome do grupo é obrigatório.');
      return;
    }

    if (!token) return;

    setIsLoading(true);
    try {
      await createGroup(nome, descricao, token);
      Alert.alert('Sucesso', 'Grupo criado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar grupo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-bg px-4 pt-6"
    >
      <View className="mb-6">
        <Text className="text-text font-semibold mb-2 ml-1">Nome do Grupo</Text>
        <TextInput
          className="bg-surface text-text px-4 py-3 rounded-xl border border-border"
          placeholder="Ex: Família Silva"
          placeholderTextColor="#A1A1AA"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />
      </View>

      <View className="mb-8">
        <Text className="text-text font-semibold mb-2 ml-1">Descrição (opcional)</Text>
        <TextInput
          className="bg-surface text-text px-4 py-3 rounded-xl border border-border min-h-[100px]"
          placeholder="Ex: Grupo para compartilhar nossa localização"
          placeholderTextColor="#A1A1AA"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        onPress={handleCreate}
        disabled={isLoading}
        className={`bg-primary py-3.5 rounded-xl items-center flex-row justify-center ${isLoading ? 'opacity-70' : ''}`}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">Criar Grupo</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
