import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiBook, FiUser, FiHome, FiClock, FiCalendar } from 'react-icons/fi';

const InputField = ({
  icon: Icon,
  label,
  name,
  value = '',
  onChange,
  readOnly = false,
  type = "text",
  maxLength,
  pattern,
  required = true
}) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none
      group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400
      transition-colors duration-200">
      <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
    </div>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      maxLength={maxLength}
      pattern={pattern}
      autoComplete="off"
      className={`w-full pl-12 pr-4 py-3.5 text-sm
        border border-gray-300 dark:border-gray-600
        rounded-xl shadow-sm
        ${readOnly
          ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
          : 'bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'}
        text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/50
        transition duration-200`}
      placeholder={`Enter ${label.toLowerCase()}`}
      required={required && !readOnly}
    />
    <label
      htmlFor={name}
      className="absolute left-12 -top-2.5 px-2 text-xs font-medium
        bg-white dark:bg-gray-800 
        text-gray-600 dark:text-gray-400"
    >
      {label}
    </label>
  </div>
);

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const TimetableEntryModal = ({ isOpen, onClose, onSave, initialData = {}, selectedSlot }) => {
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    room: '',
    day: '',
    time: ''
  });
  const [errors, setErrors] = useState({});

  // Only reset form when modal opens, and only if isOpen transitions from false to true
  useEffect(() => {
    if (isOpen) {
      setFormData({
        subject: initialData?.subject || '',
        teacher: initialData?.teacher || '',
        room: initialData?.room || '',
        day: selectedSlot?.day || initialData?.day || '',
        time: selectedSlot?.time || initialData?.time || ''
      });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData?.subject, initialData?.teacher, initialData?.room, selectedSlot?.day, selectedSlot?.time]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const validateForm = useCallback(() => {
    const trimmedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value?.trim()])
    );
    const newErrors = {};
    if (!trimmedData.subject) newErrors.subject = 'Subject is required';
    if (!trimmedData.teacher) newErrors.teacher = 'Teacher name is required';
    if (!trimmedData.room) newErrors.room = 'Room number is required';
    if (!trimmedData.day) newErrors.day = 'Day is required';
    if (!trimmedData.time) newErrors.time = 'Time is required';
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors, trimmedData };
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors, trimmedData } = validateForm();
    if (isValid) {
      // Ensure all fields are included and trimmed
      onSave({
        subject: trimmedData.subject,
        teacher: trimmedData.teacher,
        room: trimmedData.room,
        day: trimmedData.day,
        time: trimmedData.time,
      });
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-colors duration-300"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-md 
                bg-white dark:bg-gray-900
                shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="px-8 py-5 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-purple-700 dark:to-blue-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-100 dark:text-gray-100 drop-shadow">
                    Add New Class
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-blue-500 dark:hover:bg-blue-900 transition-colors duration-200"
                    aria-label="Close"
                  >
                    <FiX className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                  </button>
                </div>
              </div>
              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800 space-y-5">
                  <div className="space-y-4">
                    <InputField
                      icon={FiBook}
                      label="Subject Name"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      maxLength={50}
                    />
                    {errors.subject && <div className="text-xs text-red-600 dark:text-red-400 font-medium pl-1">{errors.subject}</div>}
                    <InputField
                      icon={FiUser}
                      label="Teacher Name"
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleChange}
                      maxLength={50}
                      pattern="[A-Za-z\s.]+"
                    />
                    {errors.teacher && <div className="text-xs text-red-600 dark:text-red-400 font-medium pl-1">{errors.teacher}</div>}
                    <InputField
                      icon={FiHome}
                      label="Room Number"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      maxLength={10}
                    />
                    {errors.room && <div className="text-xs text-red-600 dark:text-red-400 font-medium pl-1">{errors.room}</div>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Day</label>
                      <div className="relative">
                        <select
                          name="day"
                          value={formData.day}
                          onChange={handleChange}
                          className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm dark:text-gray-200 focus:ring-2 focus:ring-primary-400/30 focus:border-primary-500 dark:focus:border-primary-400 transition-all appearance-none pr-8 shadow-sm hover:border-primary-400 dark:hover:border-blue-500"
                          required
                        >
                          <option value="" disabled className="text-gray-400 dark:text-gray-400">
                            Select day
                          </option>
                          {days.map(day => (
                            <option key={day} value={day} className="text-gray-700 dark:text-gray-100">{day}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                          <FiCalendar className="w-4 h-4" />
                        </span>
                      </div>
                      {errors.day && <div className="text-xs text-red-600 dark:text-red-400 font-medium pl-1">{errors.day}</div>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                      <div className="relative">
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm dark:text-gray-200 focus:ring-2 focus:ring-primary-400/30 focus:border-primary-500 dark:focus:border-primary-400 transition-all appearance-none pr-8 shadow-sm hover:border-primary-400 dark:hover:border-blue-500"
                          required
                        >
                          <option value="" disabled className="text-gray-400 dark:text-gray-400">
                            Select time
                          </option>
                          {timeSlots.map(time => (
                            <option key={time} value={time} className="text-gray-700 dark:text-gray-100">{time}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                          <FiClock className="w-4 h-4" />
                        </span>
                      </div>
                      {errors.time && <div className="text-xs text-red-600 dark:text-red-400 font-medium pl-1">{errors.time}</div>}
                    </div>
                  </div>
                  {Object.keys(errors).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 shadow-md text-sm font-medium p-4 mt-4 border-l-4 border-red-500"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-red-600/90 rounded-full p-2 shadow-md">
                            <FiX className="text-white w-5 h-5" />
                          </span>
                          <h3 className="text-base font-bold">Validation Errors</h3>
                        </div>
                        <ul className="list-disc list-inside pl-6 space-y-1">
                          {Object.values(errors).map((error, index) => (
                            <li key={index} className="text-red-300">{error}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                </div>
                {/* Actions */}
                <div className="px-8 py-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold shadow-md transition-transform duration-200 transform hover:scale-105"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TimetableEntryModal;