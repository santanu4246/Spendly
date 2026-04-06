import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    const loadSession = async () => {
      await hydrate();
      setIsLoading(false);
    };
    
    loadSession();
  }, []);

  if (isLoading || !isHydrated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.text} />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
