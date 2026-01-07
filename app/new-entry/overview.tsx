import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { generateOverview } from '@/lib/openai';

export default function OverviewScreen() {
  const { extractedText, photos } = useLocalSearchParams<{
    extractedText: string;
    photos: string;
  }>();
  const [overview, setOverview] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    generateOverviewText();
  }, []);

  const generateOverviewText = async () => {
    try {
      const result = await generateOverview(extractedText || '');
      setOverview(result);
    } catch (error) {
      console.error('Overview generation error:', error);
      setOverview(
        'We captured your thoughts. Take a moment to review before we discover the tangents within.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push({
      pathname: '/new-entry/discovery',
      params: {
        extractedText,
        overview,
        photos,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Overview</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C75D5D" />
            <Text style={styles.loadingText}>
              Creating your overview...
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.overviewContainer}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.9}
          >
            {isEditing ? (
              <TextInput
                style={styles.overviewInput}
                value={overview}
                onChangeText={setOverview}
                multiline
                autoFocus
                onBlur={() => setIsEditing(false)}
              />
            ) : (
              <>
                <Text style={styles.overviewText}>{overview}</Text>
                <Text style={styles.editHint}>Tap to edit</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Extracted Text Preview */}
        {!loading && (
          <View style={styles.extractedContainer}>
            <Text style={styles.extractedLabel}>Extracted Text</Text>
            <Text style={styles.extractedText} numberOfLines={6}>
              {extractedText}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      {!loading && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    
    fontSize: 18,
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
  },
  loadingText: {
    
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  overviewContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0EDE8',
    marginBottom: 24,
  },
  overviewText: {
    
    fontSize: 18,
    color: '#1A1A1A',
    lineHeight: 28,
  },
  overviewInput: {
    
    fontSize: 18,
    color: '#1A1A1A',
    lineHeight: 28,
    minHeight: 100,
  },
  editHint: {
    
    fontSize: 12,
    color: '#999',
    marginTop: 16,
  },
  extractedContainer: {
    backgroundColor: '#F9F7F2',
    borderRadius: 12,
    padding: 16,
  },
  extractedLabel: {
    
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  extractedText: {
    
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  continueButton: {
    backgroundColor: '#C75D5D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueText: {
    
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});

