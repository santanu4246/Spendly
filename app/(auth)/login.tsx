import React, { useState, useEffect } from 'react';
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
import { AuthToggle } from '@/components/auth/auth-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useRouter, Link } from 'expo-router';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const { login, signup, loginError, signupError, clearErrors } = useAuthStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    clearErrors();
    setErrors({ fullName: '', email: '', password: '', confirmPassword: '' });
  }, [isLogin]);

  // Clear field errors on input change
  const handleFieldChange = (field: string, value: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    clearErrors();
    
    switch (field) {
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  const validateFields = (): boolean => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    let isValid = true;
    
    if (!isLogin) {
      if (!fullName.trim()) {
        newErrors.fullName = 'Full name is required';
        isValid = false;
      }
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    
    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleAuth = async () => {
    if (!validateFields()) return;
    
    try {
      setLoading(true);
      let success = false;
      
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await signup(fullName, email, password);
      }
      
      if (success) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentError = isLogin ? loginError : signupError;

  return (
    <View style={[styles.safeArea, { 
      paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0),
      paddingBottom: insets.bottom 
    }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <KeyboardAwareScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 40}
      >
          
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={styles.title}>Welcome to Spendly</Text>
            <Text style={styles.subtitle}>
              Track your money beautifully with real-time insights
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Get started</Text>
            <Text style={styles.cardSubtitle}>
              Sign in to your account or create a new one
            </Text>
            
            <AuthToggle isLogin={isLogin} setIsLogin={setIsLogin} />

            {currentError && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{currentError}</Text>
              </View>
            )}

            <View style={styles.formContainer}>
              {!isLogin && (
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={(value) => handleFieldChange('fullName', value)}
                  autoCapitalize="words"
                  error={errors.fullName}
                />
              )}
              
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={(value) => handleFieldChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
              />
              
              <Input
                label="Password"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                value={password}
                onChangeText={(value) => handleFieldChange('password', value)}
                isPassword
                error={errors.password}
              />

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={(value) => handleFieldChange('confirmPassword', value)}
                  isPassword
                  error={errors.confirmPassword}
                />
              )}

              {isLogin && (
                <Link href="./forgot-password" asChild>
                  <TouchableOpacity
                    style={styles.forgotPassword}
                    accessibilityRole="link"
                    accessibilityLabel="Forgot password"
                  >
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                  </TouchableOpacity>
                </Link>
              )}

              <Button
                title={isLogin ? "Sign In" : "Create Account"}
                onPress={handleAuth}
                loading={loading}
                style={styles.actionButton}
              />
            </View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.text,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  errorBanner: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorBannerText: {
    color: '#E74C3C',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -4,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  actionButton: {
    marginTop: 8,
  }
});
