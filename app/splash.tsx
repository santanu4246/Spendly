import { DarkColors, LightColors } from "@/constants/colors";
import { useThemeStore } from "@/store/theme-store";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Dimensions, Image, Platform, StyleSheet, View } from "react-native";
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

const ENTRANCE_MS = 620;
const HOLD_MS = 1750;

const easeOut = Easing.out(Easing.cubic);

const SPLASH_LOGO = require("../assets/splash.png");

export default function AnimatedSplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeTheme, isHydrated } = useThemeStore();
  const didNavigate = useRef(false);

  const [fontsLoaded] = useFonts({
    DarkByte: require("../assets/DarkByte.ttf"),
  });

  useLayoutEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  const titleScale = useSharedValue(0.58);
  const titleOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.88);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    if (!fontsLoaded || !isHydrated) return;

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
  }, [fontsLoaded, isHydrated, router]); 

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const bottomPad = Math.max(insets.bottom, 16) + 36;

  const isDark = activeTheme === "dark";
  const Colors = isDark ? DarkColors : LightColors;
  const bgColor = isDark ? "#000000" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";

  if (!fontsLoaded || !isHydrated) {
    return (
      <View
        style={[
          styles.root,
          { backgroundColor: bgColor, paddingTop: insets.top },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: bgColor,
          paddingTop: insets.top + (Platform.OS === "android" ? 8 : 0),
        },
      ]}
    >
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor="transparent"
      />

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <Animated.View style={[styles.logoOuter, logoAnimatedStyle]}>
            <Image
              source={SPLASH_LOGO}
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
                color: textColor,
                fontFamily: "DarkByte",
                textShadowColor: isDark
                  ? "rgba(0,0,0,0.35)"
                  : "rgba(0,0,0,0.06)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: isDark ? 8 : 4,
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
