import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useChatStore } from '../../../store/chatStore';
 

export default function ReactionBubbles({ messageId, emoji }) {
  const { toggleReaction } = useChatStore();

  return (
    <TouchableOpacity
      style={styles.reactionBubble}
      onPress={() => toggleReaction(messageId, emoji)}
    >
      <Text style={styles.emoji}>{emoji}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  reactionBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginLeft: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  emoji: {
    fontSize: 16,
  },
});
