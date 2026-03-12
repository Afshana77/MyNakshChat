import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useChatStore } from '../../../store/chatStore';
 

const EMOJI_SET = ['🙏', '✨', '🌙', '❤️', '👍', '🔥'];

export default function EmojiReactionMenu({ visible, messageId, onDismiss }) {
  const { toggleReaction } = useChatStore();

  const handleEmojiSelect = (emoji) => {
    if (messageId) {
      toggleReaction(messageId, emoji);
    }
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <View style={styles.container}>
          <View style={styles.emojiBar}>
            {EMOJI_SET.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.emojiButton}
                onPress={() => handleEmojiSelect(emoji)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
  },
  emojiBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  emojiButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emoji: {
    fontSize: 28,
  },
});
