import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { NotificationIcon, SearchIcon, AtmIcon } from '@/components/ui/icons';
import { useAuthStore } from '@/store/auth-store';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.headerTitle}>Spendly</Text>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <SearchIcon size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>2</Text>
            </View>
            <NotificationIcon size={20} />
          </TouchableOpacity>
        </View>
      </View>

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

        <Text style={styles.sectionTitle}>Your expenses</Text>

        {/* Period Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleSegment, period === 'weekly' && styles.toggleSegmentActive]}
            onPress={() => setPeriod('weekly')}
            accessibilityRole="tab"
            accessibilityState={{ selected: period === 'weekly' }}
          >
            <Text style={[styles.toggleLabel, period === 'weekly' && styles.toggleLabelActive]}>
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleSegment, period === 'monthly' && styles.toggleSegmentActive]}
            onPress={() => setPeriod('monthly')}
            accessibilityRole="tab"
            accessibilityState={{ selected: period === 'monthly' }}
          >
            <Text style={[styles.toggleLabel, period === 'monthly' && styles.toggleLabelActive]}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Expenses List */}
        <View style={styles.expenseItem}>
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
        </View>

        <View style={styles.expenseItem}>
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
        </View>
        
        {/* Extra padding for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color={Colors.background} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  logoContainer: {
    width: 32,
    height: 32,
    backgroundColor: Colors.text,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#FAFAFA',
    fontSize: 10,
    fontWeight: 'bold',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 4,
    marginBottom: 20,
  },
  toggleSegment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  toggleSegmentActive: {
    backgroundColor: Colors.text,
  },
  toggleLabel: {
    color: Colors.textSecondary,
    fontWeight: '500',
    fontSize: 14,
  },
  toggleLabelActive: {
    color: Colors.background,
    fontWeight: '600',
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: Colors.text,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }
});
