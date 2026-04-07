import { BalancesIcon, HomeIcon, ProfileIcon } from "@/components/ui/icons";
import { Colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";
import { useTransactionsStore } from "@/store/transactions-store";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.tabBarContainer, { bottom: Platform.OS === "ios" ? Math.max(insets.bottom, 24) : 24 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const color = isFocused ? Colors.text : Colors.textSecondary;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              {options.tabBarIcon?.({ color, size: 22, focused: isFocused })}
            </View>
            <Text style={[styles.tabLabel, { color }]}>
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const { hydrate, clear } = useTransactionsStore();

  // Auth guard — redirect to login whenever unauthenticated
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/(auth)/welcome");
    }
  }, [isAuthenticated, isHydrated]);

  // Hydrate or clear transactions based on auth state
  useEffect(() => {
    if (user?.id) {
      hydrate(user.id);
    } else {
      clear();
    }
  }, [user?.id]);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, size }) => (
            <BalancesIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1C', // Deep sleek card color
    marginHorizontal: 16, // Decreased margin to increase width
    paddingHorizontal: 16,
    paddingVertical: 6, // Decreased padding to reduce height
    borderRadius: 36, // Fully rounded floating bar
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)', // Very subtle highlight
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    left: 0,
    right: 0,
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6, // Decreased padding
    paddingHorizontal: 28, // Slightly wider pill
    borderRadius: 24, // Creates the pill shape for the active tab
  },
  tabItemActive: {
    backgroundColor: '#2A2A2D', // Subtle grey pill for the active tab (highly professional)
  },
  iconContainer: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});