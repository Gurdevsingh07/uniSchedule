import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiEdit, FiSave, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  });
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Handle edit form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };
  
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would update the user profile data
    // For this demo, we'll just toggle editing mode off
    setIsEditing(false);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 pb-16 sm:p-0">
      <div className="w-full max-w-3xl">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <h1 className="text-2xl font-bold">User Profile</h1>
              <p className="text-blue-100">Manage your account information</p>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* Avatar */}
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white dark:border-gray-700">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.form 
                      key="edit-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                      onSubmit={handleSubmit}
                    >
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={editForm.name}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                            disabled
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                      </div>
                      
                      <div className="flex justify-end space-x-3 mt-6">
                        <button 
                          type="button" 
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 flex items-center"
                        >
                          <FiX className="mr-2" />
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center"
                        >
                          <FiSave className="mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="profile-info"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                          {currentUser?.name || 'User'}
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="ml-3 p-1 rounded-full text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                        </h2>
                        
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <FiMail className="mr-3 text-gray-400" />
                            <span>{currentUser?.email || 'No email'}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <FiCalendar className="mr-3 text-gray-400" />
                            <span>Joined: {new Date(currentUser?.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {currentUser?.lastLogin && (
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <FiCalendar className="mr-3 text-gray-400" />
                              <span>Last login: {new Date(currentUser.lastLogin).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button 
                          onClick={handleLogout}
                          className="px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                        >
                          <FiLogOut className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 