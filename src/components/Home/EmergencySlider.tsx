import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  Vibration,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Siren, ShieldAlert, ChevronsRight, X } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { EmergencyState } from '@/types';

const TRACK_PADDING = 6;
const THUMB_SIZE = 52;
const TRACK_WIDTH = Dimensions.get('window').width - 48;
const MAX_DRAG = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;
const TRIGGER_THRESHOLD = MAX_DRAG * 0.85;
const FAB_SIZE = 56;

interface Props {
  onTrigger?: () => void;
}

export default function EmergencyButton({ onTrigger }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [sosState, setSosState] = useState<EmergencyState>('idle');

  const expandAnim = useRef(new Animated.Value(0)).current;
  const dragX = useRef(new Animated.Value(0)).current;
  const trackFill = useRef(new Animated.Value(0)).current;
  const triggered = useRef(false);

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.spring(expandAnim, {
      toValue,
      useNativeDriver: false,
      damping: 18,
      stiffness: 200,
    }).start();
  };

  const resetSlider = () => {
    triggered.current = false;
    setSosState('idle');
    Animated.parallel([
      Animated.spring(dragX, { toValue: 0, useNativeDriver: false, damping: 15 }),
      Animated.spring(trackFill, { toValue: 0, useNativeDriver: false, damping: 15 }),
    ]).start();
  };

  const collapse = () => {
    resetSlider();
    setExpanded(false);
    Animated.spring(expandAnim, {
      toValue: 0,
      useNativeDriver: false,
      damping: 18,
      stiffness: 200,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (sosState === 'sent') return;
        Vibration.vibrate(30);
      },
      onPanResponderMove: (_, g) => {
        if (triggered.current || sosState === 'sent') return;
        const x = Math.max(0, Math.min(g.dx, MAX_DRAG));
        dragX.setValue(x);
        trackFill.setValue(x / MAX_DRAG);

        if (x >= TRIGGER_THRESHOLD && !triggered.current) {
          triggered.current = true;
          Vibration.vibrate([0, 80, 60, 80]);
          setSosState('triggered');

          Animated.timing(dragX, {
            toValue: MAX_DRAG,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            Animated.timing(trackFill, {
              toValue: 1,
              duration: 100,
              useNativeDriver: false,
            }).start(() => {
              setSosState('sent');
              onTrigger?.();
              setTimeout(() => {
                resetSlider();
                collapse();
              }, 4000);
            });
          });
        }
      },
      onPanResponderRelease: () => {
        if (triggered.current) return;
        resetSlider();
      },
    })
  ).current;

  // Interpolações do expand
  const sliderWidth = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [FAB_SIZE, TRACK_WIDTH],
  });
  const sliderHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [FAB_SIZE, FAB_SIZE + TRACK_PADDING * 2],
  });
  const borderRadius = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [FAB_SIZE / 2, 999],
  });
  const sliderOpacity = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  const fabOpacity = expandAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [1, 0, 0],
  });

  const thumbBg = dragX.interpolate({
    inputRange: [0, MAX_DRAG],
    outputRange: [colors.emergency, colors.emergencyDark],
  });
  const fillWidth = trackFill.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - TRACK_PADDING * 2],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pill,
          {
            width: sliderWidth,
            height: sliderHeight,
            borderRadius,
          },
        ]}
      >
        {/* FAB (minimizado) */}
        <Animated.View style={[styles.fabContent, { opacity: fabOpacity }]}>
          <TouchableOpacity
            style={styles.fabTouchable}
            onPress={toggleExpand}
            activeOpacity={0.85}
          >
            <Siren size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Slider (expandido) */}
        <Animated.View style={[styles.sliderContent, { opacity: sliderOpacity }]}>
          {sosState === 'sent' ? (
            <View style={styles.sentRow}>
              <ShieldAlert size={16} color={colors.danger} />
              <Text style={styles.sentText}>Alerta enviado!</Text>
            </View>
          ) : (
            <>
              {/* Fill */}
              <Animated.View style={[styles.fill, { width: fillWidth }]} />

              {/* Label */}
              <View style={styles.labelRow} pointerEvents="none">
                {sosState === 'triggered'
                  ? <Siren size={13} color={colors.emergencyLight} />
                  : <ChevronsRight size={13} color={colors.emergencyLight} />
                }
                <Text style={styles.label}>
                  {sosState === 'triggered' ? 'Acionando...' : 'deslize para SOS'}
                </Text>
              </View>

              {/* Thumb */}
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.thumb,
                  { transform: [{ translateX: dragX }], backgroundColor: thumbBg },
                ]}
              >
                <Siren size={22} color="#fff" />
              </Animated.View>

              {/* Fechar */}
              <TouchableOpacity style={styles.closeBtn} onPress={collapse}>
                <X size={14} color={colors.emergencyLight} />
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    alignItems: 'flex-end',
  },
  pill: {
    backgroundColor: colors.emergencyMuted,
    borderWidth: 1.5,
    borderColor: colors.emergencyDark,
    overflow: 'hidden',
    justifyContent: 'center',
    // Sombra
    shadowColor: colors.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  fabContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabTouchable: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContent: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: TRACK_PADDING,
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    borderRadius: 999,
    backgroundColor: colors.emergency + '55',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginLeft: THUMB_SIZE + TRACK_PADDING,
    marginRight: 32, // espaço para o X
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.emergencyLight,
    letterSpacing: 0.4,
  },
  thumb: {
    position: 'absolute',
    left: TRACK_PADDING,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.emergency,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 4,
  },
  sentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sentText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },
});