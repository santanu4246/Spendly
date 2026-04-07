import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outline" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled,
  loading,
  variant = "primary",
}) => {
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const isLight = activeTheme === "light";

  const getBackgroundColor = () => {
    if (disabled) return Colors.border;
    if (variant === "primary") return isLight ? "#222222" : "#FFFFFF";
    if (variant === "secondary") return Colors.card;
    return "transparent";
  };

  const getTextColor = () => {
    if (disabled) return Colors.textSecondary;
    if (variant === "primary") return isLight ? "#FFFFFF" : "#000000";
    return Colors.text;
  };

  const getBorder = () => {
    if (variant === "outline")
      return { borderWidth: 1, borderColor: Colors.border };
    if (variant === "primary")
      return { borderWidth: 1, borderColor: isLight ? "#000000" : "#FFFFFF" };
    return {};
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        getBorder(),
        variant === "primary" && { overflow: "hidden" },
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {variant === "primary" && !disabled && (
        <View style={styles.innerHighlight} />
      )}
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  innerHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
});
