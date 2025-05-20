import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const getIcon = (type) => {
  switch (type) {
    case 'error': return <FiAlertCircle className="text-red-500" />;
    case 'warning': return <FiAlertCircle className="text-yellow-500" />;
    case 'success': return <FiCheckCircle className="text-green-500" />;
    default: return <FiInfo className="text-blue-500" />;
  }
};

const NotificationCenter = ({ notifications = [], onDismiss, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false); // For the main list panel
  const [currentToast, setCurrentToast] = useState(null);
  const [processedToastIds, setProcessedToastIds] = useState(new Set());

  // Effect to handle new incoming notifications for toasts
  useEffect(() => {
    if (!notifications || notifications.length === 0) {
      if (currentToast !== null) { // Only update if currentToast is not already null
        setCurrentToast(null); // Clear toast if all notifications are gone
      }
      return;
    }

    // Filter for notifications relevant to the current user and not yet processed as toasts
    const userNotifications = notifications.filter(n => n.recipientId === currentUser?.id && !processedToastIds.has(n.id));
    
    if (userNotifications.length > 0) {
      // Get the most recent one, handling Firestore Timestamps correctly
      const latestNewToast = userNotifications.sort((a, b) => {
        const tsA = a.timestamp;
        const tsB = b.timestamp;

        // Convert to JS Date, calling .toDate() for Firestore Timestamps
        let dateA = tsA ? (typeof tsA.toDate === 'function' ? tsA.toDate() : new Date(tsA)) : null;
        let dateB = tsB ? (typeof tsB.toDate === 'function' ? tsB.toDate() : new Date(tsB)) : null;

        // Ensure dateA and dateB are valid Date objects or null
        if (dateA && isNaN(dateA.getTime())) dateA = null;
        if (dateB && isNaN(dateB.getTime())) dateB = null;

        // Handle null dates by pushing them to the end (less recent)
        if (!dateA && !dateB) return 0; // Both null or invalid, treat as equal
        if (!dateA) return 1;          // a is less recent (null/invalid goes last)
        if (!dateB) return -1;         // b is less recent (null/invalid goes last)
        
        return dateB.getTime() - dateA.getTime(); // Sort descending (most recent first)
      })[0];
      
      if (latestNewToast) {
        // Only set toast if it's different from current, or if current is null
        if (!currentToast || currentToast.id !== latestNewToast.id) {
            setCurrentToast(latestNewToast);
        }
        setProcessedToastIds(prev => {
          if (prev.has(latestNewToast.id)) {
            return prev; // Return previous Set if ID already processed
          }
          const newSet = new Set(prev);
          newSet.add(latestNewToast.id);
          return newSet; // Return new Set only if ID was actually added
        });
      }
    }
  }, [notifications, currentUser, processedToastIds, currentToast]); // Added currentToast to dependencies

  // Effect for auto-dismissing the toast
  useEffect(() => {
    if (currentToast) {
      const timer = setTimeout(() => {
        setCurrentToast(null);
        // Note: We don't call onDismiss here as it's for permanent dismissal from the main list
      }, 5000); // Auto-dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentToast]);

  const handleDismissToast = () => {
    if (currentToast) {
      // If you want dismissing the toast to also dismiss it from the main list:
      // onDismiss(currentToast.id);
      setCurrentToast(null);
    }
  };

  const handlePermanentDismiss = useCallback((id) => {
    onDismiss(id);
    if (currentToast && currentToast.id === id) {
        setCurrentToast(null); // Also clear toast if it was the one dismissed
    }
  }, [onDismiss, currentToast]);

  const userVisibleNotifications = notifications.filter(n => n.recipientId === currentUser?.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <>
      {/* Notification Bell Icon to open the panel */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiBell className={`w-6 h-6 ${userVisibleNotifications.length > 0 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
          {userVisibleNotifications.length > 0 && (
            <span className="absolute top-0 right-0 block h-3 w-3 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
          )}
        </button>
      </div>

      {/* Toast Notification Pop-up */}
      <AnimatePresence>
        {currentToast && (
          <motion.div
            key={currentToast.id} // Added key for AnimatePresence
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed bottom-5 right-5 z-[1000] w-full max-w-sm p-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {getIcon(currentToast.type)}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentToast.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{currentToast.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={handleDismissToast}
                  className="inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Close</span>
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Notification Panel (sidebar style) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-40 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            {userVisibleNotifications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No new notifications.</p>
            ) : (
              <ul className="space-y-3">
                {userVisibleNotifications.map((notification) => (
                  <li key={notification.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm relative">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{notification.message}</p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handlePermanentDismiss(notification.id)} 
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full"
                      title="Dismiss notification"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;