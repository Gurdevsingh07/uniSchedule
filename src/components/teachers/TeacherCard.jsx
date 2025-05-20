import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiBook, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiClock, FiCalendar, FiStar, FiAward, FiX } from 'react-icons/fi';
import EditTeacherModal from './EditTeacherModal';

const TeacherCard = ({ teacher, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const handleEdit = async (updatedTeacher) => {
    setIsLoading(true);
    try {
      await onEdit(updatedTeacher);
      setIsEditModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(teacher);
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting teacher:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format subject count for display
  const subjectDisplay = teacher.subjects?.length > 3 
    ? `${teacher.subjects.slice(0, 2).join(", ")}... +${teacher.subjects.length - 2}`
    : teacher.subjects?.join(", ");

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-lg border border-gray-200/50 dark:border-gray-700/30 shadow-md overflow-hidden transition-all duration-300 h-full"
      >
        {/* Header with gradient background */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 dark:from-primary-600/20 dark:to-accent-600/20"></div>
          <div className="p-2 sm:p-3 border-b border-gray-200/30 dark:border-gray-700/30 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm relative z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 flex items-center justify-center flex-shrink-0 shadow-md">
                <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 truncate">
                  {teacher.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 truncate">
                    {teacher.department}
                  </span>
                  {teacher.rating > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-100/70 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded-full">
                      <FiStar className="w-2.5 h-2.5 text-yellow-500 dark:text-yellow-400" />
                      <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                        {teacher.rating?.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
          {/* Contact Information */}
          <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FiMail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 truncate">
                {teacher.email}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FiPhone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 truncate">
                {teacher.phone}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FiBook className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 truncate">
                {subjectDisplay || "No subjects assigned"}
              </span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-2 pt-1.5 sm:pt-2 border-t border-gray-100 dark:border-gray-700/30 mt-1.5 sm:mt-2">
            <div className="text-center">
              <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                {teacher.classCount || 0}
              </div>
              <div className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">Classes</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                {teacher.experience || 0}
              </div>
              <div className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">Years</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                {teacher.students || 0}
              </div>
              <div className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">Students</div>
            </div>
          </div>
        </div>

        {/* Footer Section with Action Buttons */}
        <div className="p-2 sm:p-3 border-t border-gray-200/30 dark:border-gray-700/30 bg-gray-50/80 dark:bg-gray-800/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${teacher.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                {teacher.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditModalOpen(true)}
                disabled={isLoading}
                className="p-1 sm:p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit Teacher"
                aria-label="Edit Teacher"
              >
                <FiEdit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDeleteConfirmOpen(true)}
                disabled={isLoading}
                className="p-1 sm:p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Teacher"
              >
                <FiTrash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence mode="sync">
        {isDeleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsDeleteConfirmOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-4 sm:p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                  Confirm Deletion
                </h3>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                Are you sure you want to delete {teacher.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* Edit Modal */}
      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={teacher}
        onSave={handleEdit}
      />
    </>
  );
};

export default TeacherCard;