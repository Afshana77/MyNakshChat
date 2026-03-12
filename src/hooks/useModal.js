/**
 * Custom hook for managing modal state
 * Eliminates repeated modal state management logic
 */

import { useState, useCallback } from 'react';

export const useModal = (initialVisible = false) => {
  const [visible, setVisible] = useState(initialVisible);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);
  const toggle = useCallback(() => setVisible((prev) => !prev), []);

  return {
    visible,
    show,
    hide,
    toggle,
  };
};

/**
 * Custom hook for managing message-related modals
 * Extends useModal with item selection
 */
export const useMessageModal = (initialVisible = false) => {
  const modal = useModal(initialVisible);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const showForMessage = useCallback((messageId) => {
    setSelectedMessageId(messageId);
    modal.show();
  }, [modal]);

  const hideAndClear = useCallback(() => {
    modal.hide();
    setSelectedMessageId(null);
  }, [modal]);

  return {
    ...modal,
    selectedMessageId,
    showForMessage,
    hideAndClear,
  };
};

/**
 * Custom hook for managing feedback state
 * Handles chip selection and feedback state
 */
export const useFeedback = () => {
  const [selectedChips, setSelectedChips] = useState([]);

  const toggleChip = useCallback((chip) => {
    setSelectedChips((prev) => {
      const exists = prev.includes(chip);
      return exists
        ? prev.filter((c) => c !== chip)
        : [...prev, chip];
    });
  }, []);

  const clearChips = useCallback(() => {
    setSelectedChips([]);
  }, []);

  return {
    selectedChips,
    toggleChip,
    clearChips,
  };
};
