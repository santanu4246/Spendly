import { useThemeStore } from "@/store/theme-store";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const LOGO_SIZE = Math.min(196, SCREEN_WIDTH * 0.42);
const LOGO_RADIUS = 28;

/** Logo + title animate together (same duration & easing) */
const ENTRANCE_MS = 620;
/** Hold before welcome */
const HOLD_MS = 1750;

const easeOut = Easing.out(Easing.cubic);

/** Splash always uses a black canvas; title stays light for contrast */
const SPLASH_BG = "#000000";
const SPLASH_TITLE = "#FFFFFF";

export default function AnimatedSplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme === "dark";
  const didNavigate = useRef(false);

  const [fontsLoaded] = useFonts({
    DarkByte: require("../assets/DarkByte.ttf"),
  });

  const titleScale = useSharedValue(0.58);
  const titleOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.88);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    if (!fontsLoaded) return;

    titleScale.value = withTiming(1, {
      duration: ENTRANCE_MS,
      easing: easeOut,
    });
    titleOpacity.value = withTiming(1, {
      duration: ENTRANCE_MS,
      easing: Easing.out(Easing.quad),
    });

    logoScale.value = withTiming(1, {
      duration: ENTRANCE_MS,
      easing: easeOut,
    });
    logoOpacity.value = withTiming(1, {
      duration: ENTRANCE_MS,
      easing: Easing.out(Easing.quad),
    });

    const navTimer = setTimeout(() => {
      if (didNavigate.current) return;
      didNavigate.current = true;
      router.replace("/(auth)/welcome");
    }, ENTRANCE_MS + HOLD_MS);

    return () => clearTimeout(navTimer);
  }, [fontsLoaded, router]); // eslint-disable-line react-hooks/exhaustive-deps -- shared values stable

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const bottomPad = Math.max(insets.bottom, 16) + 36;

  const logoSource = isDark
    ? require("../assets/logoDark.jpg")
    : require("../assets/logo.png");

  if (!fontsLoaded) {
    return (
      <View
        style={[
          styles.root,
          { backgroundColor: SPLASH_BG, paddingTop: insets.top },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: SPLASH_BG,
          paddingTop: insets.top + (Platform.OS === "android" ? 8 : 0),
        },
      ]}
    >
      <StatusBar style="light" backgroundColor="transparent" />

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <Animated.View style={[styles.logoOuter, logoAnimatedStyle]}>
            <Image
              source={logoSource}
              style={styles.logoImage}
              resizeMode="contain"
              accessibilityLabel="Spendly logo"
            />
          </Animated.View>
        </View>

        <View style={[styles.titleSection, { paddingBottom: bottomPad }]}>
          <Animated.Text
            style={[
              styles.title,
              {
                color: SPLASH_TITLE,
                fontFamily: "DarkByte",
                textShadowColor: "rgba(0,0,0,0.35)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 8,
              },
              titleAnimatedStyle,
            ]}
          >
            Spendly
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  logoOuter: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_RADIUS,
  },
  titleSection: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 38,
    letterSpacing: 3,
    textAlign: "center",
    includeFontPadding: false,
    ...Platform.select({
      android: { textAlignVertical: "center" as const },
    }),
  },
});
