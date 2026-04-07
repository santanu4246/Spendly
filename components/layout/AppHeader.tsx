import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NotificationIcon } from '@/components/ui/icons';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NOTIFICATION_ICON_SIZE = 20;

type AppHeaderProps = {
  notificationCount?: number;
  onNotificationPress?: () => void;
};

export function AppHeader({
  notificationCount = 2,
  onNotificationPress,
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>S</Text>
      </View>
      <Text style={styles.title}>Spendly</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/add-transaction')}
          accessibilityRole="button"
          accessibilityLabel="Add Transaction"
        >
          <Ionicons name="add-circle" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          {notificationCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : String(notificationCount)}
              </Text>
            </View>
          ) : null}
          <NotificationIcon size={NOTIFICATION_ICON_SIZE} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#FAFAFA',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
