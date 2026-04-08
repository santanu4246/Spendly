import { EmptyState } from "@/components/ui/empty-state";
import { NotificationIcon } from "@/components/ui/icons";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import {
    getCalendarMonthRange,
    sumExpensesForRange,
    sumIncomeForRange,
    useTransactionsStore,
} from "@/store/transactions-store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function BalancesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const { transactions } = useTransactionsStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryType, setCategoryType] = useState<"income" | "expense">(
    "income",
  );

  const currentMonthRange = getCalendarMonthRange();
  const monthExpenses = sumExpensesForRange(transactions, currentMonthRange);
  const monthIncome = sumIncomeForRange(transactions, currentMonthRange);

  useEffect(() => {
    setSelectedCategory(null);
  }, [categoryType]);

  const getChartData = () => {
    const today = new Date();
    const chartData = [];

    const windowStart = new Date(today);
    windowStart.setDate(today.getDate() - 6);
    windowStart.setHours(0, 0, 0, 0);

    let cumulativeBalance = transactions
      .filter((t) => new Date(t.date) < windowStart)
      .reduce(
        (sum, t) => sum + (t.type === "income" ? t.amount : -t.amount),
        0,
      );

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const dayTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= date && tDate < nextDate;
      });

      dayTransactions.forEach((t) => {
        if (t.type === "income") {
          cumulativeBalance += t.amount;
        } else {
          cumulativeBalance -= t.amount;
        }
      });

      const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

      chartData.push({
        value: cumulativeBalance,
        label: dayNames[date.getDay()],
      });
    }

    return chartData;
  };

  const getCategoryBreakdown = (type: "income" | "expense") => {
    const filteredTransactions = transactions.filter((t) => t.type === type);
    const categoryTotals = new Map<
      string,
      { name: string; amount: number; color: string; icon: string }
    >();

    filteredTransactions.forEach((t) => {
      const existing = categoryTotals.get(t.category.id) || {
        name: t.category.name,
        amount: 0,
        color: t.category.color,
        icon: t.category.icon,
      };
      existing.amount += t.amount;
      categoryTotals.set(t.category.id, existing);
    });

    const totalAmount = Array.from(categoryTotals.values()).reduce(
      (sum, cat) => sum + cat.amount,
      0,
    );

    return Array.from(categoryTotals.entries())
      .map(([id, data]) => ({
        id,
        ...data,
        percentage:
          totalAmount > 0 ? Math.round((data.amount / totalAmount) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const chartData = getChartData();
  const categoryBreakdown = getCategoryBreakdown(categoryType);
  const hasData = transactions.length > 0;

  const values = chartData.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const range = maxValue - minValue;
  const padding = Math.max(range * 0.2, 50);

  const chartMaxValue = maxValue + padding;
  const chartMinValue = minValue - padding;

  // Format dates for header
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };
  const dateRangeStr = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  const chartColor = Colors.primary;
  const chartFillStartColor = Colors.primary;
  const chartFillEndColor = Colors.background;

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
              Track your financial patterns
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
              <View style={styles.chartHeaderCentered}>
                <Text
                  style={[styles.sectionTitleCentered, { color: Colors.text }]}
                >
                  Weekly Balance
                </Text>
                <Text
                  style={[
                    styles.dateRangeLabel,
                    { color: Colors.textSecondary },
                  ]}
                >
                  {dateRangeStr}
                </Text>
              </View>

              <View style={styles.chartContainer}>
                <LineChart
                  data={chartData}
                  height={180}
                  width={SCREEN_WIDTH - 80}
                  spacing={(SCREEN_WIDTH - 120) / 7}
                  initialSpacing={10}
                  endSpacing={10}
                  color={chartColor}
                  thickness={2.5}
                  startFillColor={chartFillStartColor}
                  endFillColor={chartFillEndColor}
                  startOpacity={0.4}
                  endOpacity={0}
                  areaChart
                  curved
                  hideDataPoints
                  rulesType="solid"
                  rulesColor={Colors.border}
                  rulesThickness={1}
                  xAxisThickness={1}
                  xAxisColor={Colors.border}
                  yAxisThickness={0}
                  yAxisTextStyle={{
                    color: Colors.textSecondary,
                    fontSize: 11,
                    fontWeight: "500",
                  }}
                  yAxisLabelPrefix="$"
                  noOfSections={4}
                  maxValue={chartMaxValue}
                  mostNegativeValue={chartMinValue}
                  showReferenceLine1
                  referenceLine1Position={0}
                  referenceLine1Config={{
                    color: Colors.textSecondary,
                    thickness: 2,
                    dashWidth: 4,
                    dashGap: 4,
                  }}
                  xAxisLabelTextStyle={{
                    color: Colors.textSecondary,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                  isAnimated
                  animationDuration={800}
                  pointerConfig={{
                    pointerStripHeight: 140,
                    pointerStripColor: chartColor,
                    pointerStripWidth: 1,
                    pointerColor: chartColor,
                    radius: 5,
                    pointerLabelWidth: 80,
                    pointerLabelHeight: 30,
                    activatePointersOnLongPress: false,
                    autoAdjustPointerLabelPosition: true,
                    pointerLabelComponent: (items: any) => {
                      return (
                        <View
                          style={{
                            height: 30,
                            width: 80,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: Colors.card,
                            borderRadius: 6,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 3,
                            elevation: 3,
                            borderWidth: 1,
                            borderColor: Colors.border,
                          }}
                        >
                          <Text
                            style={{
                              color: Colors.text,
                              fontSize: 13,
                              fontWeight: "bold",
                            }}
                          >
                            ${items[0].value.toFixed(0)}
                          </Text>
                        </View>
                      );
                    },
                  }}
                />
              </View>
            </View>

            {categoryBreakdown.length > 0 && (
              <View style={styles.categorySection}>
                <Text style={[styles.sectionTitle, { color: Colors.text }]}>
                  Category Breakdown
                </Text>

                <SegmentedControl
                  options={[
                    { label: "Income", value: "income" },
                    { label: "Expense", value: "expense" },
                  ]}
                  selectedValue={categoryType}
                  onValueChange={setCategoryType}
                  style={styles.categorySegmentedControl}
                />

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
                              : categoryType === "income"
                                ? "TOTAL INCOME"
                                : "TOTAL EXPENSES"}
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
  chartHeaderCentered: {
    alignItems: "center",
    marginBottom: 24,
  },
  sectionTitleCentered: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dateRangeLabel: {
    fontSize: 14,
    fontWeight: "500",
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
    height: 220,
    marginBottom: 16,
    overflow: "hidden",
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
  categorySegmentedControl: {
    marginTop: 16,
    marginBottom: 8,
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
