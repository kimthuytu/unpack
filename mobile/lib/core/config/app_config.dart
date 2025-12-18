class AppConfig {
  static String? apiBaseUrl;
  static String? environment;
  
  static Future<void> initialize() async {
    // Set environment (dev, staging, prod)
    environment = const String.fromEnvironment('ENV', defaultValue: 'dev');
    
    // Set API base URL based on environment
    switch (environment) {
      case 'prod':
        apiBaseUrl = 'https://api.unpack.app';
        break;
      case 'staging':
        apiBaseUrl = 'https://staging-api.unpack.app';
        break;
      default:
        // Include /dev prefix for serverless offline local development
        apiBaseUrl = 'http://localhost:3000/dev';
    }
  }
  
  static String getApiUrl(String endpoint) {
    return '$apiBaseUrl$endpoint';
  }
}


