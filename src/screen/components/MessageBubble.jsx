import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
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
 
import FeedbackSection from './FeedbackSection';
import ReactionBubbles from './ReactionBubbles';
import { useChatStore } from '../../../store/chatStore';

export default function MessageBubble({ message, onLongPress, onReply }) {
  const translateX = useSharedValue(0);
  const { messageReactions } = useChatStore();
  const reactions = messageReactions[message.id] || [];

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX > 80) {
        // Trigger reply
        runOnJS(onReply)();
        translateX.value = withSpring(0);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const isSystemMessage = message.type === 'event';
  const isUserMessage = message.sender === 'user';
  const isAIMessage = message.sender === 'ai_astrologer';
  const isHumanMessage = message.sender === 'human_astrologer';

  if (isSystemMessage) {
    return (
      <View style={styles.systemMessageContainer}>
        <Text style={styles.systemMessageText}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={styles.messageContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            animatedStyle,
            isUserMessage && styles.userMessageWrapper,
          ]}
        >
          <Pressable
            onLongPress={onLongPress}
            delayLongPress={400}
            style={[
              styles.bubble,
              isUserMessage && styles.userBubble,
              isAIMessage && styles.aiBubble,
              isHumanMessage && styles.humanBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isUserMessage && styles.userText,
              ]}
            >
              {message.text}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </Pressable>

          {/* Emoji Reactions */}
          {reactions.length > 0 && (
            <ReactionBubbles messageId={message.id} reactions={reactions} />
          )}

          {/* AI Feedback Section */}
          {isAIMessage && message.hasFeedback !== undefined && (
            <FeedbackSection messageId={message.id} />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  systemMessageText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  userBubble: {
    backgroundColor: '#FF8C42',
  },
  aiBubble: {
    backgroundColor: '#E8F5E9',
    marginLeft: 0,
  },
  humanBubble: {
    backgroundColor: '#FFF3E0',
    marginLeft: 0,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
});
