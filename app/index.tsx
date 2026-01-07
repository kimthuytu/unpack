import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MOCK_MODE } from '@/lib/config';

export default function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure navigation is ready
    const timer = setTimeout(() => {
      setReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    if (MOCK_MODE) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  };

  // Auto-navigate in mock mode after ready
  useEffect(() => {
    if (ready && MOCK_MODE) {
      router.replace('/(tabs)');
    }
  }, [ready]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unpack</Text>
      <Text style={styles.subtitle}>From chaos to clarity</Text>
      
      {!MOCK_MODE && (
        <TouchableOpacity style={styles.button} onPress={handleEnter}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}
      
      {MOCK_MODE && !ready && (
        <Text style={styles.loading}>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
    padding: 24,
  },
  title: {
    fontSize: 48,
    color: '#1A1A1A',
    marginBottom: 8,
    fontWeight: '300',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#C75D5D',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    fontSize: 14,
    color: '#999',
  },
});
