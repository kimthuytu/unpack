import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/api_endpoints.dart';
import '../models/entry_model.dart';
import 'api_service.dart';
import 'dart:io';

class EntryService {
  final ApiService _apiService;

  EntryService(this._apiService);

  Future<List<EntryModel>> getEntries() async {
    try {
      final response = await _apiService.get(ApiEndpoints.entries);
      final data = response.data as Map<String, dynamic>;
      final entriesList = data['entries'] as List;
      
      return entriesList
          .map((json) => EntryModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw Exception('Failed to load entries: $e');
    }
  }

  Future<EntryModel> getEntry(String id) async {
    try {
      final response = await _apiService.get(ApiEndpoints.entry(id));
      return EntryModel.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      throw Exception('Failed to load entry: $e');
    }
  }

  Future<EntryModel> createEntry(List<File> images) async {
    try {
      // Upload images first
      final imageUrls = <String>[];
      for (var image in images) {
        final response = await _apiService.uploadFile(
          ApiEndpoints.entries,
          image.path,
          fieldName: 'images',
        );
        final data = response.data as Map<String, dynamic>;
        imageUrls.addAll((data['imageUrls'] as List).cast<String>());
      }

      // Create entry with image URLs
      final response = await _apiService.post(
        ApiEndpoints.entries,
        data: {
          'images': imageUrls,
        },
      );

      return EntryModel.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      throw Exception('Failed to create entry: $e');
    }
  }

  Future<EntryModel> processOcr(String entryId) async {
    try {
      final response = await _apiService.post(ApiEndpoints.entryOcr(entryId));
      return EntryModel.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      throw Exception('Failed to process OCR: $e');
    }
  }

  Future<void> deleteEntry(String id) async {
    try {
      await _apiService.delete(ApiEndpoints.entry(id));
    } catch (e) {
      throw Exception('Failed to delete entry: $e');
    }
  }
}

final entryServiceProvider = Provider<EntryService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return EntryService(apiService);
});

final entriesProvider = FutureProvider<List<EntryModel>>((ref) async {
  final entryService = ref.watch(entryServiceProvider);
  return await entryService.getEntries();
});


