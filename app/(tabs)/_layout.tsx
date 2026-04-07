import { BalancesIcon, HomeIcon, ProfileIcon } from "@/components/ui/icons";
import { Colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";
import { useTransactionsStore } from "@/store/transactions-store";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
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
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.background },
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
