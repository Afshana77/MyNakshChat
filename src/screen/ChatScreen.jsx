import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MessageBubble from './components/MessageBubble';
import ReplyPreview from './components/ReplyPreview';
import RatingOverlay from './components/RatingOverlay';
import EmojiReactionMenu from './components/EmojiReactionMenu';
import styles from './ChatScreen.styles';
import { useChatStore } from '../../store/chatStore';
import { useMessageModal } from '../hooks/useModal';
import {
  createUserMessage,
  isValidMessage,
  scrollToEnd,
  formatRatingMessage,
} from '../utils/helpers';
import {
  COLORS,
  SIZES,
  ALERT_MESSAGES,
  TEXT_PLACEHOLDER,
} from '../constants/theme';
import Entypo from '@react-native-vector-icons/entypo';
import Animated from 'react-native-reanimated';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const {
    messages,
    replyingTo,
    setReplyingTo,
    clearReply,
    addMessage,
    rateSession,
    resetSession,
  } = useChatStore();

  const [messageInput, setMessageInput] = useState('');
  const [showRating, setShowRating] = useState(false);
  const emojiModal = useMessageModal();
  const flatListRef = useRef(null);

  const handleSendMessage = useCallback(() => {
    if (!isValidMessage(messageInput)) return;

    const newMessage = createUserMessage(
      messageInput,
      messages.length,
      replyingTo,
    );
    addMessage(newMessage);
    setMessageInput('');
    clearReply();
    scrollToEnd(flatListRef);
  }, [messageInput, replyingTo, addMessage, clearReply, messages.length]);

  const handleEndChat = useCallback(() => {
    Alert.alert(
      ALERT_MESSAGES.END_CHAT_TITLE,
      ALERT_MESSAGES.END_CHAT_MESSAGE,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Chat',
          style: 'destructive',
          onPress: () => setShowRating(true),
        },
      ],
    );
  }, []);

  const handleRatingSubmit = useCallback(
    rating => {
      rateSession(rating);
      setShowRating(false);
      Alert.alert(
        ALERT_MESSAGES.RATING_THANK_YOU,
        formatRatingMessage(rating),
        [
          {
            text: 'OK',
            onPress: resetSession,
          },
        ],
      );
    },
    [rateSession, resetSession],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Astrologer Vikram</Text>
        <TouchableOpacity style={styles.endChatButton} onPress={handleEndChat}>
          <Text style={styles.endChatText}>End Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            onLongPress={() => emojiModal.showForMessage(item.id)}
            onReply={() => setReplyingTo(item.id)}
          />
        )}
        contentContainerStyle={styles.messageList}
        scrollEnabled
        keyboardShouldPersistTaps="handled"
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
      <View style={[styles.inputContainer, { paddingBottom: 20 }]}>
        <TextInput
          style={styles.input}
          placeholder={TEXT_PLACEHOLDER}
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
          <Entypo name="paper-plane" color="#ffff" size={20} />
        </TouchableOpacity>
      </View>

      {/* Emoji Reaction Menu */}
      <EmojiReactionMenu
        visible={emojiModal.visible}
        messageId={emojiModal.selectedMessageId}
        onDismiss={emojiModal.hideAndClear}
      />

      {/* Rating Overlay */}
      {showRating && (
        <RatingOverlay
          visible={showRating}
          onRatingSelect={handleRatingSubmit}
        />
      )}
    </KeyboardAvoidingView>
  );
}
