import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';
import '../services/api_service_interface.dart';
import '../services/mock_api_service.dart' if (dart.library.io) '../services/mock_api_service.dart';

final apiServiceProvider = Provider<ApiServiceInterface>((ref) {
  // Use mock API service in debug mode for testing without backend
  if (kDebugMode && const bool.fromEnvironment('USE_MOCK_API', defaultValue: true)) {
    return MockApiService();
  }
  return ApiService();
});

