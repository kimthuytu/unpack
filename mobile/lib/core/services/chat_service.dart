import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/api_endpoints.dart';
import '../models/chat_message_model.dart';
import 'api_service.dart';

class ChatService {
  final ApiService _apiService;

  ChatService(this._apiService);

  Future<List<ChatMessageModel>> getChatHistory(String entryId) async {
    try {
      final response = await _apiService.get(ApiEndpoints.entryChat(entryId));
      final data = response.data as Map<String, dynamic>;
      final messagesList = data['messages'] as List;

      return messagesList
          .map((json) =>
              ChatMessageModel.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw Exception('Failed to load chat history: $e');
    }
  }

  Future<ChatMessageModel> sendMessage(
    String entryId,
    String content,
  ) async {
    try {
      final response = await _apiService.post(
        ApiEndpoints.entryChat(entryId),
        data: {
          'message': content,
        },
      );

      return ChatMessageModel.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      throw Exception('Failed to send message: $e');
    }
  }
}

final chatServiceProvider = Provider<ChatService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ChatService(apiService);
});

final chatHistoryProvider =
    FutureProvider.family<List<ChatMessageModel>, String>((ref, entryId) async {
  final chatService = ref.watch(chatServiceProvider);
  return await chatService.getChatHistory(entryId);
});


