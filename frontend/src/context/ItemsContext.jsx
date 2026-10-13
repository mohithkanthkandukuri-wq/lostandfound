import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ITEMS, INITIAL_CLAIMS, INITIAL_NOTIFICATIONS } from '../data/initialData';
import { getCategoryImage } from '../utils/imageFallback';
import { triggerSuccessConfetti, triggerCelebrationFireworks } from '../utils/confetti';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ItemsContext = createContext(null);

const STORAGE_ITEMS_KEY = 'campus_recovery_items_store';
const STORAGE_CLAIMS_KEY = 'campus_recovery_claims_store';
const STORAGE_NOTIF_KEY = 'campus_recovery_notifs_store';

export const ItemsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { success, info, warning } = useToast();

  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ITEMS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [claims, setClaims] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CLAIMS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_CLAIMS;
    } catch {
      return INITIAL_CLAIMS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_NOTIF_KEY);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to sync items to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLAIMS_KEY, JSON.stringify(claims));
    } catch (e) {
      console.error('Failed to sync claims to localStorage', e);
    }
  }, [claims]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to sync notifications to localStorage', e);
    }
  }, [notifications]);

  // Create new report
  const addItem = (itemData) => {
    const newItem = {
      id: Date.now(),
      title: itemData.title.trim(),
      description: itemData.description.trim(),
      category: itemData.category,
      reportType: itemData.reportType, // 'LOST' or 'FOUND'
      location: itemData.location,
      incidentDate: itemData.incidentDate || new Date().toISOString().split('T')[0],
      status: 'OPEN',
      imagePath: itemData.imagePath || getCategoryImage(itemData.category),
      reporterId: currentUser ? currentUser.id : 1,
      reporterName: currentUser ? currentUser.name : 'Anonymous Student',
      reporterEmail: currentUser ? currentUser.email : 'student@campus.edu',
      secretVerificationHint: itemData.secretVerificationHint || '',
      claimsCount: 0,
      createdAt: new Date().toISOString()
    };

    setItems((prev) => [newItem, ...prev]);
    triggerSuccessConfetti();
    success(
      `${itemData.reportType === 'LOST' ? 'Lost item' : 'Found item'} listing published successfully!`,
      'Report Submitted'
    );
    return newItem;
  };

  // Update item
  const updateItem = (id, updatedFields) => {
    setItems((prev) =>
      prev.map((item) => (item.id === Number(id) ? { ...item, ...updatedFields } : item))
    );
    success('Item listing updated successfully.');
  };

  // Delete item
  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== Number(id)));
    // Also remove associated claims
    setClaims((prev) => prev.filter((claim) => claim.itemId !== Number(id)));
    info('Item listing deleted.');
  };

  // Mark item as returned / recovered
  const markAsReturned = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === Number(id) ? { ...item, status: 'RESOLVED' } : item
      )
    );
    triggerCelebrationFireworks();
    success('Congratulations! Item marked as successfully returned & reunited.', 'Item Recovered');
  };

  // Submit ownership claim
  const submitClaim = (itemId, message, proofData = {}) => {
    const targetItem = items.find((i) => i.id === Number(itemId));
    if (!targetItem) throw new Error('Item not found');

    const newClaim = {
      id: Date.now(),
      itemId: Number(itemId),
      itemTitle: targetItem.title,
      claimantId: currentUser ? currentUser.id : 1,
      claimantName: currentUser ? currentUser.name : 'Alex Rivera',
      claimantEmail: currentUser ? currentUser.email : 'alex.rivera@campus.edu',
      claimantPhone: currentUser?.phone || '+1 (555) 234-8901',
      message: message.trim(),
      proofDetails: proofData,
      status: 'PENDING',
      reviewMessage: null,
      reviewedBy: null,
      createdAt: new Date().toISOString()
    };

    setClaims((prev) => [newClaim, ...prev]);

    // Increment claims count on item
    setItems((prev) =>
      prev.map((i) =>
        i.id === Number(itemId) ? { ...i, claimsCount: (i.claimsCount || 0) + 1 } : i
      )
    );

    // Notify item reporter
    const newNotif = {
      id: Date.now() + 1,
      userId: targetItem.reporterId,
      title: `New Claim on "${targetItem.title}"`,
      message: `${newClaim.claimantName} submitted a proof of ownership claim.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerSuccessConfetti();
    success(
      'Your claim has been submitted to the finder/security desk for verification.',
      'Claim Filed'
    );
    return newClaim;
  };

  // Review claim (Approve / Reject)
  const reviewClaim = (claimId, newStatus, reviewMessage = '') => {
    setClaims((prev) =>
      prev.map((claim) => {
        if (claim.id === Number(claimId)) {
          return {
            ...claim,
            status: newStatus,
            reviewMessage: reviewMessage.trim(),
            reviewedBy: currentUser?.id || 3,
            updatedAt: new Date().toISOString()
          };
        }
        return claim;
      })
    );

    const targetClaim = claims.find((c) => c.id === Number(claimId));
    if (targetClaim) {
      if (newStatus === 'APPROVED') {
        // Mark item as resolved
        markAsReturned(targetClaim.itemId);
      }

      // Notify claimant
      const notif = {
        id: Date.now(),
        userId: targetClaim.claimantId,
        title: `Claim ${newStatus === 'APPROVED' ? 'Approved!' : 'Declined'}`,
        message: reviewMessage
          ? `Feedback: ${reviewMessage}`
          : `Your claim for "${targetClaim.itemTitle}" was marked as ${newStatus}.`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    if (newStatus === 'APPROVED') {
      success('Claim approved! Item status updated to Resolved.', 'Claim Approved');
    } else {
      warning('Claim was rejected with feedback.', 'Claim Rejected');
    }
  };

  // Cancel claim (by claimant)
  const cancelClaim = (claimId) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === Number(claimId) ? { ...c, status: 'CANCELLED' } : c))
    );
    info('Your claim has been cancelled.');
  };

  // Notification actions
  const markNotificationAsRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === Number(notifId) ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    if (currentUser) {
      setNotifications((prev) => prev.filter((n) => n.userId !== currentUser.id));
    } else {
      setNotifications([]);
    }
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    setItems(INITIAL_ITEMS);
    setClaims(INITIAL_CLAIMS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_ITEMS_KEY);
    localStorage.removeItem(STORAGE_CLAIMS_KEY);
    localStorage.removeItem(STORAGE_NOTIF_KEY);
    info('Demo dataset reset to default state.', 'Reset Complete');
  };

  // Helpers
  const getItemById = (id) => items.find((i) => i.id === Number(id));
  const getClaimsForItem = (itemId) => claims.filter((c) => c.itemId === Number(itemId));
  const getUserClaims = (userId) => claims.filter((c) => c.claimantId === Number(userId));
  const getUserReportedItems = (userId) => items.filter((i) => i.reporterId === Number(userId));

  const value = {
    items,
    claims,
    notifications,
    addItem,
    updateItem,
    deleteItem,
    markAsReturned,
    submitClaim,
    reviewClaim,
    cancelClaim,
    getItemById,
    getClaimsForItem,
    getUserClaims,
    getUserReportedItems,
    markNotificationAsRead,
    clearAllNotifications,
    resetDemoData
  };

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};
