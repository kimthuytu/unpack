import 'package:flutter/foundation.dart';
import '../models/entry_model.dart';
import '../services/entry_service.dart';
import 'test_data.dart';

/// Debug helper for testing and development
class DebugHelper {
  /// Add a test entry with the journal entry text
  /// This is useful for testing without needing to capture images
  static Future<void> addTestJournalEntry(EntryService entryService) async {
    if (!kDebugMode) {
      throw Exception('DebugHelper can only be used in debug mode');
    }

    // In a real scenario, you would upload the image and create the entry via API
    // For testing, we'll create a mock entry with the journal text
    // This assumes your backend can handle test entries or you're mocking the API
    
    final testEntry = TestData.createTestEntry();
    
    // Note: This is a placeholder - in production, entries are created via API
    // You would need to either:
    // 1. Mock the API response
    // 2. Have a test endpoint that accepts this data
    // 3. Use a local storage provider for testing
    
    debugPrint('Test entry created: ${testEntry.id}');
    debugPrint('OCR Text: ${testEntry.ocrText?.substring(0, 100)}...');
  }

  /// Get the sample journal text for manual testing
  static String getSampleJournalText() {
    return TestData.sampleJournalText;
  }
}

