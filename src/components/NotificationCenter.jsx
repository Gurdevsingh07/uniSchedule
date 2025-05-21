import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiCheck, FiTrash2, FiMessageSquare, FiSettings } from 'react-icons/fi';

// Icon helper function
const getIcon = (type) => {
  switch (type) {
    case 'error': return <FiAlertCircle className="text-red-500" />;
    case 'warning': return <FiAlertCircle className="text-yellow-500" />;
    case 'success': return <FiCheckCircle className="text-green-500" />;
    default: return <FiInfo className="text-blue-500" />;
  }
};

// Simple date formatter
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  try {
    // Handle Firestore timestamp
    if (typeof timestamp === 'object' && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString();
    }
    // Handle string or number timestamp
    return new Date(timestamp).toLocaleString();
  } catch (error) {
    return 'Invalid date';
  }
};

const NotificationCenter = ({ notifications = [], onDismiss, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'unread', 'read'
  const [specialPopup, setSpecialPopup] = useState(null); // For admin feedback/preference popup
  const toastTimerRef = useRef(null);
  const specialPopupTimerRef = useRef(null);
  
  // Filter notifications for current user based on selected tab
  const userNotifications = !currentUser?.id ? [] : 
    notifications.filter(n => {
      // First filter by recipient
      if (n.recipientId !== currentUser.id) return false;
      
      // Then filter by read status if needed
      if (selectedTab === 'unread') return !n.read;
      if (selectedTab === 'read') return n.read;
      return true; // 'all' tab shows everything
    })
    .sort((a, b) => {
      // Sort by timestamp (most recent first)
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });
  
  // Get counts for the tabs
  const unreadCount = userNotifications.filter(n => !n.read).length;
  const readCount = userNotifications.filter(n => n.read).length;
  
  // Limit displayed notifications based on selected tab
  const displayedNotifications = userNotifications.slice(0, 15); // Show up to 15 notifications
  
  // Check for new notifications and show toast or special popup for admin
  useEffect(() => {
    // Find the most recent unread notification
    const unreadNotifications = userNotifications.filter(n => !n.read);
    if (unreadNotifications.length === 0 || isOpen) return;

    const latestNotification = unreadNotifications[0];
    
    // Check if this is a special notification (feedback or preference) for admin
    const isSpecialNotification = 
      currentUser?.role === 'admin' && 
      (latestNotification.category === 'feedback' || 
       latestNotification.category === 'preference');
    
    // Handle special notification for admin
    if (isSpecialNotification && !specialPopup) {
      setSpecialPopup(latestNotification);
      
      // Clear any existing special popup timer
      if (specialPopupTimerRef.current) {
        clearTimeout(specialPopupTimerRef.current);
      }
      
      // Set auto-dismiss timer (longer for special popups)
      specialPopupTimerRef.current = setTimeout(() => {
        setSpecialPopup(null);
        specialPopupTimerRef.current = null;
      }, 8000);
      
      return;
    }
    
    // Handle regular toast notification
    if (!activeToast || activeToast.id !== latestNotification.id) {
      setActiveToast(latestNotification);
      
      // Clear any existing timer
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      
      // Set auto-dismiss timer
      toastTimerRef.current = setTimeout(() => {
        setActiveToast(null);
        toastTimerRef.current = null;
      }, 5000);
    }
    
    // Cleanup on unmount
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
      if (specialPopupTimerRef.current) {
        clearTimeout(specialPopupTimerRef.current);
        specialPopupTimerRef.current = null;
      }
    };
  }, [userNotifications, isOpen, activeToast, specialPopup, currentUser]);
  
  // Handle notification dismissal (mark as read)
  const handleMarkAsRead = (id) => {
    if (typeof onDismiss === 'function') {
      // Pass the ID with a special flag to mark as read instead of deleting
      onDismiss(id, { markAsRead: true });
      
      // If this was our active toast, dismiss it
      if (activeToast && activeToast.id === id) {
        setActiveToast(null);
      }
    }
  };
  
  // Handle notification deletion
  const handleDelete = (id) => {
    if (typeof onDismiss === 'function') {
      onDismiss(id);
      
      // If this was our active toast, dismiss it
      if (activeToast && activeToast.id === id) {
        setActiveToast(null);
      }
    }
  };
  
  // Handle dismissing all notifications
  const handleDismissAll = () => {
    if (typeof onDismiss === 'function' && displayedNotifications.length > 0) {
      displayedNotifications.forEach(notification => {
        onDismiss(notification.id);
      });
      setActiveToast(null);
    }
  };
  
  // Handle marking all as read
  const handleMarkAllAsRead = () => {
    if (typeof onDismiss === 'function') {
      const unreadNotifications = displayedNotifications.filter(n => !n.read);
      unreadNotifications.forEach(notification => {
        onDismiss(notification.id, { markAsRead: true });
      });
      setActiveToast(null);
    }
  };
  
  // Handle toast dismissal
  const handleDismissToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setActiveToast(null);
  };
  
  // Handle special popup dismissal
  const handleDismissSpecialPopup = () => {
    if (specialPopupTimerRef.current) {
      clearTimeout(specialPopupTimerRef.current);
      specialPopupTimerRef.current = null;
    }
    setSpecialPopup(null);
  };
  
  // Get appropriate icon for special popups
  const getSpecialIcon = (category) => {
    switch (category) {
      case 'feedback': return <FiMessageSquare className="text-purple-500" />;
      case 'preference': return <FiSettings className="text-blue-500" />;
      default: return getIcon('info');
    }
  };

  return (
    <>
      {/* Notification Bell Icon */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
        >
          <FiBell className={`w-6 h-6 ${unreadCount > 0 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Special Admin Popup for Feedback/Preferences */}
      <AnimatePresence>
        {specialPopup && !isOpen && (
          <motion.div
            key={`special-${specialPopup.id}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.05, 1],
              transition: { 
                scale: { duration: 0.3, times: [0, 0.5, 1] }
              }
            }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1001] w-full max-w-md p-5 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-blue-400 dark:border-blue-600"
          >
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-xl"></div>
            
            <div className="flex items-start mt-2">
              <div className="flex-shrink-0 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                {getSpecialIcon(specialPopup.category)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {specialPopup.category === 'feedback' ? 'New Feedback Received' : 'New Preference Submitted'}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {specialPopup.category === 'feedback' ? 'Feedback' : 'Preference'}
                  </span>
                </div>
                
                <h4 className="mt-1 text-md font-semibold text-gray-800 dark:text-gray-200">{specialPopup.title}</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{specialPopup.message}</p>
                
                {specialPopup.userName && (
                  <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    From: {specialPopup.userName}
                  </p>
                )}
                
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => handleMarkAsRead(specialPopup.id)}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View Details
                  </button>
                  <button
                    onClick={handleDismissSpecialPopup}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular Toast Notification */}
      <AnimatePresence>
        {activeToast && !specialPopup && !isOpen && (
          <motion.div
            key={`toast-${activeToast.id}`}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed bottom-5 right-5 z-[1000] w-full max-w-sm p-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {getIcon(activeToast.type)}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{activeToast.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{activeToast.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex space-x-2">
                <button
                  onClick={() => handleMarkAsRead(activeToast.id)}
                  className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  title="Mark as read"
                >
                  <FiCheck className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDismissToast}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  title="Dismiss"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-40 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedTab('all')}
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  selectedTab === 'all' 
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                All ({userNotifications.length})
              </button>
              <button
                onClick={() => setSelectedTab('unread')}
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  selectedTab === 'unread' 
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setSelectedTab('read')}
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  selectedTab === 'read' 
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Read ({readCount})
              </button>
            </div>
            
            {/* Action Buttons */}
            {displayedNotifications.length > 0 && (
              <div className="flex justify-end space-x-2 p-2 border-b border-gray-200 dark:border-gray-700">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FiCheck className="w-4 h-4 mr-1" /> Mark All Read
                  </button>
                )}
                <button
                  onClick={handleDismissAll}
                  className="flex items-center text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <FiTrash2 className="w-4 h-4 mr-1" /> Clear All
                </button>
              </div>
            )}
            
            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4">
              {displayedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <FiBell className="w-12 h-12 mb-2 opacity-30" />
                  <p>No notifications to display</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {displayedNotifications.map((notification) => (
                    <li 
                      key={notification.id} 
                      className={`p-3 rounded-lg shadow-sm relative ${
                        notification.read 
                          ? 'bg-gray-50 dark:bg-gray-800' 
                          : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{notification.message}</p>
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            {formatDate(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {!notification.read && (
                          <button 
                            onClick={() => handleMarkAsRead(notification.id)} 
                            className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1 rounded-full"
                            title="Mark as read"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(notification.id)} 
                          className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 p-1 rounded-full"
                          title="Delete notification"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;