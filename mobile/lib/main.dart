import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'core/config/app_config.dart';
import 'core/providers/api_provider.dart';
import 'core/services/auth_service.dart';
import 'core/widgets/auth_guard.dart';
import 'features/entries/main_navigation.dart';
import 'features/auth/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive for local storage
  await Hive.initFlutter();
  
  // Initialize app configuration
  await AppConfig.initialize();
  
  // Open Hive boxes BEFORE creating providers to ensure they're ready
  // This prevents race condition where providers access boxes before they're open
  await Hive.openBox('auth_tokens');
  await Hive.openBox('user_data');
  
  runApp(
    ProviderScope(
      child: const UnpackApp(),
      overrides: [
        // Initialize auth service (boxes are already open, initialize() will handle mock mode setup)
        authServiceProvider.overrideWith((ref) {
          final authService = AuthService(ref.watch(apiServiceProvider));
          // Initialize for mock mode setup (boxes are already open)
          authService.initialize();
          return authService;
        }),
      ],
    ),
  );
}

class UnpackApp extends StatelessWidget {
  const UnpackApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Unpack',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => const AuthGuard(child: MainNavigation()),
        '/home': (context) => const AuthGuard(child: MainNavigation()),
        '/login': (context) => const LoginScreen(),
      },
    );
  }
}

