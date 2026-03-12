import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useChatStore } from '../../../store/chatStore';
import { COLORS, SIZES, EMOJI_SET } from '../../constants/theme';

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
    backgroundColor: COLORS.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
  },
  emojiBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    justifyContent: 'space-around',
    alignItems: 'center',
   
    
    
    
  },
  emojiButton: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusSm,
  },
  emoji: {
    fontSize: SIZES.fontXxl,
  },
});
