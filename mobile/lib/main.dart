import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'core/config/app_config.dart';
import 'core/services/auth_service.dart';
import 'core/services/api_service.dart';
import 'features/entries/entries_list_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive for local storage
  await Hive.initFlutter();
  
  // Initialize app configuration
  await AppConfig.initialize();
  
  runApp(
    ProviderScope(
      child: const UnpackApp(),
      overrides: [
        // Initialize auth service
        authServiceProvider.overrideWith((ref) {
          final authService = AuthService(ref.watch(apiServiceProvider));
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
      home: const EntriesListScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

