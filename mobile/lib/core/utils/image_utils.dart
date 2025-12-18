import 'dart:io';
import 'dart:typed_data';
import 'package:image/image.dart' as img;

class ImageUtils {
  /// Compress image to target size (in bytes)
  static Future<Uint8List> compressImage(
    File imageFile, {
    int maxSizeBytes = 2 * 1024 * 1024, // 2MB default
    int quality = 85,
  }) async {
    final originalBytes = await imageFile.readAsBytes();
    final originalSize = originalBytes.length;

    // If already under target size, return as-is
    if (originalSize <= maxSizeBytes) {
      return originalBytes;
    }

    // Decode image
    img.Image? image = img.decodeImage(originalBytes);
    if (image == null) {
      throw Exception('Failed to decode image');
    }

    // Calculate compression ratio needed
    final ratio = maxSizeBytes / originalSize;
    final targetQuality = (quality * ratio).clamp(50, 95).toInt();

    // Compress
    final compressedBytes = img.encodeJpg(image, quality: targetQuality);

    // If still too large, resize image
    if (compressedBytes.length > maxSizeBytes) {
      final scaleFactor = 0.8;
      final newWidth = (image.width * scaleFactor).toInt();
      final newHeight = (image.height * scaleFactor).toInt();
      
      final resized = img.copyResize(
        image,
        width: newWidth,
        height: newHeight,
      );
      
      return img.encodeJpg(resized, quality: targetQuality);
    }

    return Uint8List.fromList(compressedBytes);
  }

  /// Get image dimensions
  static Future<Map<String, int>> getImageDimensions(File imageFile) async {
    final bytes = await imageFile.readAsBytes();
    final image = img.decodeImage(bytes);
    
    if (image == null) {
      throw Exception('Failed to decode image');
    }

    return {
      'width': image.width,
      'height': image.height,
    };
  }
}


