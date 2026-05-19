import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { Users, X } from 'lucide-react-native';
import { colors } from '../theme/colors';
import banner from '../assets/banner.jpg';
export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [colabModalVisible, setColabModalVisible] = useState(false);

  return (
    <View className="flex-1 p-6 bg-bg">
      <Text className="text-2xl font-bold text-text mb-6">Configurações</Text>

      {/* Card: Notificações */}
      <View className="flex-row items-center justify-between p-4 bg-surface rounded-lg border border-border mb-3">
        <View>
          <Text className="text-base font-semibold text-text">Notificações</Text>
          <Text className="text-sm text-text-muted mt-0.5">Receber alertas de segurança</Text>
        </View>
        <Switch
          trackColor={{ false: colors.surface3, true: colors.primaryMuted }}
          thumbColor={notificationsEnabled ? colors.primary : colors.textDim}
          onValueChange={() => setNotificationsEnabled(prev => !prev)}
          value={notificationsEnabled}
        />
      </View>

      {/* Card: Colaboradores */}
      <TouchableOpacity
        className="p-4 bg-surface rounded-lg border border-border mb-3"
        onPress={() => setColabModalVisible(true)}
      >
        <View className="flex-row items-center gap-3">
          <Users size={20} color={colors.primaryLight} />
          <View>
            <Text className="text-base font-semibold text-text">Colaboradores</Text>
            <Text className="text-sm text-text-muted mt-0.5">Equipe responsável pelo HERSAFE</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Card: Sair */}
      <View className="p-4 bg-surface rounded-lg border border-border">
        <Text className="text-base font-semibold text-danger">Sair da conta</Text>
        <Text className="text-sm text-text-muted mt-0.5">Encerrar sessão atual</Text>
      </View>

      {/* Modal de Colaboradores */}
      <Modal
        visible={colabModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setColabModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-bg rounded-t-3xl h-[85%] overflow-hidden">

            {/* Imagem de Capa */}
            <View className="h-40 w-full relative">
              <Image
                source={banner}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/40 justify-center items-center">
                <Text className="text-3xl font-bold text-white tracking-widest uppercase mt-4">Colaboradores</Text>
              </View>
              <TouchableOpacity
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 items-center justify-center"
                onPress={() => setColabModalVisible(false)}
              >
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
            >

              {/* Categoria: Orientador */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Orientador</Text>
                <View className="bg-surface border border-border rounded-xl p-4">
                  <Text className="text-text font-medium">João Roberto Ursino Cruz</Text>
                </View>
              </View>

              {/* Categoria: Product Owners */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Product Owners</Text>
                <View className="bg-surface border border-border rounded-xl p-4 gap-2">
                  <Text className="text-text font-medium">Nicole Henrique Silva</Text>
                  <View className="h-px w-full bg-surface-3" />
                  <Text className="text-text font-medium">Ivana Avelino Malcher da Silva</Text>
                </View>
              </View>

              {/* Categoria: Scrum Masters */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Scrum Masters</Text>
                <View className="bg-surface border border-border rounded-xl p-4 gap-2">
                  <Text className="text-text font-medium">Raffael Monteiro Braz</Text>
                  <View className="h-px w-full bg-surface-3" />
                  <Text className="text-text font-medium">Verônica Duó</Text>
                </View>
              </View>

              {/* Categoria: Quality Assurance */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Quality Assurance</Text>
                <View className="bg-surface border border-border rounded-xl p-4 gap-2">
                  <Text className="text-text font-medium">Pedro Akylas</Text>
                  <View className="h-px w-full bg-surface-3" />
                  <Text className="text-text font-medium">Rafaela Marques</Text>
                  <View className="h-px w-full bg-surface-3" />
                  <Text className="text-text font-medium">Vinicius Vieira</Text>
                </View>
              </View>

              {/* Categoria: Developers */}
              <View className="mb-2">
                <Text className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Developers</Text>
                <View className="bg-surface border border-border rounded-xl p-4 gap-2">
                  <Text className="text-text font-medium">Wallace Coimbra</Text>
                  <View className="h-px w-full bg-surface-3" />
                  <Text className="text-text font-medium">Mateus Sepulvida Santana</Text>
                  <View className="h-px w-full bg-surface-3" />
                  <Text className="text-text font-medium">Javier Jose Garcia Penalver</Text>
                </View>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}
