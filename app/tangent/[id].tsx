import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase, Tangent, Message, Entry } from '@/lib/supabase';
import { chat } from '@/lib/openai';
import { MOCK_MODE, MOCK_TANGENTS, MOCK_ENTRY, MOCK_MESSAGES } from '@/lib/config';

export default function TangentChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tangent, setTangent] = useState<Tangent | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchTangentData();
  }, [id]);

  const fetchTangentData = async () => {
    if (!id) return;

    if (MOCK_MODE) {
      // Find mock tangent
      const mockTangent = MOCK_TANGENTS.find(t => t.id === id);
      if (mockTangent) {
        setTangent(mockTangent);
        setEntry(MOCK_ENTRY as Entry);
        
        // Check if we have existing mock messages for this tangent
        const tangentMessages = MOCK_MESSAGES.filter(m => m.tangent_id === id);
        if (tangentMessages.length > 0) {
          setMessages(tangentMessages as Message[]);
        } else {
          // Generate initial AI message
          generateInitialMessage(mockTangent, MOCK_ENTRY as Entry);
        }
      }
      setLoading(false);
      return;
    }

    // Real data fetch
    const { data: tangentData } = await supabase
      .from('tangents')
      .select('*')
      .eq('id', id)
      .single();

    if (tangentData) {
      setTangent(tangentData);

      if (!tangentData.is_interacted) {
        await supabase
          .from('tangents')
          .update({ is_interacted: true })
          .eq('id', id);
      }

      const { data: entryData } = await supabase
        .from('entries')
        .select('*')
        .eq('id', tangentData.entry_id)
        .single();

      if (entryData) {
        setEntry(entryData);
      }

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('tangent_id', id)
        .order('created_at', { ascending: true });

      if (messagesData && messagesData.length > 0) {
        setMessages(messagesData);
      } else {
        generateInitialMessage(tangentData, entryData);
      }
    }

    setLoading(false);
  };

  const generateInitialMessage = async (
    tangentData: Tangent,
    entryData: Entry | null
  ) => {
    try {
      const context = `
Tangent: ${tangentData.name}
Emotion: ${tangentData.emotion}
From journal entry: ${entryData?.extracted_text?.substring(0, 500) || 'Not available'}
Overview: ${entryData?.overview || 'Not available'}
`;

      const response = await chat(context, [
        {
          role: 'user',
          content: `I just scanned a journal entry and this tangent "${tangentData.name}" was identified with the emotion "${tangentData.emotion}". Start our conversation by validating what I wrote and asking a thoughtful opening question.`,
        },
      ]);

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        tangent_id: tangentData.id,
        role: 'ai',
        content: response,
        created_at: new Date().toISOString(),
      };

      if (!MOCK_MODE) {
        const { data } = await supabase
          .from('messages')
          .insert(newMessage)
          .select()
          .single();

        if (data) {
          setMessages([data]);
          return;
        }
      }
      
      setMessages([newMessage]);
    } catch (error) {
      console.error('Initial message error:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !tangent || sending) return;

    const userMessage = inputText.trim();
    setInputText('');
    setSending(true);

    const tempUserMessage: Message = {
      id: `temp-user-${Date.now()}`,
      tangent_id: tangent.id,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      // Generate AI response
      const context = `
Tangent: ${tangent.name}
Emotion: ${tangent.emotion}
From journal: ${entry?.extracted_text?.substring(0, 500) || ''}
`;

      const chatHistory = messages.map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      })) as { role: 'user' | 'assistant'; content: string }[];

      chatHistory.push({ role: 'user', content: userMessage });

      const response = await chat(context, chatHistory);

      const aiMessage: Message = {
        id: `msg-ai-${Date.now()}`,
        tangent_id: tangent.id,
        role: 'ai',
        content: response,
        created_at: new Date().toISOString(),
      };

      if (!MOCK_MODE) {
        // Save to database
        await supabase.from('messages').insert({
          tangent_id: tangent.id,
          role: 'user',
          content: userMessage,
        });

        const { data: savedAiMessage } = await supabase
          .from('messages')
          .insert({
            tangent_id: tangent.id,
            role: 'ai',
            content: response,
          })
          .select()
          .single();

        if (savedAiMessage) {
          setMessages((prev) => {
            const filtered = prev.filter((m) => !m.id.startsWith('temp-'));
            return [...filtered, tempUserMessage, savedAiMessage];
          });
          return;
        }
      }

      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.id.startsWith('temp-'));
        return [...filtered, tempUserMessage, aiMessage];
      });
    } catch (error) {
      console.error('Send message error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Tangent',
      'Are you sure you want to delete this tangent and all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!MOCK_MODE) {
              await supabase.from('messages').delete().eq('tangent_id', id);
              await supabase.from('tangents').delete().eq('id', id);
            }
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const truncateTitle = (title: string, maxWords: number = 6) => {
    const words = title.trim().split(/\s+/);
    if (words.length <= maxWords) return title;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#AA6758" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.tangentName} numberOfLines={1} ellipsizeMode="tail">
              {tangent && `${formatShortDate(tangent.created_at)} ${truncateTitle(tangent.name)}`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowInfo(true)}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#AA6758" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.role === 'user'
                  ? styles.userMessage
                  : styles.aiMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.role === 'ai' && styles.aiMessageText,
                ]}
              >
                {message.content}
              </Text>
            </View>
          ))}
          {sending && (
            <View style={[styles.messageBubble, styles.aiMessage]}>
              <Text style={[styles.messageText, styles.aiMessageText]}>
                ...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Write your thoughts..."
              placeholderTextColor="#999"
              multiline
              maxLength={2000}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || sending) && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || sending}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={inputText.trim() && !sending ? '#FFF' : '#999'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Modal */}
        {showInfo && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setShowInfo(false)}
          >
            <View style={styles.infoSheet}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>Tangent Info</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Created</Text>
                <Text style={styles.infoValue}>
                  {tangent && formatDate(tangent.created_at)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Emotion</Text>
                <Text style={styles.infoValue}>{tangent?.emotion}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Messages</Text>
                <Text style={styles.infoValue}>{messages.length}</Text>
              </View>
              <TouchableOpacity
                style={styles.viewExtractedButton}
                onPress={() => {
                  setShowInfo(false);
                  Alert.alert('Extracted Text', entry?.extracted_text || 'No text available');
                }}
              >
                <Ionicons name="document-text-outline" size={20} color="#666" />
                <Text style={styles.viewExtractedText}>View extracted text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setShowInfo(false);
                  handleDelete();
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#C75D5D" />
                <Text style={styles.deleteText}>Delete tangent</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF6',
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  tangentName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#AA6758',
    maxWidth: 260,
  },
  tangentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 24,
    paddingBottom: 16,
  },
  messageBubble: {
    maxWidth: '100%',
    marginBottom: 24,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
  },
  messageText: {
    fontSize: 16,
    color: '#3D3D3D',
    lineHeight: 24,
  },
  aiMessageText: {
    color: '#AA6758',
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0EDE8',
    paddingBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    
    fontSize: 16,
    color: '#1A1A1A',
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C75D5D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F0EDE8',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  infoSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  infoHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    
    fontSize: 18,
    color: '#1A1A1A',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
  },
  infoLabel: {
    
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    
    fontSize: 16,
    color: '#1A1A1A',
  },
  viewExtractedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE8',
  },
  viewExtractedText: {
    
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  deleteText: {
    
    fontSize: 16,
    color: '#C75D5D',
  },
});
