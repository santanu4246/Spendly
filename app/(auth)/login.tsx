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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GoogleIcon } from '@/components/ui/icons';

export default function LoginScreen() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    terms: '',
  });
  
  const { login, signup, loginError, signupError, clearErrors } = useAuthStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    clearErrors();
    setErrors({ fullName: '', email: '', password: '', terms: '' });
  }, [isLogin]);

  const handleFieldChange = (field: string, value: string | boolean) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    clearErrors();
    
    switch (field) {
      case 'fullName':
        setFullName(value as string);
        break;
      case 'email':
        setEmail(value as string);
        break;
      case 'password':
        setPassword(value as string);
        break;
      case 'terms':
        setAgreeTerms(value as boolean);
        break;
    }
  };

  const validateFields = (): boolean => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      terms: '',
    };
    
    let isValid = true;
    
    if (!isLogin) {
      if (!fullName.trim()) {
        newErrors.fullName = 'Display name is required';
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
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms';
      isValid = false;
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
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
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoIconText}>S</Text>
              </View>
              <Text style={styles.logoText}>Spendly</Text>
            </View>
            <Text style={styles.title}>
              {isLogin ? 'Sign in to continue' : 'Sign up to continue'}
            </Text>
          </View>

          {currentError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{currentError}</Text>
            </View>
          )}

          <View style={styles.formContainer}>
            <Input
              label="Email"
              placeholder="example@mail.com"
              value={email}
              onChangeText={(value) => handleFieldChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            {!isLogin && (
              <Input
                label="Display Name"
                placeholder="Jane Doe"
                value={fullName}
                onChangeText={(value) => handleFieldChange('fullName', value)}
                autoCapitalize="words"
                error={errors.fullName}
              />
            )}
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(value) => handleFieldChange('password', value)}
              isPassword
              error={errors.password}
            />

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
              title={isLogin ? "Sign In" : "Sign Up"}
              onPress={handleAuth}
              loading={loading}
              style={styles.actionButton}
            />

            <TouchableOpacity 
              style={styles.termsContainer} 
              onPress={() => handleFieldChange('terms', !agreeTerms)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={agreeTerms ? "checkbox" : "square-outline"} 
                size={22} 
                color={agreeTerms ? Colors.primary : Colors.error} 
                style={styles.checkboxIcon}
              />
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms & Conditions and Privacy Policy.</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
              <GoogleIcon size={20} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
              <Ionicons name="logo-apple" size={20} color={Colors.text} />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>

            <View style={styles.switchModeContainer}>
              <Text style={styles.switchModeText}>
                {isLogin ? "New here? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.switchModeLink}>
                  {isLogin ? "Sign Up" : "Sign in"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Disclaimer</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}> • </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms & Conditions</Text>
              </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  actionButton: {
    marginBottom: 24,
    borderRadius: 28,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkboxIcon: {
    marginRight: 10,
    marginTop: -2,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.text,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: -4,
    marginBottom: 16,
    marginLeft: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    height: 56,
    borderRadius: 28,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  socialButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  switchModeText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  switchModeLink: {
    color: Colors.primaryLight,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  footerLink: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  footerDot: {
    color: Colors.text,
    fontSize: 13,
    marginHorizontal: 8,
  },
});
