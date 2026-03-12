import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  BlurView,
  Dimensions,
} from 'react-native';

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
          <Text style={styles.thankYouText}>Thank You!</Text>
          <Text style={styles.subtitle}>
            How was your session?
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: SCREEN_WIDTH - 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  thankYouText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 48,
    color: '#ddd',
  },
  filledStar: {
    color: '#FFD700',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
