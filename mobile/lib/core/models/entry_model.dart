class EntryModel {
  final String id;
  final String userId;
  final DateTime createdAt;
  final List<String> images; // S3 URLs
  final String? ocrText;
  final double? ocrConfidence;
  final Sentiment? sentiment;
  final List<String> emotions;
  final String? summary;
  final List<String> keySentences;

  EntryModel({
    required this.id,
    required this.userId,
    required this.createdAt,
    required this.images,
    this.ocrText,
    this.ocrConfidence,
    this.sentiment,
    this.emotions = const [],
    this.summary,
    this.keySentences = const [],
  });

  factory EntryModel.fromJson(Map<String, dynamic> json) {
    return EntryModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      images: List<String>.from(json['images'] as List),
      ocrText: json['ocrText'] as String?,
      ocrConfidence: (json['ocrConfidence'] as num?)?.toDouble(),
      sentiment: json['sentiment'] != null
          ? Sentiment.fromJson(json['sentiment'] as Map<String, dynamic>)
          : null,
      emotions: List<String>.from(json['emotions'] as List? ?? []),
      summary: json['summary'] as String?,
      keySentences: List<String>.from(json['keySentences'] as List? ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'createdAt': createdAt.toIso8601String(),
      'images': images,
      'ocrText': ocrText,
      'ocrConfidence': ocrConfidence,
      'sentiment': sentiment?.toJson(),
      'emotions': emotions,
      'summary': summary,
      'keySentences': keySentences,
    };
  }
}

class Sentiment {
  final String label;
  final double score;

  Sentiment({
    required this.label,
    required this.score,
  });

  factory Sentiment.fromJson(Map<String, dynamic> json) {
    return Sentiment(
      label: json['label'] as String,
      score: (json['score'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'score': score,
    };
  }
}


