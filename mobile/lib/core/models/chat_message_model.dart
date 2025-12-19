class ChatMessageModel {
  final String id;
  final String entryId;
  final String userId;
  final String role; // 'user' or 'assistant'
  final String content;
  final DateTime timestamp;
  final ChatContext? context;

  ChatMessageModel({
    required this.id,
    required this.entryId,
    required this.userId,
    required this.role,
    required this.content,
    required this.timestamp,
    this.context,
  });

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) {
    return ChatMessageModel(
      id: json['id'] as String,
      entryId: json['entryId'] as String,
      userId: json['userId'] as String,
      role: json['role'] as String,
      content: json['content'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      context: json['context'] != null
          ? ChatContext.fromJson(json['context'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'entryId': entryId,
      'userId': userId,
      'role': role,
      'content': content,
      'timestamp': timestamp.toIso8601String(),
      'context': context?.toJson(),
    };
  }
}

class ChatContext {
  final List<String>? highlightedSentences;
  final String? emotionFocus;

  ChatContext({
    this.highlightedSentences,
    this.emotionFocus,
  });

  factory ChatContext.fromJson(Map<String, dynamic> json) {
    return ChatContext(
      highlightedSentences: json['highlightedSentences'] != null
          ? List<String>.from(json['highlightedSentences'] as List)
          : null,
      emotionFocus: json['emotionFocus'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'highlightedSentences': highlightedSentences,
      'emotionFocus': emotionFocus,
    };
  }
}



