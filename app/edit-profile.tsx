import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraIcon, DeleteIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const { user, logout, updateProfile, profileError, clearErrors } = useAuthStore();
  const router = useRouter();

  const initialName = user?.name?.trim() || '';
  const userInitial =
    initialName.length > 0 ? initialName.charAt(0).toUpperCase() : '?';

  const [displayName, setDisplayName] = useState(initialName);
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    clearErrors();
    setIsUpdating(true);
    const ok = await updateProfile(displayName, email);
    setIsUpdating(false);
    if (ok) {
      router.back();
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: Colors.background, paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0) },
      ]}
    >
      <StatusBar barStyle={activeTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>Edit Profile</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarSection}>
          <View style={[styles.avatarContainer, { backgroundColor: Colors.primary }]}>
            <Text style={[styles.avatarText, { color: Colors.background }]}>{userInitial}</Text>
          </View>
          <TouchableOpacity style={[styles.cameraButton, { backgroundColor: Colors.text, borderColor: Colors.background }]} activeOpacity={0.8}>
            <CameraIcon color={Colors.background} size={18} />
          </TouchableOpacity>
        </View>

        {profileError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{profileError}</Text>
          </View>
        ) : null}

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Input
              label="Display name"
              placeholder="Your name"
              value={displayName}
              onChangeText={(t) => {
                setDisplayName(t);
                clearErrors();
              }}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Input
              label="Email"
              placeholder="Email address"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                clearErrors();
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: Colors.background },
        ]}
      >
        <View style={styles.buttonsContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isUpdating}
            style={[styles.saveButton, { backgroundColor: '#34A853', borderWidth: 0 }] as any}
            textStyle={[styles.saveButtonText, { color: '#FFFFFF' }] as any}
          />

          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: Colors.error }]}
            onPress={handleDeleteAccount}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
            <DeleteIcon color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  errorBanner: {
    backgroundColor: 'rgba(231, 76, 60, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.35)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#E74C3C',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
    alignSelf: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  formContainer: {
    gap: 20,
    marginBottom: 8,
  },
  inputGroup: {
    gap: 8,
  },
  buttonsContainer: {
    gap: 16,
  },
  saveButton: {
    height: 56,
    borderRadius: 28,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
