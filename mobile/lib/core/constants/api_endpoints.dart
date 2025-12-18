class ApiEndpoints {
  // Entries
  static const String entries = '/api/entries';
  static String entry(String id) => '/api/entries/$id';
  static String entryOcr(String id) => '/api/entries/$id/ocr';
  
  // Chat
  static String entryChat(String id) => '/api/entries/$id/chat';
  
  // Recommendations
  static const String recommendations = '/api/recommendations';
  
  // Analytics
  static const String analytics = '/api/analytics';
  
  // Auth
  static const String signUp = '/api/auth/signup';
  static const String login = '/api/auth/login';
  static const String logout = '/api/auth/logout';
  static const String refreshToken = '/api/auth/refresh';
}


