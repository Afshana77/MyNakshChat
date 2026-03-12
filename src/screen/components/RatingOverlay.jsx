import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES, ALERT_MESSAGES } from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function RatingOverlay({ visible, onRatingSelect }) {
  const [selectedRating, setSelectedRating] = useState(0);

  const handleRatingSubmit = () => {
    if (selectedRating > 0) {
      onRatingSelect(selectedRating);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        {/* Backdrop Blur Effect (simulated with semi-transparent view) */}
        <View style={styles.blurBackdrop} />

        {/* Rating Card */}
        <View style={styles.ratingCard}>
          <Text style={styles.thankYouText}>
            {ALERT_MESSAGES.RATING_THANK_YOU}
          </Text>
          <Text style={styles.subtitle}>
            {ALERT_MESSAGES.RATING_QUESTION}
          </Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setSelectedRating(star)}
                style={styles.starButton}
              >
                <Text
                  style={[
                    styles.star,
                    selectedRating >= star && styles.filledStar,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rating Text Display */}
          {selectedRating > 0 && (
            <Text style={styles.ratingText}>
              You rated: {selectedRating} star{selectedRating > 1 ? 's' : ''}
            </Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedRating === 0 && styles.disabledButton,
            ]}
            onPress={handleRatingSubmit}
            disabled={selectedRating === 0}
          >
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.backdropDark,
  },
  ratingCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.xl,
    width: SCREEN_WIDTH - 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  thankYouText: {
    fontSize: SIZES.fontXxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.fontLg,
    color: COLORS.textLight,
    marginBottom: SIZES.xl,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.md,
  },
  starButton: {
    padding: SIZES.sm,
  },
  star: {
    fontSize: 48,
    color: '#ddd',
  },
  filledStar: {
    color: '#FFD700',
  },
  ratingText: {
    fontSize: SIZES.fontMd,
    color: COLORS.textLight,
    marginBottom: SIZES.lg,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusSm,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLg,
    fontWeight: '600',
  },
});
