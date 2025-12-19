import '../models/entry_model.dart';

/// Test data helper for development and testing
class TestData {
  /// Sample journal entry text extracted from the test journal entry
  static const String sampleJournalText = '''
11:3

Life is so fucking weird.
Its so simple and yet so damn complicated.

What is the purpose of life?

Are we suppose to just work and then die?

How do we manage to maintain a thirst to live?

Is that why people obsess over work? Over love?

Because when you don't have either, all you have left is yourself. Shouldn't that be enough? Is it enough?

Is that why people choose to start a family? Or a new business? Or to start a new love? Or more somewhere new to start over?

What keeps us moving?

Are we always suppose to look for the next big thing?

When is it okay to just settle and be happy with what you have?

Do you need to have love? So that you can share your life with another being?

Do you need to work to feel like you're useful?

Is there a reason for living?

Is that reason more than ourselves?

Is the purpose of living more than ourselves?

Is the purpose of loving and working more than ourselves?

Maybe our purpose in life is to be useful.

To invest in other people and leave our mark before we fade out of this world.
''';

  /// Create a test entry with the sample journal text
  static EntryModel createTestEntry({
    String? id,
    DateTime? createdAt,
    List<String>? images,
  }) {
    return EntryModel(
      id: id ?? 'test-entry-${DateTime.now().millisecondsSinceEpoch}',
      userId: 'test-user',
      createdAt: createdAt ?? DateTime.now(),
      images: images ?? ['https://via.placeholder.com/400x600?text=Journal+Entry'],
      ocrText: sampleJournalText,
      ocrConfidence: 0.85,
      sentiment: Sentiment(
        label: 'contemplative',
        score: 0.7,
      ),
      emotions: ['reflective', 'philosophical', 'curious', 'introspective'],
      summary: 'A deep philosophical reflection on life\'s purpose, questioning the meaning of work, love, and existence. The writer explores whether purpose comes from within or from external achievements and relationships.',
      keySentences: [
        'What is the purpose of life?',
        'Maybe our purpose in life is to be useful.',
        'To invest in other people and leave our mark before we fade out of this world.',
        'When is it okay to just settle and be happy with what you have?',
      ],
    );
  }

  /// Create multiple test entries for list testing
  static List<EntryModel> createTestEntries(int count) {
    return List.generate(count, (index) {
      return createTestEntry(
        id: 'test-entry-$index',
        createdAt: DateTime.now().subtract(Duration(days: index)),
      );
    });
  }
}

