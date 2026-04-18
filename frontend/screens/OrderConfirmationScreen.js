import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OrderConfirmationScreen({ route, navigation }) {
  const { restaurantName, total, itemCount } = route.params || {};

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Pulse the check icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const eta = new Date(now.getTime() + 35 * 60000);
  const etaStr = eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.container}>
      {/* Background decorative circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.content}>

        {/* Animated Success Circle */}
        <Animated.View style={[styles.successCircleOuter, { transform: [{ scale: scaleAnim }, { scale: pulseAnim }] }]}>
          <View style={styles.successCircleInner}>
            <Ionicons name="checkmark" size={56} color="#fff" />
          </View>
        </Animated.View>

        {/* Order Placed Text */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.title}>Order Placed! 🎉</Text>
          <Text style={styles.subtitle}>
            Your delicious food from{'\n'}
            <Text style={styles.restaurantHighlight}>{restaurantName || 'the restaurant'}</Text>
            {'\n'}is on its way!
          </Text>
        </Animated.View>

        {/* Order Info Cards */}
        <Animated.View style={[styles.infoGrid, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.infoCard}>
            <Ionicons name="receipt-outline" size={24} color="#4f46e5" />
            <Text style={styles.infoLabel}>Order</Text>
            <Text style={styles.infoValue}>{orderNumber}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={24} color="#4f46e5" />
            <Text style={styles.infoLabel}>ETA</Text>
            <Text style={styles.infoValue}>{etaStr}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="cube-outline" size={24} color="#4f46e5" />
            <Text style={styles.infoLabel}>Items</Text>
            <Text style={styles.infoValue}>{itemCount || '–'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="cash-outline" size={24} color="#4f46e5" />
            <Text style={styles.infoLabel}>Total</Text>
            <Text style={styles.infoValue}>${total ? total.toFixed(2) : '–'}</Text>
          </View>
        </Animated.View>

        {/* Delivery Steps */}
        <Animated.View style={[styles.stepsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.stepsTitle}>Live Tracking</Text>
          {[
            { icon: 'checkmark-circle', label: 'Order Confirmed', done: true },
            { icon: 'restaurant', label: 'Preparing your food', done: true },
            { icon: 'bicycle', label: 'Out for Delivery', done: false },
            { icon: 'home', label: 'Delivered', done: false },
          ].map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={[styles.stepDot, step.done && styles.stepDotDone]}>
                <Ionicons
                  name={step.icon}
                  size={14}
                  color={step.done ? '#fff' : '#94a3b8'}
                />
              </View>
              <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>
                {step.label}
              </Text>
              {step.done && (
                <Ionicons name="checkmark" size={14} color="#22c55e" style={{ marginLeft: 'auto' }} />
              )}
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Bottom Button */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.85}
        >
          <Ionicons name="home-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faff',
  },
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(79, 70, 229, 0.06)',
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(79, 70, 229, 0.04)',
    bottom: 140,
    left: -60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  successCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  successCircleInner: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1e1b4b',
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 32,
  },
  restaurantHighlight: {
    color: '#4f46e5',
    fontWeight: '800',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
    marginBottom: 20,
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    width: (width - 72) / 2,
    shadowColor: '#1e1b4b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e1b4b',
    fontWeight: '900',
  },
  stepsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#1e1b4b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1e1b4b',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepDotDone: {
    backgroundColor: '#4f46e5',
  },
  stepLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  stepLabelDone: {
    color: '#1e1b4b',
    fontWeight: '700',
  },
  footer: {
    padding: 24,
    paddingBottom: 30,
  },
  homeBtn: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  homeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
