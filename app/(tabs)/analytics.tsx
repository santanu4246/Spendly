import { AppHeader } from "@/components/layout/AppHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import {
    getCalendarMonthRange,
    sumExpensesForRange,
    sumIncomeForRange,
    useTransactionsStore
} from "@/store/transactions-store";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, G, Path } from "react-native-svg";

type ChartPeriod = "week" | "month";

export default function BalancesScreen() {
  const insets = useSafeAreaInsets();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const { transactions } = useTransactionsStore();
  const [period, setPeriod] = useState<ChartPeriod>("week");

  const currentMonthRange = getCalendarMonthRange();
  const monthExpenses = sumExpensesForRange(transactions, currentMonthRange);
  const monthIncome = sumIncomeForRange(transactions, currentMonthRange);


  const getDailySpending = () => {
    const days = period === "week" ? 7 : 14;
    const now = new Date();
    const dailyData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const dayTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return t.type === "expense" && tDate >= date && tDate < nextDate;
      });

      const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);

      dailyData.push({
        id: date.toISOString(),
        value: total,
        label: date
          .toLocaleDateString("en-US", { weekday: "short" })
          .slice(0, 3),
        date: date,
      });
    }

    return dailyData;
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

  const dailySpending = getDailySpending();
  const categoryBreakdown = getCategoryBreakdown();
  const maxSpending = Math.max(...dailySpending.map((d) => d.value), 1);
  const hasData = transactions.length > 0;

  
  const generatePieChart = () => {
    if (categoryBreakdown.length === 0) return [];

    const total = categoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0);
    let currentAngle = -90; 
    const radius = 120;
    const centerX = 130;
    const centerY = 130;

    return categoryBreakdown.map((cat) => {
      const percentage = cat.amount / total;
      
      const angle = percentage === 1 ? 359.99 : percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      
      const path = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `Z`,
      ].join(" ");

      currentAngle = endAngle;

      return {
        path,
        color: cat.color,
        percentage: Math.round(percentage * 100),
        name: cat.name,
      };
    });
  };

  const pieChartData = generatePieChart();

  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top + (Platform.OS === "android" ? 10 : 0), backgroundColor: Colors.background },
      ]}
    >
      <StatusBar
        barStyle={activeTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: Colors.text }]}>Analytics</Text>
          <Text style={[styles.subtitleText, { color: Colors.textSecondary }]}>Track your spending patterns</Text>
        </View>

        {hasData ? (
          <>
            
            <View style={styles.chartSection}>
              <View style={styles.chartHeader}>
                <Text style={[styles.sectionTitle, { color: Colors.text }]}>Daily Spending</Text>
                <SegmentedControl
                  options={[
                    { label: "7 Days", value: "week" },
                    { label: "14 Days", value: "month" },
                  ]}
                  selectedValue={period}
                  onValueChange={setPeriod}
                  style={styles.periodToggle}
                />
              </View>

              <View style={styles.chartContainer}>
                <View style={styles.chartYAxis}>
                  <Text style={[styles.yAxisLabel, { color: Colors.textSecondary }]}>
                    ${Math.round(maxSpending)}
                  </Text>
                  <Text style={[styles.yAxisLabel, { color: Colors.textSecondary }]}>
                    ${Math.round(maxSpending * 0.66)}
                  </Text>
                  <Text style={[styles.yAxisLabel, { color: Colors.textSecondary }]}>
                    ${Math.round(maxSpending * 0.33)}
                  </Text>
                  <Text style={[styles.yAxisLabel, { color: Colors.textSecondary }]}>$0</Text>
                </View>
                <View style={styles.chartBars}>
                  <View style={styles.gridLineContainer}>
                    <View style={[styles.gridLine, { top: "0%", borderColor: Colors.border }]} />
                    <View style={[styles.gridLine, { top: "33%", borderColor: Colors.border }]} />
                    <View style={[styles.gridLine, { top: "66%", borderColor: Colors.border }]} />
                    <View style={[styles.gridLine, { top: "100%", borderColor: Colors.border }]} />
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.barsScrollView}
                    contentContainerStyle={styles.barsScrollContent}
                  >
                    {dailySpending.map((day) => {
                      const heightPercentage =
                        maxSpending > 0 && day.value > 0
                          ? (day.value / maxSpending) * 100
                          : 0;
                      const hasSpending = day.value > 0;

                      return (
                        <View key={day.id} style={styles.barColumn}>
                          {hasSpending ? (
                            <View
                              style={[
                                styles.barBackground,
                                { height: `${heightPercentage}%` },
                              ]}
                            >
                              <LinearGradient
                                colors={["#E74C3C", "#C0392B"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={styles.barFill}
                              />
                            </View>
                          ) : (
                            <View style={[styles.emptyBar, { backgroundColor: Colors.border }]} />
                          )}
                          <Text style={[styles.xAxisLabel, { color: Colors.textSecondary }]}>{day.label}</Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>

            
            {categoryBreakdown.length > 0 && (
              <View style={styles.categorySection}>
                <Text style={[styles.sectionTitle, { color: Colors.text }]}>Category Breakdown</Text>

                <View style={styles.pieChartContainer}>
                  <Svg width="260" height="260" viewBox="0 0 260 260">
                    <G>
                      {pieChartData.map((slice, index) => (
                        <Path
                          key={index}
                          d={slice.path}
                          fill={slice.color}
                          opacity={0.9}
                        />
                      ))}
                     
                      <Circle
                        cx="130"
                        cy="130"
                        r="60"
                        fill={Colors.background}
                      />
                    </G>
                  </Svg>
                  <View style={styles.pieChartCenter}>
                    <Text style={[styles.pieChartCenterLabel, { color: Colors.textSecondary }]}>TOTAL</Text>
                    <Text style={[styles.pieChartCenterValue, { color: Colors.text }]}>
                      $
                      {categoryBreakdown
                        .reduce((sum, cat) => sum + cat.amount, 0)
                        .toFixed(0)}
                    </Text>
                  </View>
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
                      <Text style={[styles.legendName, { color: Colors.text }]}>{cat.name}</Text>
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
    marginBottom: 32,
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
  periodToggle: {
    width: 160,
  },
  chartContainer: {
    flexDirection: "row",
    height: 160,
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
    position: "absolute",
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
