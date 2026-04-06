import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { AtmIcon } from '@/components/ui/icons';
import { AppHeader } from '@/components/layout/AppHeader';
import { useAuthStore } from '@/store/auth-store';
import { Ionicons } from '@expo/vector-icons';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { 
  useTransactionsStore, 
  getCalendarMonthRange,
  getWeekRange,
  sumIncomeForRange, 
  sumExpensesForRange,
  getRemainingBalance,
  getTransactionsForRange
} from '@/store/transactions-store';
import { EmptyState } from '@/components/ui/empty-state';

type ExpensePeriod = 'weekly' | 'monthly';

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return value < 0 ? `-$${formatted}` : `$${formatted}`;
}

export default function HomeScreen() {
  const { user } = useAuthStore();
  const userName = user?.name?.split(' ')[0] || 'Alex';
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<ExpensePeriod>('weekly');
  const { transactions, isHydrated } = useTransactionsStore();

  const comparisonLabel = period === 'weekly' ? 'last week' : 'last month';

  const currentMonthRange = getCalendarMonthRange();
  const totalIncome = sumIncomeForRange(transactions, currentMonthRange);
  const totalExpenses = sumExpensesForRange(transactions, currentMonthRange);
  const remainingBalance = getRemainingBalance(transactions, currentMonthRange);

  const currentPeriodRange = period === 'weekly' ? getWeekRange() : getCalendarMonthRange();
  const recentTransactions = getTransactionsForRange(transactions, currentPeriodRange);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0) }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AppHeader />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hey, {userName}</Text>
          <Text style={styles.subGreetingText}>Add your yesterday&apos;s expense</Text>
        </View>

        
        <LinearGradient
          colors={['#F6D2B3', '#3FB9A2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.bankName}>ADRBank</Text>
            <AtmIcon size={24} />
          </View>
          
          <Text style={styles.cardNumber}>8763 1111 2222 0329</Text>
          
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>Card Holder Name</Text>
              <Text style={styles.cardValue}>{userName.toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>Expired Date</Text>
              <Text style={styles.cardValue}>10/28</Text>
            </View>
          </View>
        </LinearGradient>

        
        <Text style={styles.summarySectionTitle}>Monthly summary</Text>
        <LinearGradient
          colors={['rgba(63, 185, 162, 0.35)', 'rgba(246, 210, 179, 0.12)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.remainingCard}
        >
          <View style={styles.remainingCardInner}>
            <View style={[styles.summaryIcon, { backgroundColor: 'rgba(255, 255, 255, 0.12)' }]}>
              <Ionicons name="wallet-outline" size={18} color="#FAFAFA" />
            </View>
            <View style={styles.remainingTextBlock}>
              <Text style={styles.remainingLabel}>Remaining balance</Text>
              <Text
                style={[
                  styles.remainingValue,
                  remainingBalance < 0 && styles.remainingValueNegative,
                ]}
              >
                {formatCurrency(remainingBalance)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Ionicons name="arrow-down" size={16} color="#10B981" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Total income</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalIncome)}</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: 'rgba(231, 76, 60, 0.1)' }]}>
              <Ionicons name="arrow-up" size={16} color="#E74C3C" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Total expenses</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalExpenses)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent transactions</Text>

        
        <SegmentedControl
          options={[
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' }
          ]}
          selectedValue={period}
          onValueChange={setPeriod}
          style={styles.segmentedControl}
        />

        
        {recentTransactions.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title="No transactions yet"
            description={`Add your first ${period === 'weekly' ? 'weekly' : 'monthly'} transaction to start tracking.`}
          />
        ) : (
          recentTransactions.map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transactionItem} activeOpacity={0.7}>
              <View style={styles.transactionLeft}>
                <View style={[styles.categoryIconContainer, { backgroundColor: `${transaction.category.color}20` }]}>
                  <Ionicons 
                    name={transaction.category.icon as any} 
                    size={20} 
                    color={transaction.category.color} 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionName}>{transaction.category.name}</Text>
                  <Text style={styles.transactionSubtext}>
                    {new Date(transaction.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: new Date(transaction.date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                    })}
                    {transaction.note ? ` • ${transaction.note}` : ''}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.amountBadge,
                transaction.type === 'income' 
                  ? styles.amountBadgeIncome 
                  : styles.amountBadgeExpense
              ]}>
                <Text style={[
                  styles.amountText,
                  transaction.type === 'income' 
                    ? styles.amountTextIncome 
                    : styles.amountTextExpense
                ]}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        
       
        <View style={{ height: 100 }} />
      </ScrollView>

      
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subGreetingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FAFAFA',
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FAFAFA',
    letterSpacing: 2,
    marginBottom: 30,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FAFAFA',
  },
  summarySectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'column',
    gap: 12,
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  remainingCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  remainingCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  remainingTextBlock: {
    flex: 1,
  },
  remainingLabel: {
    fontSize: 12,
    color: 'rgba(250, 250, 250, 0.85)',
    marginBottom: 4,
  },
  remainingValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FAFAFA',
    letterSpacing: 0.3,
  },
  remainingValueNegative: {
    color: '#FECACA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  segmentedControl: {
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    marginLeft: 12,
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  transactionSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  amountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  amountBadgeIncome: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  amountBadgeExpense: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  amountText: {
    fontWeight: '600',
    fontSize: 14,
  },
  amountTextIncome: {
    color: '#10B981',
  },
  amountTextExpense: {
    color: '#E74C3C',
  },
});
