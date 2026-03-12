import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useChatStore } from '../../../store/chatStore';
 

export default function ReactionBubbles({ messageId, reactions }) {
  const { toggleReaction } = useChatStore();

  return (
    <View style={styles.container}>
      {reactions.map((emoji, index) => (
        <TouchableOpacity
          key={index}
          style={styles.reactionBubble}
          onPress={() => toggleReaction(messageId, emoji)}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 8,
    marginTop: 4,
    gap: 4,
  },
  reactionBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emoji: {
    fontSize: 16,
  },
});
