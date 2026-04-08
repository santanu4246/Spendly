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
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    badgeText: "Fund control",
    headline: "Smart money management made simple",
    subtext:
      "See income, expenses, and balance in one place. Add transactions in seconds.",
    widget: "balance",
  },
  {
    id: "2",
    badgeText: "Insights",
    headline: "Understand where your money goes",
    subtext:
      "Category breakdown and trends help you stay on budget without spreadsheets.",
    widget: "chart",
  },
  {
    id: "3",
    badgeText: "Goals",
    headline: "Build habits that stick",
    subtext:
      "Track progress, stay consistent, and celebrate wins on your financial journey.",
    widget: "goal",
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

  const renderWidget = (widgetType: string, isLight: boolean) => {
    switch (widgetType) {
      case "balance":
        return (
          <View style={[styles.widgetCard, { backgroundColor: isLight ? "#FFFFFF" : Colors.card, shadowColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.5)", shadowOpacity: 1, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12, borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }]}>
            <View style={styles.widgetHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={[styles.widgetIconBg, { backgroundColor: isLight ? "#E7FFC6" : "rgba(16, 185, 129, 0.15)" }]}>
                  <Ionicons name="wallet" size={24} color={isLight ? "#007725" : Colors.primaryLight} />
                </View>
                <Text style={[styles.widgetTitle, { color: isLight ? "#666666" : Colors.textSecondary }]}>Total Balance</Text>
              </View>
            </View>
            <Text style={[styles.widgetValue, { color: isLight ? "#111111" : Colors.text }]}>$12,450.00</Text>
            <View style={[styles.widgetFooter, { borderTopColor: isLight ? "#F5F5F5" : Colors.border }]}>
              <View style={[styles.trendBadge, { backgroundColor: isLight ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.15)" }]}>
                <Ionicons name="trending-up" size={14} color={isLight ? "#007725" : Colors.primary} />
                <Text style={[styles.widgetFooterText, { color: isLight ? "#007725" : Colors.primary }]}>+ $2,400</Text>
              </View>
              <Text style={[styles.widgetFooterSubtext, { color: isLight ? "#888888" : Colors.textSecondary }]}>this month</Text>
            </View>
          </View>
        );
      case "chart":
        return (
          <View style={[styles.widgetCard, { backgroundColor: isLight ? "#FFFFFF" : Colors.card, shadowColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.5)", shadowOpacity: 1, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12, borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }]}>
            <View style={[styles.widgetHeader, { marginBottom: 24 }]}>
              <Text style={[styles.widgetTitle, { color: isLight ? "#111111" : Colors.text, fontSize: 18, fontWeight: "700" }]}>Analytics</Text>
              <Ionicons name="bar-chart" size={22} color={isLight ? "#A0A0A0" : Colors.textSecondary} />
            </View>
            <View style={styles.mockChart}>
              <View style={styles.mockBarCol}>
                <View style={[styles.mockBar, { height: 45, backgroundColor: isLight ? "#F0F0F0" : Colors.border }]} />
              </View>
              <View style={styles.mockBarCol}>
                <View style={[styles.mockBar, { height: 75, backgroundColor: isLight ? "#F0F0F0" : Colors.border }]} />
              </View>
              <View style={styles.mockBarCol}>
                <View style={[styles.mockBar, { height: 120, backgroundColor: Colors.primary }]} />
              </View>
              <View style={styles.mockBarCol}>
                <View style={[styles.mockBar, { height: 60, backgroundColor: isLight ? "#F0F0F0" : Colors.border }]} />
              </View>
              <View style={styles.mockBarCol}>
                <View style={[styles.mockBar, { height: 90, backgroundColor: isLight ? "#F0F0F0" : Colors.border }]} />
              </View>
            </View>
          </View>
        );
      case "goal":
        return (
          <View style={[styles.widgetCard, { backgroundColor: isLight ? "#FFFFFF" : Colors.card, shadowColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.5)", shadowOpacity: 1, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12, borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }]}>
            <View style={[styles.widgetHeader, { alignItems: "center", marginBottom: 20 }]}>
              <View style={[styles.widgetIconBg, { backgroundColor: isLight ? "#E7FFC6" : "rgba(16, 185, 129, 0.15)", borderRadius: 14, width: 48, height: 48 }]}>
                <Ionicons name="car" size={24} color={isLight ? "#007725" : Colors.primaryLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.widgetTitle, { color: isLight ? "#111111" : Colors.text, fontSize: 17, marginBottom: 4, fontWeight: "700" }]}>New Car Fund</Text>
                <Text style={[styles.widgetSubTitle, { color: isLight ? "#666666" : Colors.textSecondary, fontSize: 14 }]}>$8,000 / $10,000</Text>
              </View>
            </View>
            <View style={[styles.mockProgressBg, { backgroundColor: isLight ? "#F0F0F0" : Colors.border }]}>
              <View style={[styles.mockProgressFill, { backgroundColor: isLight ? "#007725" : Colors.primary, width: "80%" }]} />
            </View>
            <Text style={[styles.goalPercentage, { color: isLight ? "#007725" : Colors.primary }]}>80% Completed</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={styles.slideContainer}>
      <View style={styles.widgetContainer}>
        {renderWidget(item.widget, isLight)}
      </View>
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
    justifyContent: "center",
    paddingBottom: 24,
  },
  widgetContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  widgetCard: {
    width: width - 48,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
  },
  widgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  widgetIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  widgetValue: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 24,
    letterSpacing: -1,
  },
  widgetFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
    marginRight: 8,
  },
  widgetFooterText: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },
  widgetFooterSubtext: {
    fontSize: 14,
    fontWeight: "500",
  },
  mockChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  mockBarCol: {
    flex: 1,
    alignItems: "center",
  },
  mockBar: {
    width: 28,
    borderRadius: 8,
  },
  widgetSubTitle: {
    fontSize: 14,
    marginTop: 2,
  },
  mockProgressBg: {
    height: 14,
    borderRadius: 7,
    width: "100%",
    marginTop: 8,
    overflow: "hidden",
  },
  mockProgressFill: {
    height: "100%",
    borderRadius: 7,
  },
  goalPercentage: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 12,
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
