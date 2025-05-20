import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiBook, FiUser, FiMessageSquare } from 'react-icons/fi';
import { useTimetable } from '../contexts/TimetableContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const PreferenceForm = ({ userType, userId, onSubmit }) => {
  const { saveFacultyPreference, saveStudentPreference } = useTimetable();
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    subject: '',
    teacher: '',
    room: '',
    additionalNotes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save preference based on user type
    if (userType === 'faculty') {
      saveFacultyPreference(userId, formData);
    } else {
      saveStudentPreference(userId, formData);
    }
    
    setSubmitted(true);
    if (onSubmit) onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {userType === 'faculty' ? 'Faculty' : 'Student'} Preference Form
      </h2>
      
      {submitted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 dark:text-green-400 font-semibold"
        >
          Preferences submitted successfully!
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <FiCalendar className="w-4 h-4" /> Day
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="">Select Day</option>
                {DAYS.map(day => (
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
                required
                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="">Select Time</option>
                {TIME_SLOTS.map(time => (
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
              required
              placeholder="Enter subject name"
              className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 text-sm"
            />
          </div>

          {userType === 'faculty' && (
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <FiUser className="w-4 h-4" /> Teacher
              </label>
              <input
                type="text"
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                required
                placeholder="Enter teacher name"
                className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 text-sm"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <FiMessageSquare className="w-4 h-4" /> Additional Notes
            </label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Any additional preferences or requirements"
              className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 text-sm"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold
              hover:bg-primary-700 transition-colors duration-200"
          >
            Submit Preferences
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default PreferenceForm; 