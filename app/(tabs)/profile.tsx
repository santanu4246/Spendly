import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, Alert, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { AppHeader } from '@/components/layout/AppHeader';
import { useAuthStore } from '@/store/auth-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { LogoutIcon } from '@/components/ui/icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const userName = user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderMenuItem = (
    title: string, 
    icon: keyof typeof Ionicons.glyphMap, 
    isLast: boolean = false, 
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={[styles.menuItem, !isLast && styles.menuItemBorder]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={20} color={Colors.text} style={styles.menuIcon} />
        <Text style={styles.menuItemTitle}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0) }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AppHeader />

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.7} onPress={() => router.push('/edit-profile')}>
            <Text style={styles.editButtonText}>Edit</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Premium Banner */}
        <LinearGradient
          colors={['#8B4367', '#5E3A5A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.premiumBanner}
        >
          <View style={styles.premiumIconContainer}>
            <Text style={styles.premiumIconText}>S</Text>
          </View>
          <View style={styles.premiumInfo}>
            <Text style={styles.premiumTitle}>Spendly Premium</Text>
            <Text style={styles.premiumSubtitle}>You have full access to Spendly Premium features.</Text>
          </View>
        </LinearGradient>

        {/* Preferences Section */}
        {renderSectionHeader('PREFERENCES')}
        <View style={styles.sectionContainer}>
          {renderMenuItem('Gentle Reminders', 'leaf-outline', true)}
        </View>

        {/* Subscriptions & Billing Section */}
        {renderSectionHeader('SUBSCRIPTIONS & BILLING')}
        <View style={styles.sectionContainer}>
          {renderMenuItem('Subscription', 'card-outline')}
          {renderMenuItem('Billing & Refund Policy', 'receipt-outline', true)}
        </View>

        {/* Data & Privacy Section */}
        {renderSectionHeader('DATA & PRIVACY')}
        <View style={styles.sectionContainer}>
          {renderMenuItem('Terms of Service', 'document-text-outline')}
          {renderMenuItem('Privacy Policy', 'shield-checkmark-outline', true)}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Log Out</Text>
          <LogoutIcon color="#FFFFFF" size={24} />
        </TouchableOpacity>
        
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
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#3FB9A2',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.background,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
  },
  premiumIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  premiumIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4367',
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FAFAFA',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: 'rgba(250, 250, 250, 0.8)',
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 18,
    borderRadius: 24,
    marginTop: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  }
});