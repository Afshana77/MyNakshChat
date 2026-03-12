import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
 
import MessageBubble from './components/MessageBubble';
import ReplyPreview from './components/ReplyPreview';
import RatingOverlay from './components/RatingOverlay';
import EmojiReactionMenu from './components/EmojiReactionMenu';
import styles from './ChatScreen.styles';
import { useChatStore } from '../../store/chatStore';
 
 

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const {
    messages,
    replyingTo,
    setReplyingTo,
    clearReply,
    addMessage,
    rateSession,
    sessionRated,
    resetSession,
  } = useChatStore();

  const [messageInput, setMessageInput] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [selectedEmojiMessage, setSelectedEmojiMessage] = useState(null);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const flatListRef = useRef(null);

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: String(messages.length + 1),
      sender: 'user',
      text: messageInput,
      timestamp: Date.now(),
      type: 'text',
      ...(replyingTo && { replyTo: replyingTo }),
    };

    addMessage(newMessage);
    setMessageInput('');
    clearReply();

    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messageInput, replyingTo, addMessage, clearReply, messages.length]);

  const handleEndChat = useCallback(() => {
    Alert.alert(
      'End Chat Session',
      'Are you sure you want to end this session? You will be asked to rate.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Chat',
          style: 'destructive',
          onPress: () => setShowRating(true),
        },
      ]
    );
  }, []);

  const handleRatingSubmit = useCallback((rating) => {
    rateSession(rating);
    setShowRating(false);
    Alert.alert(
      'Thank You!',
      `Your rating of ${rating} star(s) has been recorded. We appreciate your feedback!`,
      [
        {
          text: 'OK',
          onPress: () => {
            resetSession();
          },
        },
      ]
    );
  }, [rateSession, resetSession]);

  const handleLongPressMessage = (messageId) => {
    setSelectedEmojiMessage(messageId);
    setShowEmojiMenu(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Astrologer Vikram</Text>
        <TouchableOpacity
          style={styles.endChatButton}
          onPress={handleEndChat}
        >
          <Text style={styles.endChatText}>End Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            onLongPress={() => handleLongPressMessage(item.id)}
            onReply={() => setReplyingTo(item.id)}
          />
        )}
        contentContainerStyle={styles.messageList}
        scrollEnabled
      />

      {/* Reply Preview */}
      {replyingTo && (
        <ReplyPreview
          messageId={replyingTo}
          messages={messages}
          onCancel={clearReply}
        />
      )}

      {/* Message Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          value={messageInput}
          onChangeText={setMessageInput}
          multiline
          maxHeight={100}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!messageInput.trim()}
        >
          <Text style={styles.sendButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Emoji Reaction Menu */}
      <EmojiReactionMenu
        visible={showEmojiMenu}
        messageId={selectedEmojiMessage}
        onDismiss={() => setShowEmojiMenu(false)}
      />

      {/* Rating Overlay */}
      {showRating && (
        <RatingOverlay
          visible={showRating}
          onRatingSelect={handleRatingSubmit}
        />
      )}
    </View>
  );
}
