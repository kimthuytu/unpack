import 'dart:io';
import 'package:dio/dio.dart';
import '../models/entry_model.dart';
import '../utils/test_data.dart';
import 'api_service_interface.dart';

/// Mock API service for testing without backend
/// This simulates API responses for development and testing
class MockApiService implements ApiServiceInterface {
  final List<EntryModel> _entries = [];
  bool _isInitialized = false;

  MockApiService() {
    _initialize();
  }

  void _initialize() {
    if (!_isInitialized) {
      // Add the test journal entry
      _entries.add(TestData.createTestEntry(
        id: 'test-entry-1',
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      ));
      _isInitialized = true;
    }
  }

  final Map<String, List<Map<String, dynamic>>> _chatHistory = {};

  Future<Response<T>> get<T>(String path, {Map<String, dynamic>? queryParameters, Options? options}) async {
    await Future.delayed(const Duration(milliseconds: 500)); // Simulate network delay

    if (path == '/api/entries') {
      return Response<T>(
        requestOptions: RequestOptions(path: path),
        data: {
          'entries': _entries.map((e) => e.toJson()).toList(),
        } as T,
        statusCode: 200,
      );
    }

    // Handle individual entry
    if (path.startsWith('/api/entries/') && !path.contains('/ocr') && !path.contains('/chat')) {
      final entryId = path.split('/').last;
      final entry = _entries.firstWhere(
        (e) => e.id == entryId,
        orElse: () => throw Exception('Entry not found'),
      );
      return Response<T>(
        requestOptions: RequestOptions(path: path),
        data: entry.toJson() as T,
        statusCode: 200,
      );
    }

    // Handle chat history
    if (path.contains('/chat') && !path.contains('POST')) {
      final entryId = path.split('/')[3];
      final messages = _chatHistory[entryId] ?? [];
      return Response<T>(
        requestOptions: RequestOptions(path: path),
        data: {
          'messages': messages,
        } as T,
        statusCode: 200,
      );
    }

    // Handle recommendations
    if (path == '/api/recommendations') {
      return Response<T>(
        requestOptions: RequestOptions(path: path),
        data: {
          'recommendations': [
            {
              'title': 'Finding Purpose in Daily Life',
              'excerpt': 'Explore how small daily actions can contribute to a greater sense of purpose and meaning.',
              'author': 'Mindful Living',
              'url': 'https://example.com/article1',
            },
            {
              'title': 'The Philosophy of Work and Meaning',
              'excerpt': 'A deep dive into how work shapes our identity and sense of purpose in the modern world.',
              'author': 'Philosophy Today',
              'url': 'https://example.com/article2',
            },
          ],
        } as T,
        statusCode: 200,
      );
    }

    throw Exception('Not found: $path');
  }

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    await Future.delayed(const Duration(milliseconds: 800)); // Simulate network delay

    // Create entry
    if (path == '/api/entries') {
      final images = (data as Map<String, dynamic>)['images'] as List<String>;
      final newEntry = EntryModel(
        id: 'entry-${DateTime.now().millisecondsSinceEpoch}',
        userId: 'test-user',
        createdAt: DateTime.now(),
        images: List<String>.from(images),
      );
      _entries.insert(0, newEntry);
      return Response<T>(
        requestOptions: RequestOptions(path: path),
        data: newEntry.toJson() as T,
        statusCode: 201,
      );
    }

    // Process OCR
    if (path.contains('/ocr')) {
      final entryId = path.split('/')[3];
      final entryIndex = _entries.indexWhere((e) => e.id == entryId);
      
      if (entryIndex == -1) {
        throw Exception('Entry not found');
      }

      // Simulate OCR processing with test data
      final processedEntry = TestData.createTestEntry(
        id: entryId,
        createdAt: _entries[entryIndex].createdAt,
        images: _entries[entryIndex].images,
      );

      _entries[entryIndex] = processedEntry;

      return Response<T>(
        requestOptions: RequestOptions(path: path),
        data: processedEntry.toJson() as T,
        statusCode: 200,
      );
    }

    // Send chat message
    if (path.contains('/chat')) {
      final entryId = path.split('/')[3];
      final message = (data as Map<String, dynamic>)['message'] as String;
      
      // Add user message
      final now = DateTime.now();
      final userMessage = {
        'id': 'msg-user-${now.millisecondsSinceEpoch}',
        'entryId': entryId,
        'userId': 'test-user',
        'role': 'user',
        'content': message,
        'timestamp': now.toIso8601String(),
      };
      
      if (!_chatHistory.containsKey(entryId)) {
        _chatHistory[entryId] = [];
      }
      _chatHistory[entryId]!.add(userMessage);
      
      // Add assistant response
      final assistantMessage = {
        'id': 'msg-assistant-${now.millisecondsSinceEpoch}',
        'entryId': entryId,
        'userId': 'test-user',
        'role': 'assistant',
        'content': 'This is a thoughtful reflection on life\'s purpose. The questions you\'re asking show deep introspection about meaning, work, and relationships. What resonates most with you in these reflections?',
        'timestamp': now.toIso8601String(),
      };
      _chatHistory[entryId]!.add(assistantMessage);
      
      return Response<T>(
        requestOptions: RequestOptions(path: path),
        data: assistantMessage as T,
        statusCode: 200,
      );
    }

    throw Exception('Not implemented: $path');
  }

  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    await Future.delayed(const Duration(milliseconds: 300));

    final entryId = path.split('/').last;
    final index = _entries.indexWhere((e) => e.id == entryId);
    
    if (index == -1) {
      throw Exception('Entry not found');
    }

    _entries.removeAt(index);
    _chatHistory.remove(entryId); // Also remove chat history

    return Response<T>(
      requestOptions: RequestOptions(path: path),
      data: null as T,
      statusCode: 200,
    );
  }

  Future<Response<T>> uploadFile<T>(
    String path,
    String filePath, {
    String fieldName = 'file',
    Map<String, dynamic>? additionalData,
    ProgressCallback? onSendProgress,
  }) async {
    await Future.delayed(const Duration(milliseconds: 1000)); // Simulate upload

    // Return mock image URL
    return Response<T>(
      requestOptions: RequestOptions(path: path),
      data: {
        'imageUrls': [
          'https://via.placeholder.com/400x600?text=Journal+Entry',
        ],
      } as T,
      statusCode: 200,
    );
  }

  void setAuthToken(String? token) {
    // Mock doesn't need auth
  }

  /// Add a test entry directly (for debug purposes)
  void addTestEntry(EntryModel entry) {
    _entries.insert(0, entry);
  }

  /// Clear all entries (for testing)
  void clearEntries() {
    _entries.clear();
  }
}

