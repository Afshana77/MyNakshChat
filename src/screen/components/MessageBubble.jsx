import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

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
import Entypo from '@react-native-vector-icons/entypo';

function ReplyInMessage({ messageId, messages, isUserMessage }) {
  const repliedMessage = messages.find(m => m.id === messageId);

  if (!repliedMessage) return null;

  const { isUserMessage: isReplyUserMessage, isAIMessage: isReplyAIMessage } =
    getMessageType(repliedMessage.sender, repliedMessage.type);

  return (
    <View style={styles.replyContainer}>
      <View />
      <View style={styles.replyContent}>
        <Text
          style={[styles.replyLabel, isUserMessage && styles.replyLabelUser]}
        >
          {isReplyUserMessage ? 'You' : 'Astrologer Vikram'}
        </Text>
        <Text
          style={[styles.replyText, isUserMessage && styles.replyTextUser]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {repliedMessage.text}
        </Text>
      </View>
    </View>
  );
}

export default function MessageBubble({
  message,
  messages,
  onLongPress,
  onReply,
}) {
  const translateX = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const { messageReactions } = useChatStore();
  const reaction = messageReactions[message.id];

  const { isSystemMessage, isUserMessage, isAIMessage } = getMessageType(
    message.sender,
    message.type,
  );

  // Extract pan gesture logic into reusable function
  const handleGestureEnd = event => {
    const shouldTriggerReply = event.translationX > ANIMATIONS.swipeThreshold;
    if (shouldTriggerReply) {
      runOnJS(onReply)();
    }
    translateX.value = withSpring(0);
    iconOpacity.value = withSpring(0);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX(10)
    .failOffsetY([-5, 5])
    .onUpdate(event => {
      if (event.translationX > 0) {
        translateX.value = event.translationX;
        // Fade in the icon as user swipes
        iconOpacity.value = interpolate(
          event.translationX,
          [0, 40],
          [0, 1],
          Extrapolate.CLAMP,
        );
      }
    })
    .onEnd(handleGestureEnd);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
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
            { position: 'relative' },
          ]}
        >
          {/* Reply Icon */}
          <Animated.View style={[styles.replyIconContainer, iconAnimatedStyle]}>
            <Entypo name="reply" color="#ffff" size={24} />
          </Animated.View>

          <Pressable
            onLongPress={onLongPress}
            delayLongPress={ANIMATIONS.longPressDelay}
            style={[
              styles.bubble,
              isUserMessage && styles.userBubble,
              isAIMessage && styles.aiBubble,
            ]}
          >
            {message.replyTo && (
              <ReplyInMessage
                messageId={message.replyTo}
                messages={messages}
                isUserMessage={isUserMessage}
              />
            )}
            <Text
              style={[styles.messageText, isUserMessage && styles.userText]}
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
    zIndex: 1,
    position: 'relative',
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
  replyIconContainer: {
    position: 'absolute',
    left: '-10%',
    top: '50%',
    zIndex: 0,
    marginTop: -20,
    borderWidth: 1,
    borderRadius: 20,
    padding: 4,
    borderColor: '#d3d3d3a2',
    backgroundColor: '#d3d3d3a2',
  },
  swipeMessageContainer: {
    position: 'absolute',
    left: '-60%',
    top: '50%',
    zIndex: 0,
    marginTop: -30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 8,
    maxWidth: 150,
  },
  swipeMessageText: {
    fontSize: SIZES.fontSm,
    color: COLORS.white,
    lineHeight: 16,
  },
  replyContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SIZES.xs,
    paddingBottom: SIZES.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },

  replyContent: {
    flex: 1,
  },
  replyLabel: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  replyLabelUser: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  replyText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
  },
  replyTextUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
