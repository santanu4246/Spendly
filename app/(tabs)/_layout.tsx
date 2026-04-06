import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/colors';
import { HomeIcon, BalancesIcon, ProfileIcon } from '@/components/ui/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 80 : 65 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? 20 : insets.bottom + 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#FAFAFA',
        tabBarInactiveTintColor: '#A1A1A1',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="balances"
        options={{
          title: 'Balances',
          tabBarIcon: ({ color, size }) => <BalancesIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
