import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled, 
  loading,
  variant = 'primary'
}) => {
  const getBackgroundColor = () => {
    if (disabled) return Colors.border;
    if (variant === 'primary') return Colors.text; // White background like in the image
    if (variant === 'secondary') return Colors.card;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return Colors.textSecondary;
    if (variant === 'primary') return Colors.background; // Black text on white button
    return Colors.text; // White text otherwise
  };

  const getBorder = () => {
    if (variant === 'outline') return { borderWidth: 1, borderColor: Colors.border };
    return {};
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: getBackgroundColor() },
        getBorder(),
        style,
        disabled && styles.disabled
      ]} 
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[
          styles.text, 
          { color: getTextColor() },
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
