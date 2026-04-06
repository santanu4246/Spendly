import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { AppHeader } from '@/components/layout/AppHeader';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { EmptyState } from '@/components/ui/empty-state';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';

export default function BalancesScreen() {
  const insets = useSafeAreaInsets();

  const barData = [
    { id: 1, value: 0.4, total: 0.6, label: 'Mon' },
    { id: 2, value: 0.15, total: 1.0, label: 'Tue' },
    { id: 3, value: 0.25, total: 0.3, label: 'Wed' },
    { id: 4, value: 0.45, total: 0.6, label: 'Thu' },
    { id: 5, value: 0.45, total: 0.6, label: 'Fri' },
    { id: 6, value: 0.2, total: 0.5, label: 'Sat' },
    { id: 7, value: 0.6, total: 0.8, label: 'Sun' },
    { id: 8, value: 0.3, total: 0.6, label: 'Mon' },
  ];

  const hasData = barData.length > 0;

  const categories = [
    { id: '1', name: 'Food & Dining', amount: '$450.00', color: '#10B981', percentage: '45%' },
    { id: '2', name: 'Transportation', amount: '$120.00', color: '#3B82F6', percentage: '25%' },
    { id: '3', name: 'Entertainment', amount: '$70.00', color: '#EAB308', percentage: '15%' },
  ];

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0) }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AppHeader />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Your Balances</Text>
          <Text style={styles.subtitleText}>Manage your multi-currency accounts</Text>
        </View>

        
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeWrapper}>
            <Svg width="240" height="130" viewBox="0 0 240 130">
              {/* Inner Dotted Arc */}
              <Path 
                d="M 36 120 A 84 84 0 0 1 204 120" 
                fill="none" 
                stroke="#333333" 
                strokeWidth="4" 
                strokeDasharray="2 16" 
                strokeLinecap="round" 
              />
              
              <Path 
                d="M 20 120 A 100 100 0 0 1 109.5 20.5" 
                fill="none" 
                stroke="#65C293" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
              
              <Path 
                d="M 130.5 20.5 A 100 100 0 0 1 190.7 49.3" 
                fill="none" 
                stroke="#E28CE2" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
              
              <Path 
                d="M 203.8 65.6 A 100 100 0 0 1 213.9 85.8" 
                fill="none" 
                stroke="#76ADE9" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
              
              <Path 
                d="M 219.0 106.1 A 100 100 0 0 1 220 120" 
                fill="none" 
                stroke="#EED08A" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
              
              <Circle cx="209.4" cy="75.4" r="12" fill="#76ADE9" />
              <Circle cx="209.4" cy="75.4" r="5" fill="#FFFFFF" />
            </Svg>
            <View style={styles.scoreTextContainer}>
              <Text style={styles.scoreValue}>660</Text>
            </View>
          </View>
          
          <Text style={styles.scoreStatus}>Your Credit Score is average</Text>
          <Text style={styles.scoreDate}>Last Check on 21 Apr</Text>
        </View>

        <Text style={styles.sectionTitle}>Available Currencies</Text>

        
        <View style={styles.currencyCard}>
          <View style={styles.currencyLeft}>
            <Text style={styles.flagIcon}>🇨🇦</Text>
            <View style={styles.currencyDetails}>
              <Text style={styles.currencyCode}>CAD</Text>
              <Text style={styles.currencyName}>Canadian Dollar</Text>
            </View>
          </View>
          <View style={styles.currencyRight}>
            <Ionicons name="star-outline" size={20} color={Colors.textSecondary} style={styles.starIcon} />
            <TouchableOpacity style={styles.enableButton}>
              <Ionicons name="add" size={16} color={Colors.text} />
              <Text style={styles.enableButtonText}>Enable</Text>
            </TouchableOpacity>
          </View>
        </View>

        
        {hasData ? (
          <>
            <View style={styles.chartContainer}>
              <View style={styles.chartYAxis}>
                <Text style={styles.yAxisLabel}>$1000</Text>
                <Text style={styles.yAxisLabel}>$500</Text>
                <Text style={styles.yAxisLabel}>$200</Text>
                <Text style={styles.yAxisLabel}>$0</Text>
              </View>
              <View style={styles.chartBars}>
                {/* Background dashed lines */}
                <View style={styles.gridLineContainer}>
                  <View style={[styles.gridLine, { top: '0%' }]} />
                  <View style={[styles.gridLine, { top: '33%' }]} />
                  <View style={[styles.gridLine, { top: '66%' }]} />
                  <View style={[styles.gridLine, { top: '100%' }]} />
                </View>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.barsScrollView}
                  contentContainerStyle={styles.barsScrollContent}
                >
                  {barData.map((bar, index) => (
                    <View key={bar.id} style={styles.barColumn}>
                      <View style={[styles.barBackground, { height: `${bar.total * 100}%` }]}>
                        <LinearGradient
                          colors={['#F6D2B3', '#3FB9A2']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={[styles.barFill, { height: `${(bar.value / bar.total) * 100}%` }]}
                        />
                      </View>
                      
                      <Text style={styles.xAxisLabel}>{bar.label}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            
            <View style={styles.chartFooter}>
              <Text style={styles.chartFooterLeft}>Current margin: April Spendings</Text>
              <Text style={styles.chartFooterRight}>
                <Text style={styles.highlightText}>$350.00</Text> / <Text style={styles.highlightTextDark}>$640.00</Text>
              </Text>
            </View>

          
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Category Breakdown</Text>
              <View style={styles.categoryList}>
                {categories.map((cat) => (
                  <View key={cat.id} style={styles.categoryRow}>
                    <View style={styles.categoryRowLeft}>
                      <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Text style={styles.categoryPercentage}>{cat.percentage}</Text>
                    </View>
                    <Text style={styles.categoryAmount}>{cat.amount}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <EmptyState
            icon="pie-chart-outline"
            title="No Analytics Yet"
            description="Add some transactions to see your spending broken down by category."
            actionLabel="Add Transaction"
            onAction={() => {}}
            style={styles.emptyState}
          />
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
  titleContainer: {
    marginBottom: 40,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  gaugeWrapper: {
    position: 'relative',
    alignItems: 'center',
    height: 130,
    marginBottom: 16,
  },
  scoreTextContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scoreStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  scoreDate: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  currencyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  currencyDetails: {
    justifyContent: 'center',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  currencyRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 16,
  },
  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  enableButtonText: {
    color: Colors.text,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 160,
    marginBottom: 16,
  },
  chartYAxis: {
    justifyContent: 'space-between',
    paddingRight: 12,
    paddingBottom: 20,
  },
  yAxisLabel: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '500',
  },
  chartBars: {
    flex: 1,
    position: 'relative',
    paddingBottom: 20, 
  },
  gridLineContainer: {
    ...StyleSheet.absoluteFillObject,
    paddingBottom: 20,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderBottomWidth: 1,
    borderColor: '#2A2A2A',
    borderStyle: 'dashed',
  },
  barsScrollView: {
    flex: 1,
  },
  barsScrollContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    gap: 24, 
  },
  barColumn: {
    width: 32, 
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#262626', 
    borderRadius: 8, 
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  xAxisLabel: {
    position: 'absolute',
    bottom: -20,
    fontSize: 10,
    color: '#666666',
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  chartFooterLeft: {
    color: '#666666',
    fontSize: 12,
  },
  chartFooterRight: {
    fontSize: 12,
  },
  highlightText: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  highlightTextDark: {
    color: '#4C1D95', 
    fontWeight: '600',
  },
  categorySection: {
    marginTop: 8,
  },
  categoryList: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2A2A2A',
  },
  categoryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  categoryPercentage: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  categoryAmount: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    marginTop: 20,
    marginBottom: 40,
  }
});
