import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiX, FiUser, FiBook, FiClock, FiHome, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { generateUniqueId } from '../../utils/timetableUtils';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const AddClassModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    day: days[0],
    time: timeSlots[0],
    subject: '',
    teacher: '',
    room: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.teacher || !formData.room) {
      toast.error('Please fill all fields');
      return;
    }

    // Add new entry
    onAdd({
      ...formData,
      id: Date.now().toString()
    });

    // Reset content fields but keep day and time selections
    setFormData(prev => ({
      day: prev.day,
      time: prev.time,
      subject: '',
      teacher: '',
      room: ''
    }));

    // Show success but don't close modal
    toast.success('Class added successfully');
  };

  // Close and fully reset
  const handleClose = () => {
    setFormData({
      day: days[0],
      time: timeSlots[0],
      subject: '',
      teacher: '',
      room: ''
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />

            <div className="inline-block w-full max-w-md my-8 text-left align-middle">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl dark:shadow-gray-950/20 p-6 overflow-hidden border border-white/30 dark:border-gray-700/50"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-primary-500 
                    dark:from-blue-400 dark:to-primary-400 bg-clip-text text-transparent">
                    Add New Class
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 
                      transition-colors duration-200"
                  >
                    <FiX className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" /> Day
                      </label>
                      <select 
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                          bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 text-sm"
                      >
                        {days.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <FiClock className="w-4 h-4" /> Time
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                          bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 text-sm"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <FiBook className="w-4 h-4" /> Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject name"
                      className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                        bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <FiUser className="w-4 h-4" /> Teacher
                    </label>
                    <input
                      type="text"
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleChange}
                      placeholder="Enter teacher name"
                      className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                        bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <FiHome className="w-4 h-4" /> Room
                    </label>
                    <input
                      type="text"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      placeholder="Enter room number"
                      className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                        bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full p-3 mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-primary-600
                      text-white font-semibold shadow-lg shadow-primary-500/20
                      hover:shadow-xl hover:shadow-primary-500/30 
                      transition-all duration-200 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Add Class</span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-45" />
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TimetableGridMobile = ({ data, onInsert, onDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-4 space-y-6 bg-gradient-to-b from-white/50 via-gray-50/50 to-white/50 dark:from-dark-900/50 dark:via-dark-800/50 dark:to-dark-900/50">
      {days.map(day => {
        const dayEntries = data.filter(entry => entry.day === day);
        return (
          <div key={day} className="rounded-xl shadow-lg p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/30 dark:border-gray-700/50">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-primary-500 dark:from-blue-400 dark:to-primary-400 bg-clip-text text-transparent mb-2">{day}</h3>
            {dayEntries.length > 0 ? (
              <div className="space-y-3">
                {dayEntries.map(entry => (
                  <motion.div
                    key={entry.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm shadow-sm dark:shadow-gray-950/10 border border-gray-200 dark:border-gray-700 hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-primary-500 dark:from-blue-400 dark:to-primary-400 group-hover:from-primary-500 group-hover:to-primary-400">
                          {entry.subject}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{entry.teacher}</p>
                        <p className="text-xs italic text-gray-500 dark:text-gray-500">
                          {entry.room} - {entry.time}
                        </p>
                      </div>
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="p-2 rounded-full bg-red-100/80 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors opacity-70 group-hover:opacity-100"
                        aria-label="Delete"
                      >
                        <FiTrash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary-500/70 dark:hover:border-primary-500/70 transition-all duration-200 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 backdrop-blur-sm group">
                <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">No classes scheduled.</p>
              </div>
            )}
          </div>
        );
      })}
      
      <motion.button
        onClick={() => setShowAddModal(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-blue-500 to-primary-600 text-white font-semibold shadow-md relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center">
          <FiPlus size={20} className="mr-2" /> Add New Class
        </span>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-45" />
      </motion.button>
      
      <AddClassModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={onInsert}
      />
    </div>
  );
};

export default TimetableGridMobile;
