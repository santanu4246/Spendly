import { NotificationIcon } from "@/components/ui/icons";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SwipeableTransaction } from "@/components/ui/swipeable-transaction";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";
import {
  getCalendarMonthRange,
  getRemainingBalance,
  getTransactionsForRange,
  getWeekRange,
  sumExpensesForRange,
  sumIncomeForRange,
  useTransactionsStore,
} from "@/store/transactions-store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ExpensePeriod = "weekly" | "monthly";

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `-$${formatted}` : `$${formatted}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userName = user?.name?.split(" ")[0] || "Alex";
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<ExpensePeriod>("weekly");
  const { transactions, isHydrated } = useTransactionsStore();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();

  const currentMonthRange = getCalendarMonthRange();
  const totalIncome = sumIncomeForRange(transactions, currentMonthRange);
  const totalExpenses = sumExpensesForRange(transactions, currentMonthRange);
  const remainingBalance = getRemainingBalance(transactions, currentMonthRange);

  const currentPeriodRange =
    period === "weekly" ? getWeekRange() : getCalendarMonthRange();
  const recentTransactions = getTransactionsForRange(
    transactions,
    currentPeriodRange,
  );

  const isLight = activeTheme === "light";

  const screenGradientColors = isLight
    ? (["#E0FDD2", "#FFFFFF", "#FFFFFF"] as const)
    : (["#0B2E1F", "#0A0A0A", "#0A0A0A"] as const);
  const screenGradientLocations = [0, 0.4, 1] as const;

  // A premium deep emerald/teal gradient for the hero card
  const heroGradientColors = ["#115E59", "#064E3B", "#022C22"] as const;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={[...screenGradientColors]}
        locations={[...screenGradientLocations]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.safeArea,
          { paddingTop: insets.top + (Platform.OS === "android" ? 10 : 0) },
        ]}
      >
        <StatusBar
          barStyle={isLight ? "dark-content" : "light-content"}
          backgroundColor="transparent"
          translucent
        />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View>
              <Text style={[styles.greetingSubtext, { color: "#888888" }]}>
                Good morning {userName} 🌻
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
                <NotificationIcon size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Premium Balance Card */}
          <View style={styles.heroCardContainer}>
            <LinearGradient
              colors={[...heroGradientColors]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              {/* Decorative abstract shapes for a premium card feel */}
              <View style={styles.heroDecoration1} />
              <View style={styles.heroDecoration2} />

              <View style={styles.heroTopRow}>
                <View>
                  <Text style={styles.heroLabel}>Total balance</Text>
                  <Text
                    style={[
                      styles.heroValue,
                      remainingBalance < 0 && styles.heroValueNegative,
                    ]}
                  >
                    {formatCurrency(remainingBalance)}
                  </Text>
                </View>
                <View style={styles.heroIconBadge}>
                  <Ionicons name="wallet" size={22} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.heroDivider} />

              <View style={styles.heroStatsRow}>
                {/* Income Stat */}
                <View style={styles.heroStatItem}>
                  <View
                    style={[
                      styles.heroStatIconContainer,
                      { backgroundColor: "rgba(255, 255, 255, 0.12)" },
                    ]}
                  >
                    <Ionicons name="arrow-down" size={14} color="#6EE7B7" />
                  </View>
                  <View style={styles.heroStatTextContainer}>
                    <Text style={styles.heroStatLabel}>Income</Text>
                    <Text style={styles.heroStatValue}>
                      {formatCurrency(totalIncome)}
                    </Text>
                  </View>
                </View>

                {/* Vertical Separator */}
                <View style={styles.heroStatSeparator} />

                {/* Expense Stat */}
                <View style={styles.heroStatItem}>
                  <View
                    style={[
                      styles.heroStatIconContainer,
                      { backgroundColor: "rgba(255, 255, 255, 0.12)" },
                    ]}
                  >
                    <Ionicons name="arrow-up" size={14} color="#FCA5A5" />
                  </View>
                  <View style={styles.heroStatTextContainer}>
                    <Text style={styles.heroStatLabel}>Expenses</Text>
                    <Text style={styles.heroStatValue}>
                      {formatCurrency(totalExpenses)}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Transactions Section */}
          <View style={styles.transactionsHeader}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>
              Transactions
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/add-transaction")}
              accessibilityRole="button"
              accessibilityLabel="Add Transaction"
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={28} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <SegmentedControl
            options={[
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ]}
            selectedValue={period}
            onValueChange={setPeriod}
            style={styles.segmentedControl}
          />

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <View
                style={[
                  styles.emptyStateIcon,
                  {
                    backgroundColor:
                      activeTheme === "dark"
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(16, 185, 129, 0.1)",
                  },
                ]}
              >
                <Ionicons
                  name="receipt-outline"
                  size={40}
                  color={Colors.primary}
                />
              </View>
              <Text style={[styles.emptyStateTitle, { color: Colors.text }]}>
                No transactions
              </Text>
              <Text
                style={[
                  styles.emptyStateDescription,
                  { color: Colors.textSecondary },
                ]}
              >
                {period === "weekly"
                  ? "Your recent transactions for this week will appear here."
                  : "Your recent transactions for this month will appear here."}
              </Text>
            </View>
          ) : (
            recentTransactions.map((transaction) => (
              <SwipeableTransaction
                key={transaction.id}
                transaction={transaction}
              />
            ))
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 16,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: {
    color: "#FAFAFA",
    fontSize: 10,
    fontWeight: "bold",
  },
  greetingSubtext: {
    fontSize: 17,
    marginBottom: 4,
    fontWeight: "500",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarText: {
    fontSize: 18,
    fontWeight: "700",
  },
  heroCardContainer: {
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  heroDecoration1: {
    position: "absolute",
    top: -30,
    right: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  heroDecoration2: {
    position: "absolute",
    bottom: -40,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  heroIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  heroValue: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginBottom: 20,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  heroValueNegative: {
    color: "#FEE2E2",
  },
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 20,
  },
  heroStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroStatItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  heroStatSeparator: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 16,
  },
  heroStatIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  heroStatTextContainer: {
    flex: 1,
  },
  heroStatLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    marginBottom: 2,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  heroStatValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  segmentedControl: {
    marginBottom: 20,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 30,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 24,
    marginTop: 10,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
