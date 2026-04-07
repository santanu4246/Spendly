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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useThemeStore } from '@/store/theme-store';
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
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  
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

  const isLight = activeTheme === 'light';

  const gradientColors = isLight
    ? (['#E0FDD2', '#FFFFFF', '#FFFFFF'] as const)
    : (['#0B2E1F', '#0A0A0A', '#0A0A0A'] as const);
  const gradientLocations = [0, 0.4, 1] as const;

  return (
    <LinearGradient
      colors={[...gradientColors]}
      locations={[...gradientLocations]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.safeArea, { 
        paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0),
        paddingBottom: insets.bottom
      }]}
    >
      <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} backgroundColor="transparent" translucent />
      <KeyboardAwareScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 40}
      >
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.text }]}>
              {isLogin ? 'Welcome Back' : 'Sign Up'}
            </Text>
            <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
              {isLogin ? 'Sign in to continue' : 'Create account to continue'}
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
                  <Text style={[styles.forgotPasswordText, { color: isLight ? '#007725' : Colors.primaryLight }]}>Forgot password?</Text>
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
              <Text style={[styles.termsText, { color: Colors.textSecondary }]}>
                I agree to the <Text style={[styles.termsLink, { color: Colors.text }]}>Terms & Conditions and Privacy Policy.</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms ? <Text style={[styles.errorText, { color: Colors.error }]}>{errors.terms}</Text> : null}

            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: Colors.border }]} />
              <Text style={[styles.dividerText, { color: Colors.textSecondary }]}>or continue with</Text>
              <View style={[styles.divider, { backgroundColor: Colors.border }]} />
            </View>

            <TouchableOpacity style={[styles.socialButton, { backgroundColor: Colors.card, borderColor: Colors.border }]} activeOpacity={0.8}>
              <GoogleIcon size={20} />
              <Text style={[styles.socialButtonText, { color: Colors.text }]}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, { backgroundColor: Colors.card, borderColor: Colors.border }]} activeOpacity={0.8}>
              <Ionicons name="logo-apple" size={20} color={Colors.text} />
              <Text style={[styles.socialButtonText, { color: Colors.text }]}>Continue with Apple</Text>
            </TouchableOpacity>

            <View style={styles.switchModeContainer}>
              <Text style={[styles.switchModeText, { color: Colors.textSecondary }]}>
                {isLogin ? "New here? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={[styles.switchModeLink, { color: isLight ? '#007725' : Colors.primaryLight }]}>
                  {isLogin ? "Sign Up" : "Sign in"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity>
                <Text style={[styles.footerLink, { color: Colors.text }]}>Disclaimer</Text>
              </TouchableOpacity>
              <Text style={[styles.footerDot, { color: Colors.text }]}> • </Text>
              <TouchableOpacity>
                <Text style={[styles.footerLink, { color: Colors.text }]}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>

          </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
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
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  actionButton: {
    marginBottom: 24,
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
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorText: {
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
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    marginBottom: 16,
    borderWidth: 1,
  },
  socialButtonText: {
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
    fontSize: 15,
  },
  switchModeLink: {
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
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  footerDot: {
    fontSize: 13,
    marginHorizontal: 8,
  },
});
