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
  interpolate,
  Extrapolate,
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
import Entypo from '@react-native-vector-icons/entypo';

export default function MessageBubble({ message, onLongPress, onReply }) {
  const translateX = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
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
    translateX.value = withSpring(0);
    iconOpacity.value = withSpring(0);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX(10)
    .failOffsetY([-5, 5])
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = event.translationX;
        // Fade in the icon as user swipes
        iconOpacity.value = interpolate(
          event.translationX,
          [0, 40],
          [0, 1],
          Extrapolate.CLAMP
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
    left: "-10%",
    top: '50%',
    zIndex: 0,
    marginTop: -20,
    borderWidth: 1,
    borderRadius: 20,
    padding: 4,
    borderColor: "#d3d3d3a2",
    backgroundColor: "#d3d3d3a2",
   
  },
});
