import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  danger?: boolean;
}

function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  danger = false,
}: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View
        style={[styles.iconContainer, danger && styles.iconContainerDanger]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? '#C75D5D' : '#666'}
        />
      </View>
      <View style={styles.settingsContent}>
        <Text style={[styles.settingsTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'Send us a note at kthuytu@gmail.com',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon="person-outline"
              title="Account"
              subtitle={user?.email || 'Manage your account'}
              onPress={() => Alert.alert('Coming Soon', 'Account management coming soon')}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon="color-palette-outline"
              title="Appearance"
              subtitle="Light, Dark, System"
              onPress={() => Alert.alert('Coming Soon', 'Theme settings coming soon')}
            />
            <SettingsItem
              icon="shield-outline"
              title="Data & Privacy"
              subtitle="Manage how your data is stored"
              onPress={() => Alert.alert('Coming Soon', 'Data settings coming soon')}
            />
            <SettingsItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Manage alerts"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon')}
            />
          </View>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Subscription</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon="card-outline"
              title="Subscription"
              subtitle="Free Plan"
              onPress={() => Alert.alert('Coming Soon', 'Subscription management coming soon')}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon="chatbubble-outline"
              title="Send us a note"
              onPress={handleFeedback}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon="log-out-outline"
              title="Sign Out"
              onPress={handleSignOut}
              showArrow={false}
              danger
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Unpack - Ver 1.0</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms & Privacy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    
    fontSize: 32,
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0EDE8',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F5F3EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerDanger: {
    backgroundColor: '#FEE9E9',
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    
    fontSize: 16,
    color: '#1A1A1A',
  },
  settingsSubtitle: {
    
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  dangerText: {
    color: '#C75D5D',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 8,
  },
  footerText: {
    
    fontSize: 14,
    color: '#999',
  },
  footerLink: {
    
    fontSize: 14,
    color: '#C75D5D',
  },
});

