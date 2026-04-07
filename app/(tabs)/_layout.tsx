import { BalancesIcon, HomeIcon } from "@/components/ui/icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth-store";
import { useTransactionsStore } from "@/store/transactions-store";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const Colors = useThemeColor();
  
  return (
    <View style={[styles.tabBarContainer, { 
      bottom: Platform.OS === "ios" ? Math.max(insets.bottom, 12) : 12,
      backgroundColor: Colors.tabBarBg,
      borderColor: Colors.border,
      shadowColor: Colors.text,
    }]}>
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
            style={[styles.tabItem, isFocused && { backgroundColor: Colors.tabBarActive }]}
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
  const Colors = useThemeColor();

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
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
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
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 36,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    left: 0,
    right: 0,
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  iconContainer: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});