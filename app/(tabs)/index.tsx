import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase, Tangent } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { MOCK_MODE, MOCK_TANGENTS } from '@/lib/config';

interface GroupedTangents {
  [date: string]: Tangent[];
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [tangents, setTangents] = useState<Tangent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTangents = async () => {
    if (MOCK_MODE) {
      setTangents(MOCK_TANGENTS);
      setLoading(false);
      return;
    }

    if (!user) return;

    const { data, error } = await supabase
      .from('tangents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setTangents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTangents();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTangents();
    setRefreshing(false);
  };

  // Group tangents by date
  const groupedTangents = tangents.reduce<GroupedTangents>((acc, tangent) => {
    const date = new Date(tangent.created_at).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(tangent);
    return acc;
  }, {});

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Unpack</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/(tabs)/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Mock Mode Banner */}
      {MOCK_MODE && (
        <View style={styles.mockBanner}>
          <Text style={styles.mockBannerText}>🎭 Demo Mode - Sample Data</Text>
        </View>
      )}

      {/* Tangent List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        ) : Object.keys(groupedTangents).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tangents yet</Text>
            <Text style={styles.emptyText}>
              Tap the button below to scan your first journal entry
            </Text>
          </View>
        ) : (
          Object.entries(groupedTangents).map(([date, dateTangents]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{date}</Text>
              {dateTangents.map((tangent) => (
                <TouchableOpacity
                  key={tangent.id}
                  style={styles.tangentItem}
                  onPress={() => router.push(`/tangent/${tangent.id}`)}
                >
                  <View
                    style={[
                      styles.indicator,
                      tangent.is_interacted && styles.indicatorFilled,
                    ]}
                  />
                  <View style={styles.tangentContent}>
                    <Text style={styles.tangentName}>{tangent.name}</Text>
                    <Text style={styles.tangentMeta}>
                      {tangent.emotion} • {formatTime(tangent.created_at)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/new-entry/capture')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
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
    fontSize: 32,
    color: '#1A1A1A',
    fontWeight: '300',
  },
  settingsButton: {
    padding: 8,
  },
  mockBanner: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginHorizontal: 24,
    borderRadius: 8,
    marginBottom: 8,
  },
  mockBannerText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
  },
  emptyTitle: {
    fontSize: 24,
    color: '#1A1A1A',
    marginBottom: 8,
    fontWeight: '300',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  tangentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C75D5D',
    marginRight: 16,
  },
  indicatorFilled: {
    backgroundColor: '#C75D5D',
  },
  tangentContent: {
    flex: 1,
  },
  tangentName: {
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tangentMeta: {
    fontSize: 14,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#C75D5D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
