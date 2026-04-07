import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    badgeText: "Fund control",
    headline: "Smart money management made simple",
    subtext:
      "See income, expenses, and balance in one place. Add transactions in seconds.",
  },
  {
    id: "2",
    badgeText: "Insights",
    headline: "Understand where your money goes",
    subtext:
      "Category breakdown and trends help you stay on budget without spreadsheets.",
  },
  {
    id: "3",
    badgeText: "Goals",
    headline: "Build habits that stick",
    subtext:
      "Track progress, stay consistent, and celebrate wins on your financial journey.",
  },
];

type Slide = (typeof slides)[number];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const [activeIndex, setActiveIndex] = useState(0);

  const [fontsLoaded] = useFonts({
    DarkByte: require("../../assets/DarkByte.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  const isLight = activeTheme === "light";

  const gradientColors = isLight
    ? (["#E0FDD2", "#FFFFFF", "#FFFFFF"] as const)
    : (["#0B2E1F", "#0A0A0A", "#0A0A0A"] as const);
  const gradientLocations = [0, 0.4, 1] as const;

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={styles.slideContainer}>
      <View style={styles.contentContainer}>
        <View
          style={[styles.badge, isLight ? styles.badgeLight : styles.badgeDark]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isLight ? "#007725" : Colors.primaryLight },
            ]}
          >
            {item.badgeText}
          </Text>
        </View>

        <Text
          style={[
            styles.headline,
            { color: isLight ? "#111111" : Colors.text },
          ]}
        >
          {item.headline}
        </Text>

        <Text
          style={[
            styles.subtext,
            { color: isLight ? "#666666" : Colors.textSecondary },
          ]}
        >
          {item.subtext}
        </Text>
      </View>
    </View>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={[...gradientColors]}
      locations={[...gradientLocations]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientRoot}
      onLayout={onLayoutRootView}
    >
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text
            style={[
              styles.logoText,
              { color: isLight ? "#000000" : Colors.text },
            ]}
          >
            Spendly
          </Text>
        </View>

        <FlatList
          data={slides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.list}
        />

        <View
          style={[
            styles.footerContainer,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isLight
                      ? "#E0E0E0"
                      : "rgba(255,255,255,0.25)",
                  },
                  index === activeIndex && [
                    styles.activeDot,
                    { backgroundColor: isLight ? "#333333" : Colors.primary },
                  ],
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(auth)/login",
                params: { mode: "signup" },
              })
            }
          >
            <View
              style={[
                styles.getStartedButton,
                isLight
                  ? styles.getStartedButtonLight
                  : styles.getStartedButtonDark,
              ]}
            >
              <View style={styles.innerHighlight} />
              <Text
                style={[
                  styles.getStartedText,
                  { color: isLight ? "#FFFFFF" : "#000000" },
                ]}
              >
                Get Started
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.signInButton,
              isLight ? styles.signInButtonLight : styles.signInButtonDark,
            ]}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(auth)/login",
                params: { mode: "login" },
              })
            }
          >
            <Text
              style={[
                styles.signInText,
                { color: isLight ? "#000000" : Colors.text },
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientRoot: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    marginTop: 8,
    height: 40,
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "DarkByte",
    fontSize: 26,
    letterSpacing: 2,
  },
  list: {
    flex: 1,
    width: "100%",
  },
  slideContainer: {
    width,
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 14,
  },
  badgeLight: {
    backgroundColor: "#E7FFC6",
  },
  badgeDark: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  badgeText: {
    fontWeight: "600",
    fontSize: 13,
  },
  headline: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 30,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  subtext: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 8,
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 22,
    gap: 8,
  },
  dot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 28,
  },
  getStartedButton: {
    width: width - 48,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
  },
  getStartedButtonLight: {
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#222222",
  },
  getStartedButtonDark: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },
  innerHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signInButton: {
    width: width - 48,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  signInButtonLight: {
    backgroundColor: "#F0F0F0",
  },
  signInButtonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  signInText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
