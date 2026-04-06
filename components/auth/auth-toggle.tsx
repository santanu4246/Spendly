import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface AuthToggleProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, setIsLogin }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.toggleButton, isLogin && styles.activeToggle]} 
        onPress={() => setIsLogin(true)}
      >
        <Text style={[styles.toggleText, isLogin && styles.activeText]}>Sign In</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.toggleButton, !isLogin && styles.activeToggle]} 
        onPress={() => setIsLogin(false)}
      >
        <Text style={[styles.toggleText, !isLogin && styles.activeText]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E', // Darker than card
    borderRadius: 24,
    padding: 4,
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: Colors.text, // White pill
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeText: {
    color: Colors.background, // Black text on white pill
  }
});
