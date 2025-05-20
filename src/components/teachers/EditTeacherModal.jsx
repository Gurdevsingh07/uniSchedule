import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiPhone, FiBook, FiBriefcase } from 'react-icons/fi';
import { createPortal } from 'react-dom';

const EditTeacherModal = ({ isOpen, onClose, teacher, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    email: '',
    phone: '',
    subjects: '',
    classCount: 0,
    experience: 0,
    students: 0,
    rating: 0,
    isActive: true
  });

  const [highlighted, setHighlighted] = useState(false);
  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [portalNode, setPortalNode] = useState(null);
  
  // Check for mobile view and create portal node
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Create portal element
    if (!portalNode) {
      const node = document.createElement('div');
      node.id = 'teacher-modal-root';
      document.body.appendChild(node);
      setPortalNode(node);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (portalNode && portalNode.parentNode) {
        portalNode.parentNode.removeChild(portalNode);
      }
    };
  }, [portalNode]);

  // Update form data when teacher prop changes
  useEffect(() => {
    if (teacher) {
      setFormData({
        ...teacher,
        subjects: Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : ''
      });
    }
  }, [teacher]);

  // Handle body scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Add highlight effect for visibility
        setTimeout(() => setHighlighted(true), 100);
      setTimeout(() => setHighlighted(false), 800);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...teacher,
      ...formData,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 100) {
      onClose();
    }
    setDragging(false);
  };

  // Don't render if not open or no portal node
  if (!isOpen || !portalNode) return null;

  // Create modal content
  const modalContent = (
    <AnimatePresence mode="sync">
      {/* Backdrop/overlay */}
        <motion.div
        key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-40"
          onClick={onClose}
      />
      
      {/* The modal window itself - conditionally render only one based on isMobile */}
      {isMobile ? (
        // Mobile view - bottom sheet
          <motion.div
          key="mobile-modal"
            ref={modalRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
            transition={{
              type: 'spring',
            damping: 25,
              stiffness: 300
            }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 50 }}
          dragElastic={0.2}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
          className={`
            fixed bottom-0 inset-x-0 mx-2 rounded-t-2xl
            bg-white dark:bg-gray-800 shadow-2xl
            max-h-[90vh] overflow-y-auto z-50
            ${highlighted ? 'ring-2 ring-primary-400' : ''}
          `}
        >
          {/* Drag handle for mobile */}
          <div className="absolute left-0 right-0 top-3 flex justify-center">
            <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          
          <div className="p-4 md:p-5 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {teacher?.id ? 'Edit Teacher' : 'Add Teacher'}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <FiX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                {/* First row: Name and Department */}
                <div className="grid grid-cols-2 gap-3">
              <div>
                    <label htmlFor="teacher-name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiUser className="inline mr-1.5 h-3 w-3 text-primary-500 dark:text-primary-400" /> Name
                </label>
                  <input
                      id="teacher-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-primary-500/30 dark:focus:ring-primary-400/30 focus:border-primary-500"
                    required
                  />
                </div>
              <div>
                    <label htmlFor="teacher-department" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiBriefcase className="inline mr-1.5 h-3 w-3 text-indigo-500 dark:text-indigo-400" /> Department
                </label>
                <input
                    id="teacher-department"
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 focus:border-indigo-500"
                  required
                />
                  </div>
              </div>

                {/* Second row: Email and Phone */}
                <div className="grid grid-cols-2 gap-3">
              <div>
                    <label htmlFor="teacher-email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiMail className="inline mr-1.5 h-3 w-3 text-blue-500 dark:text-blue-400" /> Email
                </label>
                  <input
                      id="teacher-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:border-blue-500"
                    required
                  />
                </div>
              <div>
                    <label htmlFor="teacher-phone" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiPhone className="inline mr-1.5 h-3 w-3 text-green-500 dark:text-green-400" /> Phone
                </label>
                  <input
                      id="teacher-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-green-500/30 dark:focus:ring-green-400/30 focus:border-green-500"
                    required
                  />
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div>
                <label htmlFor="teacher-subjects" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FiBook className="inline mr-1.5 h-3 w-3 text-purple-500 dark:text-purple-400" /> Subjects (comma separated)
                </label>
                  <input
                    id="teacher-subjects"
                    type="text"
                    value={formData.subjects}
                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-400/30 focus:border-purple-500"
                    required
                  />
              </div>

              {/* Stats in a compact grid */}
              <div className="grid grid-cols-4 gap-2 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                <div>
                  <label htmlFor="teacher-classes" className="block text-[10px] text-gray-500 dark:text-gray-400">Classes</label>
                  <input
                      id="teacher-classes"
                    type="number"
                    min="0"
                    value={formData.classCount}
                    onChange={(e) => setFormData({ ...formData, classCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="teacher-experience" className="block text-[10px] text-gray-500 dark:text-gray-400">Years</label>
                  <input
                      id="teacher-experience"
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="teacher-students" className="block text-[10px] text-gray-500 dark:text-gray-400">Students</label>
                  <input
                    id="teacher-students"
                    type="number"
                    min="0"
                    value={formData.students}
                    onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="teacher-rating" className="block text-[10px] text-gray-500 dark:text-gray-400">Rating</label>
                  <input
                    id="teacher-rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-xs"
                  />
                </div>
              </div>
              
              {/* Status toggle and action buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <div className="flex items-center bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2">
                  <span className={`text-sm ${formData.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Status: {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative ml-3 inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <motion.span 
                      layout
                      transition={{ type: "spring", stiffness: 700, damping: 30 }}
                      className="inline-block h-4 w-4 transform rounded-full bg-white"
                      animate={{ 
                        x: formData.isActive ? 24 : 4
                      }}
                    />
                  </button>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-lg shadow-md text-sm font-medium"
                  >
                    Save
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      ) : (
        // Desktop view - centered modal
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            key="desktop-modal"
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            onClick={(e) => e.stopPropagation()}
            className={`
              bg-white dark:bg-gray-800 shadow-2xl
              rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto
              ${highlighted ? 'ring-2 ring-primary-400' : ''}
            `}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {teacher?.id ? 'Edit Teacher' : 'Add Teacher'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <FiX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  {/* First row: Name and Department */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="teacher-name-desktop" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <FiUser className="inline mr-1.5 h-3 w-3 text-primary-500 dark:text-primary-400" /> Name
                      </label>
                      <input
                        id="teacher-name-desktop"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-primary-500/30 dark:focus:ring-primary-400/30 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="teacher-department-desktop" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <FiBriefcase className="inline mr-1.5 h-3 w-3 text-indigo-500 dark:text-indigo-400" /> Department
                      </label>
                      <input
                        id="teacher-department-desktop"
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Second row: Email and Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="teacher-email-desktop" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <FiMail className="inline mr-1.5 h-3 w-3 text-blue-500 dark:text-blue-400" /> Email
                      </label>
                      <input
                        id="teacher-email-desktop"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="teacher-phone-desktop" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <FiPhone className="inline mr-1.5 h-3 w-3 text-green-500 dark:text-green-400" /> Phone
                      </label>
                      <input
                        id="teacher-phone-desktop"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-green-500/30 dark:focus:ring-green-400/30 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <label htmlFor="teacher-subjects-desktop" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FiBook className="inline mr-1.5 h-3 w-3 text-purple-500 dark:text-purple-400" /> Subjects (comma separated)
                  </label>
                  <input
                    id="teacher-subjects-desktop"
                    type="text"
                    value={formData.subjects}
                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-400/30 focus:border-purple-500"
                    required
                  />
                </div>
                
                {/* Stats in a compact grid */}
                <div className="grid grid-cols-4 gap-2 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                  <div>
                    <label htmlFor="teacher-classes-desktop" className="block text-[10px] text-gray-500 dark:text-gray-400">Classes</label>
                    <input
                      id="teacher-classes-desktop"
                      type="number"
                      min="0"
                      value={formData.classCount}
                      onChange={(e) => setFormData({ ...formData, classCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="teacher-experience-desktop" className="block text-[10px] text-gray-500 dark:text-gray-400">Years</label>
                    <input
                      id="teacher-experience-desktop"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="teacher-students-desktop" className="block text-[10px] text-gray-500 dark:text-gray-400">Students</label>
                    <input
                      id="teacher-students-desktop"
                      type="number"
                      min="0"
                      value={formData.students}
                      onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="teacher-rating-desktop" className="block text-[10px] text-gray-500 dark:text-gray-400">Rating</label>
                    <input
                      id="teacher-rating-desktop"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-xs"
                  />
                </div>
              </div>

                {/* Status toggle and action buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2">
                    <span className={`text-sm ${formData.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      Status: {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                      className={`relative ml-3 inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                    >
                      <motion.span 
                        layout
                        transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        className="inline-block h-4 w-4 transform rounded-full bg-white"
                        animate={{ 
                          x: formData.isActive ? 24 : 4
                        }}
                  />
                </button>
              </div>

                  <div className="flex gap-3 justify-end">
                <motion.button
                      type="button"
                      onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-lg shadow-md text-sm font-medium"
                >
                      Save
                </motion.button>
                  </div>
              </div>
            </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, portalNode);
};

export default EditTeacherModal; 