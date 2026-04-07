import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AccountsStore } from '@/store/accounts-store';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Step = 'verify' | 'reset';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [step, setStep] = useState<Step>('verify');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [bannerError, setBannerError] = useState('');

  const clearFieldError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    setBannerError('');
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return null;
  };

  const handleVerify = async () => {
    const newErrors = { email: '', currentPassword: '', newPassword: '', confirmPassword: '' };
    let isValid = true;
    
    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }
    
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    if (!isValid) return;
    
    setLoading(true);
    setBannerError('');
    
    try {
      const result = await AccountsStore.validateCredentials(email, currentPassword);
      
      if (!result.success) {
        setBannerError(result.error || 'Invalid email or password');
        setLoading(false);
        return;
      }
      
      setStep('reset');
    } catch (error) {
      setBannerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const newErrors = { email: '', currentPassword: '', newPassword: '', confirmPassword: '' };
    let isValid = true;
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    if (!isValid) return;
    
    setLoading(true);
    setBannerError('');
    
    try {
      const result = await AccountsStore.updatePassword(email, currentPassword, newPassword);
      
      if (!result.success) {
        setBannerError(result.error || 'Failed to update password');
        setLoading(false);
        return;
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 2000);
    } catch (error) {
      setBannerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.safeArea, { 
      paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0),
      paddingBottom: insets.bottom 
    }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Top Header Row with Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 40}
      >
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>S</Text>
            </View>
            <Text style={styles.logoText}>Spendly</Text>
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            {step === 'verify' 
              ? 'Verify your identity to reset password' 
              : 'Enter your new password'}
          </Text>
        </View>

        {showSuccess && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.successText}>Password updated successfully!</Text>
          </View>
        )}

        {bannerError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{bannerError}</Text>
          </View>
        )}

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step === 'verify' && styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step === 'reset' && styles.stepDotActive]} />
        </View>
        <Text style={styles.stepLabel}>
          Step {step === 'verify' ? '1' : '2'} of 2
        </Text>

        <View style={styles.formContainer}>
          {step === 'verify' ? (
            <>
              <Input
                label="Email"
                placeholder="example@mail.com"
                value={email}
                onChangeText={(text) => { setEmail(text); clearFieldError('email'); }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />
              
              <Input
                label="Current Password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChangeText={(text) => { setCurrentPassword(text); clearFieldError('currentPassword'); }}
                isPassword
                error={errors.currentPassword}
              />

              <Button
                title="Verify & Continue"
                onPress={handleVerify}
                loading={loading}
                style={styles.actionButton}
              />
            </>
          ) : (
            <>
              <Input
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={(text) => { setNewPassword(text); clearFieldError('newPassword'); }}
                isPassword
                error={errors.newPassword}
              />
              
              <Input
                label="Confirm New Password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChangeText={(text) => { setConfirmPassword(text); clearFieldError('confirmPassword'); }}
                isPassword
                error={errors.confirmPassword}
              />

              <Button
                title="Reset Password"
                onPress={handleReset}
                loading={loading}
                style={styles.actionButton}
              />
              
              <TouchableOpacity 
                style={styles.backToVerifyButton}
                onPress={() => setStep('verify')}
                activeOpacity={0.8}
              >
                <Text style={styles.backToVerifyText}>Back to verification</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 0,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoIconText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E0E0E0',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  successText: {
    color: '#10B981',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  errorBanner: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  errorBannerText: {
    color: '#E74C3C',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  stepLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 0,
  },
  actionButton: {
    marginTop: 16,
    borderRadius: 28,
  },
  backToVerifyButton: {
    marginTop: 24,
    alignItems: 'center',
    padding: 8,
  },
  backToVerifyText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
