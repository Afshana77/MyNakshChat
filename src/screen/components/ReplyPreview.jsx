import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function ReplyPreview({ messageId, messages, onCancel }) {
  const repliedMessage = messages.find((m) => m.id === messageId);

  if (!repliedMessage) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Replying to:</Text>
        <Text style={styles.text} numberOfLines={1}>
          {repliedMessage.text}
        </Text>
      </View>
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderLeftWidth: 3,
    borderLeftColor: '#FF8C42',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 18,
    color: '#999',
  },
});
