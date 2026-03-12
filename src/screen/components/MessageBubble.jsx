import React from 'react';
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
import { formatTime, getMessageType } from '../../utils/helpers';
import {
  COLORS,
  SIZES,
  ANIMATIONS,
  SENDER_TYPES,
  MESSAGE_TYPES,
} from '../../constants/theme';

export default function MessageBubble({ message, onLongPress, onReply }) {
  const translateX = useSharedValue(0);
  const { messageReactions } = useChatStore();
  const reaction = messageReactions[message.id];

  const {
    isSystemMessage,
    isUserMessage,
    isAIMessage,
  } = getMessageType(message.sender, message.type);

  // Extract pan gesture logic into reusable function
  const handleGestureEnd = (event) => {
    const shouldTriggerReply = event.translationX > ANIMATIONS.swipeThreshold;
    if (shouldTriggerReply) {
      runOnJS(onReply)();
    }
    translateX.value = withSpring(0, ANIMATIONS.springConfig);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd(handleGestureEnd);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

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
            delayLongPress={ANIMATIONS.longPressDelay}
            style={[
              styles.bubble,
              isUserMessage && styles.userBubble,
              isAIMessage && styles.aiBubble,
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
              {formatTime(message.timestamp)}
            </Text>
          </Pressable>

          {/* Emoji Reactions */}
          {reaction && (
            <ReactionBubbles messageId={message.id} emoji={reaction} />
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
    marginVertical: SIZES.xs,
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: SIZES.lg,
  },
  systemMessageText: {
    fontSize: SIZES.fontXs,
    color: COLORS.systemText,
    fontStyle: 'italic',
  },
  bubble: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusMd,
    marginHorizontal: SIZES.md,
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
  },
  aiBubble: {
    backgroundColor: COLORS.aiBubble,
    marginLeft: 0,
  },
  messageText: {
    fontSize: SIZES.fontLg,
    color: COLORS.text,
    lineHeight: 20,
  },
  userText: {
    color: COLORS.white,
  },
  timestamp: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    marginTop: SIZES.xs,
    textAlign: 'right',
  },
});
