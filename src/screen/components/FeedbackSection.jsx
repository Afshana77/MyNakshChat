import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useChatStore } from '../../../store/chatStore';
 

const FEEDBACK_CHIPS = ['Inaccurate', 'Too Vague', 'Too Long'];

export default function FeedbackSection({ messageId }) {
  const {
    selectedFeedback,
    expandedFeedback,
    setMessageFeedback,
    toggleFeedbackExpanded,
    addFeedbackChip,
    removeFeedbackChip,
    selectedFeedbackChips,
  } = useChatStore();

  const feedback = selectedFeedback[messageId];
  const isExpanded = expandedFeedback[messageId];
  const chips = selectedFeedbackChips[messageId] || [];

  const handleLike = () => {
    setMessageFeedback(messageId, 'liked');
  };

  const handleDislike = () => {
    setMessageFeedback(messageId, 'disliked');
  };

  const handleChipPress = (chip) => {
    if (chips.includes(chip)) {
      removeFeedbackChip(messageId, chip);
    } else {
      addFeedbackChip(messageId, chip);
    }
  };

  return (
    <View style={styles.container}>
      {/* Like / Dislike Buttons */}
      <View style={styles.feedbackButtons}>
        <TouchableOpacity
          style={[
            styles.button,
            feedback === 'liked' && styles.activeButton,
          ]}
          onPress={handleLike}
        >
          <Text style={styles.buttonText}>👍 Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            feedback === 'disliked' && styles.dislikedButton,
          ]}
          onPress={handleDislike}
        >
          <Text style={styles.buttonText}>👎 Dislike</Text>
        </TouchableOpacity>
      </View>

      {/* Expandable Feedback Chips */}
      {feedback === 'disliked' && (
        <View style={styles.chipsContainer}>
          {FEEDBACK_CHIPS.map((chip) => (
            <TouchableOpacity
              key={chip}
              style={[
                styles.chip,
                chips.includes(chip) && styles.selectedChip,
              ]}
              onPress={() => handleChipPress(chip)}
            >
              <Text
                style={[
                  styles.chipText,
                  chips.includes(chip) && styles.selectedChipText,
                ]}
              >
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginTop: 8,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  dislikedButton: {
    backgroundColor: '#FFEBEE',
    borderColor: '#f44336',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedChip: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
  },
  chipText: {
    fontSize: 12,
    color: '#666',
  },
  selectedChipText: {
    color: '#fff',
    fontWeight: '600',
  },
});
