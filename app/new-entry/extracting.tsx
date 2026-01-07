import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { extractTextFromImage } from '@/lib/openai';

const BREATHING_MESSAGES = [
  { range: [0, 30], text: "We're extracting your handwriting..." },
  { range: [31, 60], text: 'Breathe in...' },
  { range: [61, 95], text: 'Breathe out...' },
  { range: [96, 100], text: 'Almost there...' },
];

export default function ExtractingScreen() {
  const { photos: photosParam } = useLocalSearchParams<{ photos: string }>();
  const photos: string[] = photosParam ? JSON.parse(photosParam) : [];
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(BREATHING_MESSAGES[0].text);
  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    extractText();
  }, []);

  useEffect(() => {
    // Update message based on progress
    const message = BREATHING_MESSAGES.find(
      (m) => progress >= m.range[0] && progress <= m.range[1]
    );
    if (message) {
      setCurrentMessage(message.text);
    }

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const extractText = async () => {
    try {
      let extractedTexts: string[] = [];
      let totalConfidence = 0;

      for (let i = 0; i < photos.length; i++) {
        // Update progress (each photo is a portion of total)
        const baseProgress = (i / photos.length) * 90;
        setProgress(baseProgress);

        // Read image as base64
        const base64 = await FileSystem.readAsStringAsync(photos[i], {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Extract text using OpenAI
        const result = await extractTextFromImage(base64);
        extractedTexts.push(result.text);
        totalConfidence += result.confidence;

        setProgress(baseProgress + (90 / photos.length));
      }

      setProgress(100);

      const combinedText = extractedTexts.join('\n\n---\n\n');
      const avgConfidence = totalConfidence / photos.length;

      // Small delay to show completion
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Route based on confidence
      if (avgConfidence < 0.6) {
        router.replace({
          pathname: '/new-entry/text-review',
          params: {
            extractedText: combinedText,
            photos: JSON.stringify(photos),
          },
        });
      } else {
        router.replace({
          pathname: '/new-entry/overview',
          params: {
            extractedText: combinedText,
            photos: JSON.stringify(photos),
          },
        });
      }
    } catch (error) {
      console.error('Extraction error:', error);
      Alert.alert(
        'Extraction Failed',
        'We had trouble reading your handwriting. Please try again with clearer photos.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Extraction',
      'Are you sure you want to cancel? Your progress will be lost.',
      [
        { text: 'Nevermind', style: 'cancel' },
        {
          text: 'Cancel and Exit',
          style: 'destructive',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
        <Ionicons name="close" size={24} color="#1A1A1A" />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.message}>{currentMessage}</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0EDE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  message: {
    
    fontSize: 24,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 48,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0EDE8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C75D5D',
    borderRadius: 4,
  },
  progressText: {
    
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
});

