import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiClock, FiBook, FiUser, FiX, FiChevronDown, FiCalendar, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const InputField = ({ icon: Icon, label, name, id, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
    </div>
    <input
      id={id || name}
      name={name}
      {...props}
      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
        bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100
        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
        transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-600
        backdrop-blur-sm shadow-sm dark:shadow-gray-950/10"
    />
  </div>
);

const SelectField = ({ icon: Icon, label, name, id, children, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
    </div>
    <select
      id={id || name}
      name={name}
      {...props}
      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
        bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100
        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
        transition-all duration-200 appearance-none backdrop-blur-sm
        shadow-sm dark:shadow-gray-950/10"
    >
      {children}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <FiChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
    </div>
  </div>
);

const AddEntryModal = ({ isOpen, onClose, onAdd, prefilledData }) => {
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    subject: '',
    teacher: '',
    room: ''
  });

  // Update form when prefilled data changes
  useEffect(() => {
    if (prefilledData) {
      setFormData(prev => ({
        ...prev,
        day: prefilledData.day || '',
        time: prefilledData.time || ''
      }));
    }
  }, [prefilledData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.day || !formData.time || !formData.subject || !formData.teacher || !formData.room) {
      toast.error('Please fill all fields');
      return;
    }
    
    // Add the new entry
    onAdd({
      ...formData,
      id: Date.now().toString() // Ensure ID is unique
    });
    
    // Reset only the content fields but keep day and time if available
    // This makes it easier to add multiple entries for the same time slot
    setFormData(prev => ({
      day: prev.day,
      time: prev.time,
      subject: '',
      teacher: '',
      room: ''
    }));
    
    // Show success message but don't close the modal
    toast.success('Class added successfully');
  };

  // Only close and fully reset when explicitly cancelled
  const handleClose = () => {
    setFormData({
      day: '',
      time: '',
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-primary-500 
                      dark:from-blue-400 dark:to-primary-400 bg-clip-text text-transparent">
                      Add New Class
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Fill in the details for the new class
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 
                      transition-colors duration-200"
                  >
                    <FiX className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <SelectField
                    icon={FiCalendar}
                    name="day"
                    id="class-day"
                    value={formData.day}
                    onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                  >
                    <option value="">Select Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </SelectField>

                  <SelectField
                    icon={FiClock}
                    name="time"
                    id="class-time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </SelectField>

                  <InputField
                    icon={FiBook}
                    type="text"
                    name="subject"
                    id="class-subject"
                    placeholder="Subject Name"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  />

                  <InputField
                    icon={FiUser}
                    type="text"
                    name="teacher"
                    id="class-teacher"
                    placeholder="Teacher Name"
                    value={formData.teacher}
                    onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
                  />

                  <InputField
                    icon={FiHome}
                    type="text"
                    name="room"
                    id="class-room"
                    placeholder="Room Number"
                    value={formData.room}
                    onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  />

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    id="add-class-button"
                    name="add-class-button"
                    className="w-full p-4 mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-primary-600
                      text-white font-semibold shadow-lg shadow-primary-500/20
                      hover:shadow-xl hover:shadow-primary-500/30 
                      focus:ring-2 focus:ring-primary-500/30
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

const TimetableGridModern = ({ data, onInsert, onDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const getEntriesForSlot = (day, time) => {
    const dayEntries = data && data[day]; // Access the specific day's array from the data prop
    if (Array.isArray(dayEntries)) {
      // Now find within the day's entries
      const entry = dayEntries.find(entry => entry.time === time); // Only need to match time now
      return entry || null;
    }
    return null; // Return null if no entries for the day or data[day] is not an array
  };

  // Updated handler for empty slot clicks
  const handleEmptySlotClick = (day, time) => {
    setSelectedSlot({ day, time });
    setShowAddModal(true);
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-white/50 via-gray-50/50 to-white/50 dark:from-dark-900/50 dark:via-dark-800/50 dark:to-dark-900/50 relative">
      {/* Mobile View Container */}
      <div className="md:hidden h-full">
        {/* Header */}
        <div className="fixed top-0 inset-x-0 z-30 py-4 px-6 
          bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-primary-500 
            dark:from-blue-400 dark:to-primary-400 bg-clip-text text-transparent">
            Weekly Schedule
          </h2>
        </div>

        {/* Main Content Area */}
        <div className="h-full overflow-auto pt-16 pb-24">
          <div className="min-w-[768px] p-4">
            <div className="sticky top-0 z-10 grid grid-cols-[180px_repeat(8,1fr)] gap-3 mb-4
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <div className="flex items-center justify-center p-3 bg-primary-50 dark:bg-primary-900/20 
                rounded-xl font-semibold text-primary-600 dark:text-primary-400 shadow-sm dark:shadow-gray-950/10">
                Time/Day
              </div>
              {timeSlots.map(time => (
                <div key={time}
                  className="flex items-center justify-center p-3 
                    bg-gray-50/80 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm
                    font-medium text-sm text-gray-700 dark:text-gray-300 shadow-sm dark:shadow-gray-950/10">
                  {time}
                </div>
              ))}
            </div>

            {/* Enhanced Table Body */}
            <div className="space-y-3">
              {days.map(day => (
                <div key={day} className="grid grid-cols-[180px_repeat(8,1fr)] gap-3 group">
                  {/* Enhanced Day Label */}
                  <div className="flex items-center px-4 py-3 
                    bg-gradient-to-r from-primary-50/80 to-gray-50/80 
                    dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm
                    rounded-xl font-medium text-gray-700 dark:text-gray-300 shadow-sm dark:shadow-gray-950/10
                    group-hover:from-primary-100 dark:group-hover:from-primary-900/20
                    transition-colors duration-300">
                    {day}
                  </div>

                  {/* Enhanced Time Slots */}
                  {timeSlots.map(time => {
                    const entry = getEntriesForSlot(day, time);
                    return (
                      <div key={`${day}-${time}`} className="relative min-h-[110px]">
                        <AnimatePresence mode="wait">
                          {entry ? (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="h-full p-3 rounded-xl bg-gradient-to-br 
                                from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm
                                border border-gray-200 dark:border-gray-700
                                hover:border-primary-500/50 dark:hover:border-primary-500/50
                                shadow hover:shadow-lg hover:shadow-primary-500/10 dark:shadow-gray-950/10
                                transition-all duration-300 group/card flex flex-col justify-between"
                            >
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="font-semibold text-sm bg-gradient-to-r 
                                  from-blue-600 to-primary-500 dark:from-blue-400 dark:to-primary-400 bg-clip-text text-transparent
                                  group-hover/card:from-primary-500 group-hover/card:to-primary-400">
                                  {entry.subject || 'New Class'}
                                </h3>
                                <button
                                  onClick={() => onDelete(entry.id)}
                                  className="p-1 rounded-full text-red-500 opacity-0 
                                    group-hover/card:opacity-100 hover:bg-red-50 
                                    dark:hover:bg-red-900/30 transition-all duration-200"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                              {entry.teacher && (
                                <div className="flex items-center gap-1 text-xs 
                                  text-gray-600 dark:text-gray-400">
                                  <FiUser className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{entry.teacher}</span>
                                </div>
                              )}
                              {entry.room && (
                                <div className="flex items-center gap-1 text-xs 
                                  text-gray-500 dark:text-gray-500 mt-1">
                                  <FiBook className="w-3 h-3 shrink-0" />
                                  <span>Room {entry.room}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-xs mt-auto
                                text-gray-500 dark:text-gray-400">
                                <FiClock className="w-3 h-3 shrink-0" />
                                <span>{entry.time}</span>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleEmptySlotClick(day, time)}
                              className="absolute inset-0 flex items-center justify-center 
                                rounded-xl border-2 border-dashed border-gray-200 
                                dark:border-gray-700 hover:border-primary-500/70
                                dark:hover:border-primary-500/70 transition-all duration-200
                                hover:bg-primary-50/50 dark:hover:bg-primary-900/20 backdrop-blur-sm
                                group/empty"
                            >
                              <FiPlus className="w-5 h-5 text-gray-400 
                                group-hover/empty:text-primary-500 
                                dark:text-gray-600 dark:group-hover/empty:text-primary-400 
                                transition-colors" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Button - Fixed Position */}
        <div className="fixed bottom-20 right-4 z-40 w-16 h-16 mx-auto">
          <motion.button
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-full flex items-center justify-center rounded-full 
              bg-gradient-to-r from-blue-500 to-primary-600
              text-white font-medium shadow-xl hover:shadow-2xl shadow-primary-500/20
              backdrop-blur-sm border border-white/10 relative overflow-hidden group"
            onClick={() => setShowAddModal(true)}
            aria-label="Add New Class"
          >
            <FiPlus className="w-6 h-6 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-45" />
          </motion.button>
        </div>
      </div>

      {/* Desktop View - Hidden on Mobile */}
      <div className="hidden md:block flex-1 overflow-x-auto">
        <div className="min-w-[768px] p-4">
          {/* Enhanced Header with Time Slots */}
          <div className="sticky top-0 z-10 grid grid-cols-[180px_repeat(8,1fr)] gap-3 mb-4
            bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <div className="flex items-center justify-center p-3 bg-primary-50 dark:bg-primary-900/20 
              rounded-xl font-semibold text-primary-600 dark:text-primary-400 shadow-sm dark:shadow-gray-950/10">
              Time/Day
            </div>
            {timeSlots.map(time => (
              <div key={time}
                className="flex items-center justify-center p-3 
                  bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl
                  font-medium text-sm text-gray-700 dark:text-gray-300 shadow-sm dark:shadow-gray-950/10">
                {time}
              </div>
            ))}
          </div>

          {/* Enhanced Table Body */}
          <div className="space-y-3">
            {days.map(day => (
              <div key={day} className="grid grid-cols-[180px_repeat(8,1fr)] gap-3 group">
                {/* Enhanced Day Label */}
                <div className="flex items-center px-4 py-3 
                  bg-gradient-to-r from-primary-50/80 to-gray-50/80 
                  dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm
                  rounded-xl font-medium text-gray-700 dark:text-gray-300 shadow-sm dark:shadow-gray-950/10
                  group-hover:from-primary-100 dark:group-hover:from-primary-900/20
                  transition-colors duration-300">
                  {day}
                </div>

                {/* Enhanced Time Slots */}
                {timeSlots.map(time => {
                  const entry = getEntriesForSlot(day, time);
                  return (
                    <div key={`${day}-${time}`} className="relative min-h-[110px]">
                      <AnimatePresence mode="wait">
                        {entry ? (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="h-full p-3 rounded-xl bg-gradient-to-br 
                              from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm
                              border border-gray-200 dark:border-gray-700
                              hover:border-primary-500/50 dark:hover:border-primary-500/50
                              shadow hover:shadow-lg hover:shadow-primary-500/10 dark:shadow-gray-950/10
                              transition-all duration-300 group/card flex flex-col justify-between"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-semibold text-sm bg-gradient-to-r 
                                from-blue-600 to-primary-500 dark:from-blue-400 dark:to-primary-400 bg-clip-text text-transparent
                                group-hover/card:from-primary-500 group-hover/card:to-primary-400">
                                {entry.subject || 'New Class'}
                              </h3>
                              <button
                                onClick={() => onDelete(entry.id)}
                                className="p-1 rounded-full text-red-500 opacity-0 
                                  group-hover/card:opacity-100 hover:bg-red-50 
                                  dark:hover:bg-red-900/30 transition-all duration-200"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {entry.teacher && (
                              <div className="flex items-center gap-1 text-xs 
                                text-gray-600 dark:text-gray-400">
                                <FiUser className="w-3 h-3 shrink-0" />
                                <span className="truncate">{entry.teacher}</span>
                              </div>
                            )}
                            {entry.room && (
                              <div className="flex items-center gap-1 text-xs 
                                text-gray-500 dark:text-gray-500 mt-1">
                                <FiBook className="w-3 h-3 shrink-0" />
                                <span>Room {entry.room}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-xs mt-auto
                              text-gray-500 dark:text-gray-400">
                              <FiClock className="w-3 h-3 shrink-0" />
                              <span>{entry.time}</span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleEmptySlotClick(day, time)}
                            className="absolute inset-0 flex items-center justify-center 
                              rounded-xl border-2 border-dashed border-gray-200 
                              dark:border-gray-700 hover:border-primary-500/70
                              dark:hover:border-primary-500/70 transition-all duration-200
                              hover:bg-primary-50/50 dark:hover:bg-primary-900/20 backdrop-blur-sm
                              group/empty"
                          >
                            <FiPlus className="w-5 h-5 text-gray-400 
                              group-hover/empty:text-primary-500 
                              dark:text-gray-600 dark:group-hover/empty:text-primary-400 
                              transition-colors" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedSlot(null);
        }}
        onAdd={onInsert}
        prefilledData={selectedSlot}
      />
    </div>
  );
};

export default TimetableGridModern;
