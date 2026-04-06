import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '@/constants/colors';
import { AppHeader } from '@/components/layout/AppHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';

type ProfileTab = 'preview' | 'edit';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<ProfileTab>('preview');
  
  // Form states for edit mode
  const [fullName, setFullName] = useState(user?.name || 'Alex yu');
  const [email, setEmail] = useState(user?.email || 'alex@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (password && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validate()) return;
    
    setIsUpdating(true);
    setUpdateSuccess(false);
    
    setTimeout(() => {
      setIsUpdating(false);
      setUpdateSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setUpdateSuccess(false), 3000);
    }, 1500);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0) }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AppHeader />

      <KeyboardAwareScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 40}
      >
        
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <Text style={styles.profileName}>{fullName}</Text>
        </View>

        
        <SegmentedControl
          options={[
            { label: 'Preview', value: 'preview' },
            { label: 'Edit', value: 'edit' }
          ]}
          selectedValue={activeTab}
          onValueChange={setActiveTab}
          style={styles.segmentedControl}
        />

        {activeTab === 'preview' ? (
         
          <View style={styles.previewContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total spendings: </Text>
              <Text style={styles.infoValue}>$2000</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email : </Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Balance : </Text>
              <Text style={styles.infoValue}>$20000</Text>
            </View>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          
          <View style={styles.editContainer}>
            {updateSuccess && (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.successText}>Profile updated successfully</Text>
              </View>
            )}

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={(text) => { setFullName(text); setErrors({ ...errors, fullName: '' }); }}
              autoCapitalize="words"
              error={errors.fullName}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: '' }); }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Input
              label="New Password"
              placeholder="Leave blank to keep current"
              value={password}
              onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: '' }); }}
              isPassword
              error={errors.password}
            />
            <Input
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={(text) => { setConfirmPassword(text); setErrors({ ...errors, confirmPassword: '' }); }}
              isPassword
              error={errors.confirmPassword}
            />
            <Button
              title="Update Details"
              onPress={handleUpdate}
              style={styles.updateButton}
              loading={isUpdating}
            />
          </View>
        )}
        
       
        <View style={{ height: 100 }} />
      </KeyboardAwareScrollView>

      
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.text,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.background,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  segmentedControl: {
    marginBottom: 30,
  },
  previewContainer: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  logoutButton: {
    marginTop: 40,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  logoutText: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: '600',
  },
  editContainer: {
    marginTop: 10,
  },
  updateButton: {
    marginTop: 16,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  successText: {
    color: '#10B981',
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  }
});
