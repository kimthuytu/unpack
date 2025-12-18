import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/api_endpoints.dart';
import 'api_service.dart';

class RecommendationService {
  final ApiService _apiService;

  RecommendationService(this._apiService);

  Future<List<Map<String, dynamic>>> getRecommendations() async {
    try {
      final response = await _apiService.get(ApiEndpoints.recommendations);
      final data = response.data as Map<String, dynamic>;
      final recommendationsList = data['recommendations'] as List;
      
      return recommendationsList
          .map((item) => item as Map<String, dynamic>)
          .toList();
    } catch (e) {
      throw Exception('Failed to load recommendations: $e');
    }
  }
}

final recommendationServiceProvider = Provider<RecommendationService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return RecommendationService(apiService);
});

final recommendationsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final recommendationService = ref.watch(recommendationServiceProvider);
  return await recommendationService.getRecommendations();
});


