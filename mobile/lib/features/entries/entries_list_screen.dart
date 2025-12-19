import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/services/entry_service.dart';
import '../../core/models/entry_model.dart';
import '../../core/utils/test_data.dart';
import 'entry_detail_screen.dart';
import '../camera/camera_screen.dart';

class EntriesListScreen extends ConsumerStatefulWidget {
  const EntriesListScreen({super.key});

  @override
  ConsumerState<EntriesListScreen> createState() => _EntriesListScreenState();
}

class _EntriesListScreenState extends ConsumerState<EntriesListScreen> {
  @override
  void initState() {
    super.initState();
    // Entries will load automatically via entriesProvider
  }

  @override
  Widget build(BuildContext context) {
    final entriesAsync = ref.watch(entriesProvider);

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(entriesProvider);
          // Wait a bit for the refresh to complete
          await Future.delayed(const Duration(milliseconds: 500));
        },
        child: entriesAsync.when(
        data: (entries) {
          if (entries.isEmpty) {
            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: SizedBox(
                height: MediaQuery.of(context).size.height * 0.7,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.book_outlined,
                        size: 64,
                        color: Colors.grey,
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'No entries yet',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Start by capturing your first journal entry',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }

          return ListView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            itemCount: entries.length,
            itemBuilder: (context, index) {
              final entry = entries[index];
              return ListTile(
                leading: entry.images.isNotEmpty
                    ? Image.network(
                        entry.images.first,
                        width: 50,
                        height: 50,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(Icons.image);
                        },
                      )
                    : const Icon(Icons.book),
                title: Text(
                  entry.summary ?? entry.ocrText ?? 'Untitled Entry',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                subtitle: Text(
                  _formatDate(entry.createdAt),
                  style: const TextStyle(fontSize: 12),
                ),
                trailing: entry.ocrConfidence != null
                    ? Chip(
                        label: Text(
                          '${(entry.ocrConfidence! * 100).toInt()}%',
                          style: const TextStyle(fontSize: 10),
                        ),
                        padding: EdgeInsets.zero,
                      )
                    : null,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => EntryDetailScreen(entry: entry),
                    ),
                  );
                },
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: SizedBox(
            height: MediaQuery.of(context).size.height * 0.7,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Text(
                      'Error loading entries: $error',
                      textAlign: TextAlign.center,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      ref.invalidate(entriesProvider);
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          ),
        ),
        ),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (kDebugMode)
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: FloatingActionButton(
                heroTag: 'test_entry',
                onPressed: () => _addTestEntry(context),
                backgroundColor: Colors.orange,
                child: const Icon(Icons.bug_report),
              ),
            ),
          FloatingActionButton(
            heroTag: 'camera',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const CameraScreen(),
                ),
              );
            },
            child: const Icon(Icons.camera_alt),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }

  void _addTestEntry(BuildContext context) {
    if (!kDebugMode) return;

    final testEntry = TestData.createTestEntry();
    
    // In mock mode, we can't directly add to the provider
    // But we can show a message that the test entry is already there
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Test entry is already loaded! Check the entries list. '
          'In mock mode, the test journal entry appears automatically.',
        ),
        duration: Duration(seconds: 3),
      ),
    );
  }
}



