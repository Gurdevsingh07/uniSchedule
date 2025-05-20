import React from 'react';
import { useTimetable } from '../contexts/TimetableContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiX } from 'react-icons/fi';

const NotificationList = () => {
  const { notifications, removeNotification } = useTimetable();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <FiAlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <FiInfo className="w-5 h-5 text-blue-500" />;
    }
  };

  if (!notifications || notifications.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No new notifications.</p>;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-start gap-3"
          >
            <div className="flex-shrink-0 mt-1">
              {getIcon(notification.type)}
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">{notification.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
              {notification.timestamp && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              aria-label="Dismiss notification"
            >
              <FiX className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationList;
