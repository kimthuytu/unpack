import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { discoverTangents, DiscoveredTangent } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { MOCK_MODE } from '@/lib/config';

export default function DiscoveryScreen() {
  const { extractedText, overview, photos } = useLocalSearchParams<{
    extractedText: string;
    overview: string;
    photos: string;
  }>();
  const { user } = useAuth();
  const [tangents, setTangents] = useState<DiscoveredTangent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    discoverTangentsFromText();
  }, []);

  const discoverTangentsFromText = async () => {
    try {
      const result = await discoverTangents(extractedText || '');
      setTangents(result);
    } catch (error) {
      console.error('Tangent discovery error:', error);
      setTangents([
        {
          name: 'Journal Entry',
          emotion: 'reflection',
          excerpt: extractedText?.substring(0, 100) || '',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);

    try {
      if (MOCK_MODE) {
        // In mock mode, just navigate to a mock tangent chat
        await new Promise(resolve => setTimeout(resolve, 500));
        router.replace('/tangent/tangent-1');
        return;
      }

      // Create entry
      const { data: entry, error: entryError } = await supabase
        .from('entries')
        .insert({
          user_id: user.id,
          photo_urls: photos ? JSON.parse(photos) : [],
          extracted_text: extractedText,
          overview: overview,
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // Create tangents
      const tangentInserts = tangents.map((t) => ({
        entry_id: entry.id,
        user_id: user.id,
        name: t.name,
        emotion: t.emotion,
        is_interacted: false,
      }));

      const { data: createdTangents, error: tangentsError } = await supabase
        .from('tangents')
        .insert(tangentInserts)
        .select();

      if (tangentsError) throw tangentsError;

      if (createdTangents && createdTangents.length > 0) {
        router.replace(`/tangent/${createdTangents[0].id}`);
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Save error:', error);
      router.replace('/(tabs)');
    }
  };

  const handleExit = async () => {
    if (MOCK_MODE) {
      router.replace('/(tabs)');
      return;
    }

    if (!user) {
      router.replace('/(tabs)');
      return;
    }
    
    setSaving(true);
    try {
      const { data: entry, error: entryError } = await supabase
        .from('entries')
        .insert({
          user_id: user.id,
          photo_urls: photos ? JSON.parse(photos) : [],
          extracted_text: extractedText,
          overview: overview,
        })
        .select()
        .single();

      if (entryError) throw entryError;

      const tangentInserts = tangents.map((t) => ({
        entry_id: entry.id,
        user_id: user.id,
        name: t.name,
        emotion: t.emotion,
        is_interacted: false,
      }));

      await supabase.from('tangents').insert(tangentInserts);
    } catch (error) {
      console.error('Save error:', error);
    }
    
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit}>
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Tangent Discovery</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C75D5D" />
          <Text style={styles.loadingText}>
            Discovering tangents in your thoughts...
          </Text>
        </View>
      ) : (
        <>
          {/* Tangent Cards */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.subtitle}>
              We found {tangents.length} tangent{tangents.length !== 1 ? 's' : ''} in your entry
            </Text>

            {tangents.map((tangent, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tangentCard,
                  selectedIndex === index && styles.tangentCardSelected,
                ]}
                onPress={() => setSelectedIndex(index)}
              >
                <View style={styles.tangentHeader}>
                  <Text style={styles.tangentName}>{tangent.name}</Text>
                  <View style={styles.emotionBadge}>
                    <Text style={styles.emotionText}>{tangent.emotion}</Text>
                  </View>
                </View>
                <Text style={styles.tangentExcerpt} numberOfLines={2}>
                  "{tangent.excerpt}"
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.finishButton, saving && styles.buttonDisabled]}
              onPress={handleFinish}
              disabled={saving}
            >
              <Text style={styles.finishText}>
                {saving ? 'Saving...' : 'Start Unpacking'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  subtitle: {
    
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  tangentCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F0EDE8',
  },
  tangentCardSelected: {
    borderColor: '#C75D5D',
  },
  tangentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tangentName: {
    
    fontSize: 20,
    color: '#1A1A1A',
    flex: 1,
  },
  emotionBadge: {
    backgroundColor: '#FEE9E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emotionText: {
    
    fontSize: 12,
    color: '#C75D5D',
    textTransform: 'capitalize',
  },
  tangentExcerpt: {
    
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F0EDE8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backText: {
    
    fontSize: 16,
    color: '#666',
  },
  finishButton: {
    flex: 2,
    backgroundColor: '#C75D5D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  finishText: {
    
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});
