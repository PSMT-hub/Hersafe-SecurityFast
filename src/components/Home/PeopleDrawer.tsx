import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Users, AlertTriangle } from 'lucide-react-native';
import { Person } from '../../types';
import PersonCard from './PersonCard';
import { colors } from '../../theme/colors';

const { height: SCREEN_H } = Dimensions.get('window');

// Altura visível mínima: handle (14px) + padding (12px) + header (~44px) = ~70px
const PEEK_HEIGHT = 70;

const SNAP = {
  expanded:  SCREEN_H * 0.35,          // 65% da tela visível
  half:      SCREEN_H * 0.62,          // ~38% visível
  collapsed: SCREEN_H - PEEK_HEIGHT,   // só handle + header aparecem
};

interface Props {
  persons: Person[];
  onPersonPress?: (person: Person) => void;
}

export default function PeopleDrawer({ persons, onPersonPress }: Props) {
  const translateY = useRef(new Animated.Value(SNAP.half)).current;
  const lastY = useRef(SNAP.half);
  const isExpanded = useRef(false);

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
        translateY.stopAnimation((val) => { lastY.current = val; });
      },
      onPanResponderMove: (_, g) => {
        const next = lastY.current + g.dy;
        // Limita entre o topo expandido e o mínimo (peek)
        if (next >= SNAP.expanded && next <= SNAP.collapsed) {
          translateY.setValue(next);
        }
      },
      onPanResponderRelease: (_, g) => {
        const current = lastY.current + g.dy;
        const velocity = g.vy;

        let target: number;

        if (velocity > 0.6) {
          // Flick para baixo — vai para o snap abaixo do atual
          if (current < SNAP.half) target = SNAP.half;
          else target = SNAP.collapsed;
        } else if (velocity < -0.6) {
          // Flick para cima — vai para o snap acima do atual
          if (current > SNAP.half) target = SNAP.half;
          else target = SNAP.expanded;
        } else {
          // Snap para o mais próximo
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

  return (
    <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>

      {/* ── Handle + Header (área de drag) ── */}
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

      {/* ── Lista ── */}
      <ScrollView
        scrollEnabled={isExpanded.current}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {persons.map((person, i) => (
          <React.Fragment key={person.id}>
            <PersonCard person={person} onPress={() => onPersonPress?.(person)} />
            {i < persons.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    // top: 0 garante que o sheet tem altura total; translateY controla a posição
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
    letterSpacing: 0.3,
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
  list: {
    paddingBottom: 120, // espaço para o FAB não cobrir o último card
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
});