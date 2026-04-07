import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    subtitle: 'Take control of your money.',
    title: 'Smart fund management\nmade simple',
  },
  {
    id: 2,
    subtitle: 'Track every penny.',
    title: 'Real-time insights\nfor your spending',
  },
  {
    id: 3,
    subtitle: 'Reach your goals.',
    title: 'Build a secure\nfinancial future',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.8 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.2 }]}
      />

      {/* Top Logo Area */}
      <View style={[styles.topSection, { paddingTop: Math.max(insets.top, 40) }]}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.appName}>SPENDLY</Text>
      </View>

      {/* Swipeable Content Area */}
      <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {SLIDES.map((slide) => (
              <View key={slide.id} style={styles.slide}>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
                <Text style={styles.title}>{slide.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                index === activeIndex && styles.activeDot
              ]} 
            />
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push({ pathname: '/(auth)/login', params: { mode: 'signup' } })}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push({ pathname: '/(auth)/login', params: { mode: 'login' } })}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.text,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.background,
  },
  appName: {
    fontSize: 16,
    color: Colors.text,
    letterSpacing: 2,
    fontWeight: '700',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  carouselContainer: {
    minHeight: 160,
    marginBottom: 20,
  },
  slide: {
    width: width - 48,
  },
  subtitle: {
    color: Colors.primaryLight,
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  title: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -0.5,
    marginBottom: 20,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    height: 4,
    width: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  buttonsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});