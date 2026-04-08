import {
    AppearanceIcon,
    LogoutIcon,
    NotificationIcon,
} from "@/components/ui/icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth-store";
import { ThemeMode, useThemeStore } from "@/store/theme-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    Alert,
    Appearance,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const Colors = useThemeColor();
  const { themeMode, setThemeMode, activeTheme, updateSystemTheme } =
    useThemeStore();

  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      updateSystemTheme();
    });
    return () => subscription.remove();
  }, []);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  };

  const renderSectionHeader = (title: string) => (
    <Text style={[styles.sectionHeader, { color: Colors.text }]}>{title}</Text>
  );

  const renderMenuItem = (
    title: string,
    icon: keyof typeof Ionicons.glyphMap | React.ReactNode,
    isLast: boolean = false,
    onPress?: () => void,
  ) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        !isLast && { borderBottomWidth: 1, borderBottomColor: Colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        {typeof icon === "string" ? (
          <Ionicons
            name={icon as any}
            size={20}
            color={Colors.text}
            style={styles.menuIcon}
          />
        ) : (
          <View style={styles.menuIcon}>{icon}</View>
        )}
        <Text style={[styles.menuItemTitle, { color: Colors.text }]}>
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderThemeOption = (
    mode: ThemeMode,
    label: string,
    icon: keyof typeof Ionicons.glyphMap,
    isLast: boolean = false,
  ) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        !isLast && { borderBottomWidth: 1, borderBottomColor: Colors.border },
      ]}
      onPress={() => setThemeMode(mode)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={Colors.text}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuItemTitle, { color: Colors.text }]}>
          {label}
        </Text>
      </View>
      {themeMode === mode && (
        <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top + (Platform.OS === "android" ? 10 : 0),
          backgroundColor: Colors.background,
        },
      ]}
    >
      <StatusBar
        barStyle={activeTheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={[styles.titleText, { color: Colors.text }]}>
            Settings
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
              <NotificationIcon size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: Colors.card }]}>
          <View style={styles.avatarContainer}>
            <Text style={[styles.avatarText, { color: Colors.background }]}>
              {userInitial}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: Colors.text }]}>
              {userName}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.editButton,
              {
                backgroundColor:
                  activeTheme === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
              },
            ]}
            activeOpacity={0.7}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={[styles.editButtonText, { color: Colors.text }]}>
              Edit
            </Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        {renderSectionHeader("Preferences")}
        <View
          style={[styles.sectionContainer, { backgroundColor: Colors.card }]}
        >
          {renderMenuItem(
            "Appearance",
            <AppearanceIcon color={Colors.text} size={20} />,
            false,
            () => router.push("/appearance"),
          )}
          {renderMenuItem("Gentle Reminders", "leaf-outline", true)}
        </View>

        {/* Subscriptions & Billing Section */}
        {renderSectionHeader("Subscriptions & Billing")}
        <View
          style={[styles.sectionContainer, { backgroundColor: Colors.card }]}
        >
          {renderMenuItem("Subscription", "card-outline")}
          {renderMenuItem("Billing & Refund Policy", "receipt-outline", true)}
        </View>

        {/* Data & Privacy Section */}
        {renderSectionHeader("Data & Privacy")}
        <View
          style={[styles.sectionContainer, { backgroundColor: Colors.card }]}
        >
          {renderMenuItem("Terms of Service", "document-text-outline")}
          {renderMenuItem("Privacy Policy", "shield-checkmark-outline", true)}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log Out</Text>
          <LogoutIcon color="#FFFFFF" size={24} />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 16,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: {
    color: "#FAFAFA",
    fontSize: 10,
    fontWeight: "bold",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    backgroundColor: "#10B981",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionContainer: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D33131",
    paddingVertical: 18,
    borderRadius: 100,
    marginTop: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});
