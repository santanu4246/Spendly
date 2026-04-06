import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { NotificationIcon, SearchIcon } from '@/components/ui/icons';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';

export default function BalancesScreen() {
  const insets = useSafeAreaInsets();

  // Mock data for the bar chart matching the image (varying background heights)
  const barData = [
    { id: 1, value: 0.4, total: 0.6 },
    { id: 2, value: 0.15, total: 1.0 },
    { id: 3, value: 0.25, total: 0.3 },
    { id: 4, value: 0.45, total: 0.6 },
    { id: 5, value: 0.45, total: 0.6 },
    { id: 6, value: 0.2, total: 0.5 },
    { id: 7, value: 0.6, total: 0.8 },
    { id: 8, value: 0.3, total: 0.6 },
  ];

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0) }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header - Identical to Home */}
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
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Your Balances</Text>
          <Text style={styles.subtitleText}>Manage your multi-currency accounts</Text>
        </View>

        {/* Credit Score Gauge Area */}
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
              {/* Green Segment */}
              <Path 
                d="M 20 120 A 100 100 0 0 1 109.5 20.5" 
                fill="none" 
                stroke="#65C293" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
              {/* Pink Segment */}
              <Path 
                d="M 130.5 20.5 A 100 100 0 0 1 190.7 49.3" 
                fill="none" 
                stroke="#E28CE2" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
              {/* Blue Segment */}
              <Path 
                d="M 203.8 65.6 A 100 100 0 0 1 213.9 85.8" 
                fill="none" 
                stroke="#76ADE9" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
              {/* Yellow Segment */}
              <Path 
                d="M 219.0 106.1 A 100 100 0 0 1 220 120" 
                fill="none" 
                stroke="#EED08A" 
                strokeWidth="14" 
                strokeLinecap="round" 
              />
              {/* Blue Knob */}
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

        {/* Currency Card */}
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

        {/* Bar Chart Area */}
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
              {barData.map((bar) => (
                <View key={bar.id} style={styles.barColumn}>
                  <View style={[styles.barBackground, { height: `${bar.total * 100}%` }]}>
                    <LinearGradient
                      colors={['#F6D2B3', '#3FB9A2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={[styles.barFill, { height: `${(bar.value / bar.total) * 100}%` }]}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Chart Footer */}
        <View style={styles.chartFooter}>
          <Text style={styles.chartFooterLeft}>Current margin: April Spendings</Text>
          <Text style={styles.chartFooterRight}>
            <Text style={styles.highlightText}>$350.00</Text> / <Text style={styles.highlightTextDark}>$640.00</Text>
          </Text>
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
    height: 130, // matches SVG height to avoid extra space
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
    backgroundColor: '#1A1A1A', // Slightly lighter than background
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
    paddingBottom: 20, // To align with bars baseline
  },
  yAxisLabel: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '500',
  },
  chartBars: {
    flex: 1,
    position: 'relative',
    paddingBottom: 20, // Space below bars
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
    gap: 24, // Adjusted gap between bars
  },
  barColumn: {
    width: 32, // Wider bars to match image
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 12, // Fallback
  },
  barBackground: {
    width: '100%',
    backgroundColor: '#262626', // Softer dark for the unfilled bar
    borderRadius: 8, // More rounded corners
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartFooterLeft: {
    color: '#666666',
    fontSize: 12,
  },
  chartFooterRight: {
    fontSize: 12,
  },
  highlightText: {
    color: '#8B5CF6', // Purple/Blue text
    fontWeight: '600',
  },
  highlightTextDark: {
    color: '#4C1D95', // Darker purple text
    fontWeight: '600',
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
