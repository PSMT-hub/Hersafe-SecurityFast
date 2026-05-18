import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AlertTriangle, Check, ChevronDown, MapPin, Users, X } from 'lucide-react-native';
import { Person } from '../../types';
import { Group } from '@/types/group';
import PersonCard from './PersonCard';
import { colors } from '../../theme/colors';

const { height: SCREEN_H } = Dimensions.get('window');

const SNAP = {
  expanded: SCREEN_H * 0.35,
  half: SCREEN_H * 0.62,
  collapsed: SCREEN_H * 0.96,
};

interface Props {
  persons: Person[];
  groups: Group[];
  selectedGroupId: string | null;
  selectedGroupName?: string;
  isLoading?: boolean;
  placesCount?: number;
  onSelectGroup: (groupId: string) => void;
  onPersonPress?: (person: Person) => void;
}

export default function PeopleDrawer({
  persons,
  groups,
  selectedGroupId,
  selectedGroupName,
  isLoading = false,
  placesCount = 0,
  onSelectGroup,
  onPersonPress,
}: Props) {
  const translateY = useRef(new Animated.Value(SNAP.half)).current;
  const lastY = useRef(SNAP.half);
  const isExpanded = useRef(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);

  const snapTo = useCallback((y: number) => {
    Animated.spring(translateY, {
      toValue: y,
      useNativeDriver: true,
      damping: 22,
      stiffness: 200,
    }).start();
    lastY.current = y;
    isExpanded.current = y === SNAP.expanded;
  }, [translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderGrant: () => {
        translateY.stopAnimation((val) => {
          lastY.current = val;
        });
      },
      onPanResponderMove: (_, g) => {
        let next = lastY.current + g.dy;
        if (next < SNAP.expanded) next = SNAP.expanded;
        if (next > SNAP.collapsed) next = SNAP.collapsed;

        translateY.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const current = lastY.current + g.dy;
        const velocity = g.vy;

        let target: number;

        if (velocity > 0.6) {
          target = current < SNAP.half ? SNAP.half : SNAP.collapsed;
        } else if (velocity < -0.6) {
          target = current > SNAP.half ? SNAP.half : SNAP.expanded;
        } else {
          const points = [SNAP.expanded, SNAP.half, SNAP.collapsed];
          target = points.reduce((a, b) =>
            Math.abs(b - current) < Math.abs(a - current) ? b : a
          );
        }

        snapTo(target);
      },
    })
  ).current;

  const alertCount = persons.filter((p) => p.status === 'alert').length;
  const hasGroups = groups.length > 0;

  function handleSelectGroup(groupId: string) {
    onSelectGroup(groupId);
    setIsGroupModalVisible(false);
  }

  return (
    <>
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Users size={15} color={colors.textMuted} />
              <Text style={styles.title}>Minha Rede</Text>
            </View>
            <View style={styles.badges}>
              {alertCount > 0 && (
                <View style={styles.alertBadge}>
                  <AlertTriangle size={11} color={colors.warning} />
                  <Text style={styles.alertBadgeText}>{alertCount}</Text>
                </View>
              )}
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{persons.length}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.groupSelectorArea}>
          <TouchableOpacity
            style={[styles.groupSelector, !hasGroups && styles.groupSelectorDisabled]}
            onPress={() => hasGroups && setIsGroupModalVisible(true)}
            activeOpacity={0.75}
            disabled={!hasGroups}
          >
            <View style={styles.groupSelectorTextArea}>
              <Text style={styles.selectorLabel}>Grupo selecionado</Text>
              <Text style={styles.selectorValue} numberOfLines={1}>
                {selectedGroupName ?? 'Nenhum grupo'}
              </Text>
            </View>
            <ChevronDown size={18} color={hasGroups ? colors.text : colors.textDim} />
          </TouchableOpacity>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Users size={13} color={colors.textMuted} />
              <Text style={styles.summaryText}>{persons.length} membros no mapa</Text>
            </View>
            <View style={styles.summaryItem}>
              <MapPin size={13} color={colors.textMuted} />
              <Text style={styles.summaryText}>{placesCount} locais</Text>
            </View>
          </View>
        </View>

        <ScrollView
          scrollEnabled={isExpanded.current}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {isLoading ? (
            <View style={styles.stateBox}>
              <ActivityIndicator color={colors.primaryLight} />
              <Text style={styles.stateText}>Carregando dados do grupo...</Text>
            </View>
          ) : !hasGroups ? (
            <View style={styles.stateBox}>
              <Text style={styles.stateTitle}>Nenhum grupo encontrado</Text>
              <Text style={styles.stateText}>Crie ou aceite um convite para ver pessoas no mapa.</Text>
            </View>
          ) : persons.length === 0 ? (
            <View style={styles.stateBox}>
              <Text style={styles.stateTitle}>Sem localizacao disponivel</Text>
              <Text style={styles.stateText}>
                Os membros deste grupo ainda nao possuem uma localizacao registrada.
              </Text>
            </View>
          ) : (
            persons.map((person, i) => (
              <React.Fragment key={person.id}>
                <PersonCard person={person} onPress={() => onPersonPress?.(person)} />
                {i < persons.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))
          )}
        </ScrollView>
      </Animated.View>

      <Modal
        animationType="fade"
        transparent
        visible={isGroupModalVisible}
        onRequestClose={() => setIsGroupModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsGroupModalVisible(false)}>
          <Pressable style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar grupo</Text>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsGroupModalVisible(false)}
                activeOpacity={0.75}
              >
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {groups.map((group) => {
                const isSelected = group._id === selectedGroupId;

                return (
                  <TouchableOpacity
                    key={group._id}
                    style={[styles.groupOption, isSelected && styles.groupOptionSelected]}
                    onPress={() => handleSelectGroup(group._id)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.groupOptionTextArea}>
                      <Text style={styles.groupOptionName}>{group.nome}</Text>
                      {group.descricao ? (
                        <Text style={styles.groupOptionDescription} numberOfLines={1}>
                          {group.descricao}
                        </Text>
                      ) : null}
                    </View>
                    {isSelected && <Check size={18} color={colors.safe} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 20,
  },
  handleArea: {
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warningMuted,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  alertBadgeText: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: colors.surface3,
    borderRadius: 99,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
  },
  groupSelectorArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  groupSelector: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  groupSelectorDisabled: {
    opacity: 0.65,
  },
  groupSelectorTextArea: {
    flex: 1,
    gap: 2,
  },
  selectorLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textDim,
    textTransform: 'uppercase',
  },
  selectorValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  summaryText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  list: {
    paddingBottom: 120,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  stateBox: {
    minHeight: 132,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  stateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  stateText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000099',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '70%',
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  modalHeader: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface2,
  },
  groupOption: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupOptionSelected: {
    backgroundColor: colors.safeMuted,
  },
  groupOptionTextArea: {
    flex: 1,
    gap: 2,
  },
  groupOptionName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  groupOptionDescription: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
