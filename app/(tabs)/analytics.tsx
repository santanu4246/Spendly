import { EmptyState } from "@/components/ui/empty-state";
import { NotificationIcon } from "@/components/ui/icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import {
  getCalendarMonthRange,
  sumExpensesForRange,
  sumIncomeForRange,
  useTransactionsStore,
} from "@/store/transactions-store";
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
import { BarChart, PieChart, LineChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BalancesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const { transactions } = useTransactionsStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentMonthRange = getCalendarMonthRange();
  const monthExpenses = sumExpensesForRange(transactions, currentMonthRange);
  const monthIncome = sumIncomeForRange(transactions, currentMonthRange);

  const getMonthlySpending = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const currentDay = now.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const weeklyData = [];
    // 4 weeks only — last week absorbs remaining days
    const weekRanges = [
      [1, 7],
      [8, 14],
      [15, 21],
      [22, daysInMonth],
    ];

    for (let w = 0; w < weekRanges.length; w++) {
      const [start, end] = weekRanges[w];

      // Stop at the current week — don't plot future weeks
      if (start > currentDay) break;

      let weekTotal = 0;
      for (let day = start; day <= Math.min(end, currentDay); day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        const dayExpenses = transactions.filter((t) => {
          const tDate = new Date(t.date);
          return t.type === "expense" && tDate >= date && tDate < nextDate;
        });

        weekTotal += dayExpenses.reduce((sum, t) => sum + t.amount, 0);
      }

      weeklyData.push({
        value: weekTotal,
        label: `Week ${w + 1}`,
      });
    }

    return weeklyData;
  };

  const getCategoryBreakdown = () => {
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense",
    );
    const categoryTotals = new Map<
      string,
      { name: string; amount: number; color: string; icon: string }
    >();

    expenseTransactions.forEach((t) => {
      const existing = categoryTotals.get(t.category.id) || {
        name: t.category.name,
        amount: 0,
        color: t.category.color,
        icon: t.category.icon,
      };
      existing.amount += t.amount;
      categoryTotals.set(t.category.id, existing);
    });

    const totalExpenses = Array.from(categoryTotals.values()).reduce(
      (sum, cat) => sum + cat.amount,
      0,
    );

    return Array.from(categoryTotals.entries())
      .map(([id, data]) => ({
        id,
        ...data,
        percentage:
          totalExpenses > 0
            ? Math.round((data.amount / totalExpenses) * 100)
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const monthlySpending = getMonthlySpending();
  const categoryBreakdown = getCategoryBreakdown();
  const maxSpending = Math.max(...monthlySpending.map((d) => d.value), 1);
  const hasData = transactions.length > 0;

  const generatePieChart = () => {
    if (categoryBreakdown.length === 0) return [];

    return categoryBreakdown.map((cat) => ({
      value: cat.amount,
      color: cat.color,
      focused: selectedCategory === cat.name,
      text: `${cat.percentage}%`,
      name: cat.name,
    }));
  };

  const pieChartData = generatePieChart();
  const selectedCategoryData = selectedCategory
    ? categoryBreakdown.find((cat) => cat.name === selectedCategory)
    : null;

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top + (Platform.OS === "android" ? 10 : 0),
          backgroundColor: Colors.background,
        },
      ]}
    >
      <StatusBar
        barStyle={activeTheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <View>
            <Text style={[styles.titleText, { color: Colors.text }]}>
              Analytics
            </Text>
            <Text
              style={[styles.subtitleText, { color: Colors.textSecondary }]}
            >
              Track your spending patterns
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

        {hasData ? (
          <>
            <View style={styles.chartSection}>
              <View style={styles.chartHeader}>
                <Text style={[styles.sectionTitle, { color: Colors.text }]}>
                  Monthly Spending
                </Text>
                <Text style={[styles.monthLabel, { color: Colors.textSecondary }]}>
                  {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </Text>
              </View>

              <View style={styles.chartContainer}>
                <LineChart
                  data={monthlySpending}
                  height={200}
                  width={340}
                  spacing={80}
                  initialSpacing={30}
                  endSpacing={30}
                  color={Colors.primary}
                  thickness={3}
                  startFillColor={Colors.primary}
                  endFillColor={Colors.primary}
                  startOpacity={0.25}
                  endOpacity={0.01}
                  areaChart
                  curved
                  rulesType="solid"
                  rulesColor={Colors.border}
                  rulesThickness={1}
                  xAxisThickness={1}
                  xAxisColor={Colors.border}
                  yAxisThickness={1}
                  yAxisColor={Colors.border}
                  yAxisTextStyle={{ 
                    color: Colors.textSecondary, 
                    fontSize: 11,
                    fontWeight: "500",
                  }}
                  yAxisLabelPrefix="$"
                  xAxisLabelTextStyle={{
                    color: Colors.textSecondary,
                    fontSize: 11,
                    fontWeight: "500",
                  }}
                  noOfSections={4}
                  maxValue={maxSpending > 0 ? Math.ceil(maxSpending * 1.2) : 100}
                  isAnimated
                  animationDuration={800}
                  dataPointsColor={Colors.primary}
                  dataPointsRadius={5}
                  showVerticalLines
                  verticalLinesColor={Colors.border}
                  verticalLinesThickness={1}
                  verticalLinesStrokeDashArray={[4, 4]}
                  focusEnabled
                  showStripOnFocus
                  stripColor={Colors.primary}
                  stripWidth={2}
                  stripOpacity={0.5}
                  showTextOnFocus
                  unFocusOnPressOut
                  delayBeforeUnFocus={2000}
                  focusedDataPointColor={Colors.primary}
                  focusedDataPointRadius={7}
                />
              </View>
            </View>

            {categoryBreakdown.length > 0 && (
              <View style={styles.categorySection}>
                <Text style={[styles.sectionTitle, { color: Colors.text }]}>
                  Category Breakdown
                </Text>

                <View style={styles.pieChartContainer}>
                  <PieChart
                    data={pieChartData}
                    donut
                    radius={120}
                    innerRadius={70}
                    innerCircleColor={Colors.background}
                    centerLabelComponent={() => {
                      return (
                        <View style={styles.pieChartCenter}>
                          <Text
                            style={[
                              styles.pieChartCenterLabel,
                              { color: Colors.textSecondary },
                            ]}
                          >
                            {selectedCategoryData
                              ? selectedCategoryData.name.toUpperCase()
                              : "TOTAL"}
                          </Text>
                          <Text
                            style={[
                              styles.pieChartCenterValue,
                              { color: Colors.text },
                            ]}
                          >
                            $
                            {selectedCategoryData
                              ? selectedCategoryData.amount.toFixed(0)
                              : categoryBreakdown
                                  .reduce((sum, cat) => sum + cat.amount, 0)
                                  .toFixed(0)}
                          </Text>
                        </View>
                      );
                    }}
                    onPress={(item: any, index: number) => {
                      if (selectedCategory === categoryBreakdown[index].name) {
                        setSelectedCategory(null);
                      } else {
                        setSelectedCategory(categoryBreakdown[index].name);
                      }
                    }}
                    animationDuration={500}
                  />
                </View>

                <View style={styles.categoryLegend}>
                  {categoryBreakdown.map((cat) => (
                    <View key={cat.id} style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: cat.color },
                        ]}
                      />
                      <Text style={[styles.legendName, { color: Colors.text }]}>
                        {cat.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <EmptyState
            icon="pie-chart-outline"
            title="No Analytics Yet"
            description="Add some transactions to see your spending analytics and category breakdown."
            style={styles.emptyState}
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
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
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
  },
  chartSection: {
    marginBottom: 32,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  chartContainer: {
    height: 240,
    marginBottom: 16,
  },
  chartYAxis: {
    justifyContent: "space-between",
    paddingRight: 12,
    paddingBottom: 20,
  },
  yAxisLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  chartBars: {
    flex: 1,
    position: "relative",
    paddingBottom: 20,
  },
  gridLineContainer: {
    ...StyleSheet.absoluteFillObject,
    paddingBottom: 20,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    borderBottomWidth: 1,
    borderStyle: "dashed",
  },
  barsScrollView: {
    flex: 1,
  },
  barsScrollContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    gap: 16,
  },
  barColumn: {
    width: 28,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barBackground: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  emptyBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    position: "absolute",
    bottom: 0,
  },
  xAxisLabel: {
    position: "absolute",
    bottom: -20,
    fontSize: 10,
  },
  categorySection: {
    marginBottom: 32,
  },
  pieChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
    position: "relative",
  },
  pieChartCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  pieChartCenterLabel: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pieChartCenterValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  categoryLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendName: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    marginTop: 40,
    marginBottom: 40,
  },
});
