import { BalancesIcon, HomeIcon, ProfileIcon } from "@/components/ui/icons";
import { Colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";
import { useTransactionsStore } from "@/store/transactions-store";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { hydrate, clear } = useTransactionsStore();

  useEffect(() => {
    if (user?.id) {
      hydrate(user.id);
    } else {
      clear();
    }
  }, [user?.id]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === "ios" ? 80 : 65 + insets.bottom,
          paddingBottom: Platform.OS === "ios" ? 20 : insets.bottom + 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#FAFAFA",
        tabBarInactiveTintColor: "#A1A1A1",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
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
