import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';

import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

type TipType = 'video' | 'portal' | 'info';

interface TipCard {
  id: string;
  title: string;
  description: string;
  type: TipType;
  actionText: string;
  url: string;
}


const MOCK_TIPS: TipCard[] = [
  {
    id: '1',
    title: 'Dicas de Segurança Pessoal',
    description: 'Aprenda a identificar situações de risco e saiba como agir para proteger sua integridade.',
    type: 'info',
    actionText: 'Ler mais',
    url: 'https://pc.sc.gov.br/?page_id=75',
  },
  {
    id: '2',
    title: 'Defesa Pessoal - O Básico',
    description: 'Assista ao vídeo com técnicas essenciais que podem fazer a diferença em momentos críticos.',
    type: 'video',
    actionText: 'Assistir Vídeo',
    url: 'https://youtu.be/PcIUq256Lts?si=vphq-ASOCAsnqkis',
  },
  {
    id: '3',
    title: 'Portal de Denúncias',
    description: 'Conheça seus direitos e veja os canais de denúncia online em caso de assédio ou perigo.',
    type: 'portal',
    actionText: 'Acessar Portal',
    url: 'https://www.delegaciaeletronica.policiacivil.sp.gov.br/',
  },

];


const getTipStyle = (type: TipType) => {
  switch (type) {
    case 'video':
      return { icon: 'play-circle', color: '#EF4444', bg: '#450A0A' };
    case 'portal':
      return { icon: 'globe', color: colors.primaryLight, bg: colors.primaryMuted };
    default:
      return { icon: 'bulb', color: '#F59E0B', bg: '#451A00' };
  }
};

export default function TipsScreen() {
  const handlePress = async (item: TipCard) => {
    try {
      if (item.type === 'video' || item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
        // Para vídeos, tentamos abrir diretamente no app do YouTube
        const supported = await Linking.canOpenURL(item.url);
        if (supported) {
          await Linking.openURL(item.url);
        } else {
          // Se não conseguir abrir o app, abre no navegador in-app
          await WebBrowser.openBrowserAsync(item.url);
        }
      } else {
        // Para outros links, usamos o WebBrowser para manter a experiência premium in-app
        await WebBrowser.openBrowserAsync(item.url, {
          toolbarColor: colors.primary,
          enableBarCollapsing: true,
          showTitle: true,
        });
      }
    } catch (error) {
      console.error('[TipsScreen] Error opening link:', error);
      Alert.alert('Erro', 'Não foi possível abrir o link solicitado.');
    }
  };


  const renderItem = ({ item }: { item: TipCard }) => {
    const styleInfo = getTipStyle(item.type);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: styleInfo.bg }]}>
            <Ionicons name={styleInfo.icon as keyof typeof Ionicons.glyphMap} size={28} color={styleInfo.color} />
          </View>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handlePress(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>{item.actionText}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primaryLight} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Dicas e Ajuda</Text>
      <Text style={styles.headerSubtitle}>
        Central de conhecimento para te manter mais segura.
      </Text>
      
      <FlatList
        data={MOCK_TIPS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryLight,
  },
});
