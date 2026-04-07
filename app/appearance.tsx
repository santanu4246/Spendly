import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemeMode, useThemeStore } from "@/store/theme-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";

export default function AppearanceScreen() {
  const insets = useSafeAreaInsets();
  const Colors = useThemeColor();
  const { themeMode, setThemeMode } = useThemeStore();
  const router = useRouter();

  const handleSave = () => {
    router.back();
  };

  const renderThemeOption = (mode: ThemeMode, label: string) => {
    const isSelected = themeMode === mode;

    // Draw the mockup inside the selection box based on mode
    const renderMockup = () => {
      const isLightMockup = mode === "light" || (mode === "system" && false); // Simplified for mockup

      return (
        <View
          style={[
            styles.mockupContainer,
            isSelected && { borderColor: Colors.primary },
          ]}
        >
          {mode === "system" ? (
            <View style={styles.systemMockup}>
              <View style={styles.systemLightHalf}>
                <View style={styles.mockupHeaderLight} />
                <View style={styles.mockupRowLight} />
                <View style={styles.mockupRowLight} />
                <View style={styles.mockupDotsLight}>
                  <View
                    style={[styles.mockupDot, { backgroundColor: "#ccc" }]}
                  />
                  <View
                    style={[styles.mockupDot, { backgroundColor: "#ccc" }]}
                  />
                  <View
                    style={[styles.mockupDot, { backgroundColor: "#ccc" }]}
                  />
                  <View
                    style={[styles.mockupDot, { backgroundColor: "#ccc" }]}
                  />
                </View>
                <View
                  style={[
                    styles.mockupButtonLight,
                    { backgroundColor: Colors.primary },
                  ]}
                />
              </View>
              <View style={styles.systemDarkHalf}>
                <View style={styles.mockupHeaderDark} />
                <View style={styles.mockupRowDark} />
                <View style={styles.mockupRowDark} />
                <View style={styles.mockupDotsDark}>
                  <View
                    style={[styles.mockupDot, { backgroundColor: "#555" }]}
                  />
                  <View
                    style={[styles.mockupDot, { backgroundColor: "#555" }]}
                  />
                  <View
                    style={[styles.mockupDot, { backgroundColor: "#555" }]}
                  />
                  <View
                    style={[styles.mockupDot, { backgroundColor: "#555" }]}
                  />
                </View>
                <View
                  style={[
                    styles.mockupButtonDark,
                    { backgroundColor: Colors.primary },
                  ]}
                />
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.mockupInner,
                { backgroundColor: mode === "light" ? "#FFFFFF" : "#1C1C1E" },
              ]}
            >
              <View
                style={[
                  styles.mockupHeader,
                  { backgroundColor: mode === "light" ? "#E5E5EA" : "#3A3A3C" },
                ]}
              />
              <View
                style={[
                  styles.mockupRow,
                  {
                    backgroundColor: mode === "light" ? "#E5E5EA" : "#3A3A3C",
                    width: "60%",
                  },
                ]}
              />
              <View
                style={[
                  styles.mockupRow,
                  {
                    backgroundColor: mode === "light" ? "#E5E5EA" : "#3A3A3C",
                    width: "80%",
                  },
                ]}
              />
              <View style={styles.mockupDotsContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.mockupDot,
                      {
                        backgroundColor:
                          mode === "light" ? "#E5E5EA" : "#3A3A3C",
                      },
                    ]}
                  />
                ))}
              </View>
              <View
                style={[
                  styles.mockupButton,
                  { backgroundColor: Colors.primary },
                ]}
              />
            </View>
          )}
        </View>
      );
    };

    return (
      <TouchableOpacity
        style={styles.optionWrapper}
        onPress={() => setThemeMode(mode)}
        activeOpacity={0.8}
      >
        {renderMockup()}
        <Text
          style={[
            styles.optionLabel,
            { color: isSelected ? Colors.text : Colors.textSecondary },
            isSelected && styles.optionLabelSelected,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.safeArea,
        {
          backgroundColor: Colors.background,
          paddingTop: insets.top + (Platform.OS === "android" ? 10 : 0),
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>
          Appearance
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>
          Display Mode
        </Text>

        <View style={[styles.card, { backgroundColor: Colors.card }]}>
          <View style={styles.optionsContainer}>
            {renderThemeOption("light", "Light")}
            {renderThemeOption("dark", "Dark")}
            {renderThemeOption("system", "System")}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Save Change"
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: "#34A853", borderWidth: 0 }]}
          textStyle={styles.saveButtonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
  },
  card: {
    borderRadius: 20,
    padding: 24,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionWrapper: {
    alignItems: "center",
    gap: 12,
  },
  mockupContainer: {
    width: 72,
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 2,
  },
  mockupInner: {
    flex: 1,
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  mockupHeader: {
    width: 32,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 12,
  },
  mockupRow: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  mockupDotsContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: "auto",
    marginBottom: 12,
  },
  mockupDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  mockupButton: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    marginTop: "auto",
    marginBottom: 4,
  },
  systemMockup: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  systemLightHalf: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 8,
    paddingRight: 4,
    alignItems: "center",
  },
  systemDarkHalf: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    padding: 8,
    paddingLeft: 4,
    alignItems: "center",
  },
  mockupHeaderLight: {
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E5EA",
    marginTop: 12,
    marginBottom: 12,
  },
  mockupHeaderDark: {
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3A3A3C",
    marginTop: 12,
    marginBottom: 12,
  },
  mockupRowLight: {
    width: "80%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E5EA",
    marginBottom: 8,
  },
  mockupRowDark: {
    width: "80%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3A3A3C",
    marginBottom: 8,
  },
  mockupDotsLight: {
    flexDirection: "row",
    gap: 2,
    marginTop: "auto",
    marginBottom: 12,
  },
  mockupDotsDark: {
    flexDirection: "row",
    gap: 2,
    marginTop: "auto",
    marginBottom: 12,
  },
  mockupButtonLight: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    marginTop: "auto",
    marginBottom: 4,
  },
  mockupButtonDark: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    marginTop: "auto",
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  optionLabelSelected: {
    fontWeight: "bold",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  saveButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
