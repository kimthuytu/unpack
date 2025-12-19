import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/auth_service.dart';

// Auth state provider that tracks authentication status
final authStateProvider = StateNotifierProvider<AuthStateNotifier, bool>((ref) {
  final authService = ref.watch(authServiceProvider);
  return AuthStateNotifier(authService);
});

class AuthStateNotifier extends StateNotifier<bool> {
  final AuthService _authService;

  AuthStateNotifier(this._authService) : super(false) {
    // Check auth state periodically or on initialization
    _checkAuthState();
  }

  void _checkAuthState() {
    state = _authService.isAuthenticated();
  }

  void login() {
    state = true;
  }

  void logout() {
    _authService.logout();
    state = false;
  }

  void refresh() {
    _checkAuthState();
  }
}

