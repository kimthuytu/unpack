import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../constants/api_endpoints.dart';
import '../providers/api_provider.dart';
import 'api_service_interface.dart';
import 'mock_api_service.dart' show MockApiService;

class AuthService {
  final ApiServiceInterface _apiService;
  static const String _tokenBoxName = 'auth_tokens';
  static const String _userBoxName = 'user_data';

  AuthService(this._apiService);

  Future<void> initialize() async {
    // Initialize Hive boxes for auth (may already be open from main())
    // Hive.openBox() is safe to call multiple times - it returns existing box if already open
    try {
      await Hive.openBox(_tokenBoxName);
    } catch (e) {
      // Box might already be open, ignore error
    }
    
    try {
      await Hive.openBox(_userBoxName);
    } catch (e) {
      // Box might already be open, ignore error
    }
    
    // In mock mode, auto-login for testing
    if (_apiService is MockApiService) {
      await _saveTokens({'access_token': 'mock-token'});
      await _saveUserData({
        'id': 'test-user',
        'email': 'test@example.com',
        'name': 'Test User',
      });
      
      return;
    }
    
    // Load saved token
    final tokenBox = Hive.box(_tokenBoxName);
    final token = tokenBox.get('access_token') as String?;
    if (token != null) {
      _apiService.setAuthToken(token);
    }
  }

  Future<Map<String, dynamic>> signUp({
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      final response = await _apiService.post(
        ApiEndpoints.signUp,
        data: {
          'email': email,
          'password': password,
          'name': name,
        },
      );

      final data = response.data as Map<String, dynamic>;
      await _saveTokens(data['tokens'] as Map<String, dynamic>);
      await _saveUserData(data['user'] as Map<String, dynamic>);

      return data;
    } catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiService.post(
        ApiEndpoints.login,
        data: {
          'email': email,
          'password': password,
        },
      );

      final data = response.data as Map<String, dynamic>;
      await _saveTokens(data['tokens'] as Map<String, dynamic>);
      await _saveUserData(data['user'] as Map<String, dynamic>);

      return data;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    try {
      await _apiService.post(ApiEndpoints.logout);
    } catch (e) {
      // Continue with logout even if API call fails
    } finally {
      await _clearAuthData();
    }
  }

  Future<void> refreshToken() async {
    try {
      final tokenBox = Hive.box(_tokenBoxName);
      final refreshToken = tokenBox.get('refresh_token') as String?;
      
      if (refreshToken == null) {
        throw Exception('No refresh token available');
      }

      final response = await _apiService.post(
        ApiEndpoints.refreshToken,
        data: {'refresh_token': refreshToken},
      );

      final tokens = response.data as Map<String, dynamic>;
      await _saveTokens(tokens);
    } catch (e) {
      await _clearAuthData();
      rethrow;
    }
  }

  bool isAuthenticated() {
    final tokenBox = Hive.box(_tokenBoxName);
    return tokenBox.get('access_token') != null;
  }

  String? getUserId() {
    final userBox = Hive.box(_userBoxName);
    return userBox.get('id') as String?;
  }

  Future<void> _saveTokens(Map<String, dynamic> tokens) async {
    final tokenBox = Hive.box(_tokenBoxName);
    final accessToken = tokens['access_token'] as String;
    final refreshToken = tokens['refresh_token'] as String?;
    
    await tokenBox.put('access_token', accessToken);
    if (refreshToken != null) {
      await tokenBox.put('refresh_token', refreshToken);
    }
    
    _apiService.setAuthToken(accessToken);
  }

  Future<void> _saveUserData(Map<String, dynamic> user) async {
    final userBox = Hive.box(_userBoxName);
    await userBox.putAll(user);
  }

  Future<void> _clearAuthData() async {
    final tokenBox = Hive.box(_tokenBoxName);
    final userBox = Hive.box(_userBoxName);
    
    await tokenBox.clear();
    await userBox.clear();
    
    _apiService.setAuthToken(null);
  }
}

final authServiceProvider = Provider<AuthService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return AuthService(apiService);
});



