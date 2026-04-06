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

type ExpensePeriod = 'weekly' | 'monthly';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const userName = user?.name?.split(' ')[0] || 'Alex'; // Fallback to Alex
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<ExpensePeriod>('weekly');

  const comparisonLabel = period === 'weekly' ? 'last week' : 'last month';

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0) }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AppHeader />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hey, {userName}</Text>
          <Text style={styles.subGreetingText}>Add your yesterday&apos;s expense</Text>
        </View>

        {/* Expense Card */}
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

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Ionicons name="arrow-down" size={16} color="#10B981" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.summaryValue}>$5,000</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: 'rgba(231, 76, 60, 0.1)' }]}>
              <Ionicons name="arrow-up" size={16} color="#E74C3C" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={styles.summaryValue}>$2,400</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your expenses</Text>

        {/* Period Toggle */}
        <SegmentedControl
          options={[
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' }
          ]}
          selectedValue={period}
          onValueChange={setPeriod}
          style={styles.segmentedControl}
        />

        {/* Expenses List */}
        <TouchableOpacity style={styles.expenseItem} activeOpacity={0.7}>
          <View style={styles.expenseLeft}>
            <AtmIcon size={24} color="#FAFAFA" />
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseName}>FOOD</Text>
              <Text style={styles.expenseSubtext}>
                Lesser than {comparisonLabel}
              </Text>
            </View>
          </View>
          <View style={styles.expenseRight}>
            <Ionicons name="star-outline" size={16} color={Colors.textSecondary} />
            <View style={styles.amountBadge}>
              <Text style={styles.amountText}>
                {period === 'weekly' ? '$1000' : '$4200'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.expenseItem} activeOpacity={0.7}>
          <View style={styles.expenseLeft}>
            <AtmIcon size={24} color="#FAFAFA" />
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseName}>TRAVEL</Text>
              <Text style={styles.expenseSubtext}>
                More than {comparisonLabel}
              </Text>
            </View>
          </View>
          <View style={styles.expenseRight}>
            <Ionicons name="star-outline" size={16} color={Colors.textSecondary} />
            <View style={styles.amountBadge}>
              <Text style={styles.amountText}>
                {period === 'weekly' ? '$4000' : '$16800'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Extra padding for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  segmentedControl: {
    marginBottom: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseDetails: {
    marginLeft: 12,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  expenseSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  expenseRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountBadge: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  amountText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
});
