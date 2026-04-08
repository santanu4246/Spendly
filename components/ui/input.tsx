import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: Colors.textSecondary }]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: Colors.inputBg, borderColor: Colors.border },
          isFocused && {
            borderColor: Colors.primary,
            backgroundColor: activeTheme === "dark" ? "#1A1A1A" : "#F0FDF4",
          },
          error && { borderColor: Colors.error },
        ]}
      >
        <TextInput
          style={[styles.input, { color: Colors.text }]}
          placeholderTextColor={Colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: Colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
  },
});
