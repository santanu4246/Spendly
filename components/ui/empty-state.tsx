import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({ 
  icon = 'document-text-outline', 
  title, 
  description, 
  actionLabel, 
  onAction,
  style
}: EmptyStateProps) {
  const Colors = useThemeColor();
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: `${Colors.primary}20` }]}>
        <Ionicons name={icon} size={48} color={Colors.primary} />
      </View>
      <Text style={[styles.title, { color: Colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: Colors.textSecondary }]}>{description}</Text>
      
      {actionLabel && onAction && (
        <Button 
          title={actionLabel} 
          onPress={onAction} 
          style={styles.actionButton}
          variant="secondary"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  actionButton: {
    paddingHorizontal: 24,
    height: 48,
  }
});
