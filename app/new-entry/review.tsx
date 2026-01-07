import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const PHOTO_WIDTH = width - 80;

export default function ReviewScreen() {
  const { photos: photosParam } = useLocalSearchParams<{ photos: string }>();
  const [photos, setPhotos] = useState<string[]>(
    photosParam ? JSON.parse(photosParam) : []
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleRemove = (index: number) => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const newPhotos = photos.filter((_, i) => i !== index);
          setPhotos(newPhotos);
          setSelectedIndex(null);
          if (newPhotos.length === 0) {
            router.back();
          }
        },
      },
    ]);
  };

  const handleReplace = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhotos = [...photos];
      newPhotos[index] = result.assets[0].uri;
      setPhotos(newPhotos);
      setSelectedIndex(null);
    }
  };

  const handleMoveLeft = (index: number) => {
    if (index > 0) {
      const newPhotos = [...photos];
      [newPhotos[index - 1], newPhotos[index]] = [
        newPhotos[index],
        newPhotos[index - 1],
      ];
      setPhotos(newPhotos);
    }
    setSelectedIndex(null);
  };

  const handleMoveRight = (index: number) => {
    if (index < photos.length - 1) {
      const newPhotos = [...photos];
      [newPhotos[index], newPhotos[index + 1]] = [
        newPhotos[index + 1],
        newPhotos[index],
      ];
      setPhotos(newPhotos);
    }
    setSelectedIndex(null);
  };

  const handleAddMore = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const handleContinue = () => {
    router.push({
      pathname: '/new-entry/extracting',
      params: { photos: JSON.stringify(photos) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Review Photos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMore}>
          <Ionicons name="add" size={24} color="#C75D5D" />
        </TouchableOpacity>
      </View>

      {/* Photo Preview */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photoScroll}
      >
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={index}
            style={styles.photoContainer}
            onPress={() => setSelectedIndex(index)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: photo }} style={styles.photo} />
            <View style={styles.photoNumber}>
              <Text style={styles.photoNumberText}>{index + 1}</Text>
            </View>
            <TouchableOpacity
              style={styles.photoMenu}
              onPress={() => setSelectedIndex(index)}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color="#FFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Page Indicator */}
      <View style={styles.pageIndicator}>
        {photos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === 0 && styles.dotActive, // TODO: Track current page
            ]}
          />
        ))}
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Action Sheet */}
      {selectedIndex !== null && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setSelectedIndex(null)}
        >
          <View style={styles.actionSheet}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => handleRemove(selectedIndex)}
            >
              <Ionicons name="trash-outline" size={20} color="#C75D5D" />
              <Text style={[styles.actionText, styles.dangerText]}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => handleReplace(selectedIndex)}
            >
              <Ionicons name="swap-horizontal-outline" size={20} color="#1A1A1A" />
              <Text style={styles.actionText}>Replace</Text>
            </TouchableOpacity>
            {selectedIndex > 0 && (
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => handleMoveLeft(selectedIndex)}
              >
                <Ionicons name="arrow-back-outline" size={20} color="#1A1A1A" />
                <Text style={styles.actionText}>Move to the left</Text>
              </TouchableOpacity>
            )}
            {selectedIndex < photos.length - 1 && (
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => handleMoveRight(selectedIndex)}
              >
                <Ionicons name="arrow-forward-outline" size={20} color="#1A1A1A" />
                <Text style={styles.actionText}>Move to the right</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
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
  addButton: {
    padding: 4,
  },
  photoScroll: {
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  photoContainer: {
    width: PHOTO_WIDTH,
    aspectRatio: 3 / 4,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F0EDE8',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoNumber: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoNumberText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  photoMenu: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 36,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
  },
  dotActive: {
    backgroundColor: '#C75D5D',
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
  },
  actionText: {
    
    fontSize: 16,
    color: '#1A1A1A',
  },
  dangerText: {
    color: '#C75D5D',
  },
});

