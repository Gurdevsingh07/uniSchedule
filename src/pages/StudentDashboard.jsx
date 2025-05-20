import React, { useState } from 'react';
import { useTimetable } from '../contexts/TimetableContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClipboard, FiCheckCircle, FiUser, FiPlus, FiList, FiBookOpen } from 'react-icons/fi';
import TimetableTable from '../components/TimetableTable';

const TABS = [
  { key: 'timetable', label: 'Timetable', icon: <FiCalendar /> },
  { key: 'preferences', label: 'My Preferences', icon: <FiList /> },
  { key: 'submit', label: 'Submit Preferences', icon: <FiPlus /> },
];

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  })
};

// Copied cardStyle from FacultyDashboard for elegant look with glowing edge on hover
const cardStyle = 
  'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700 '
  + 'hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-primary-400/5 hover:ring-purple-500 dark:hover:ring-primary-400 '
  + 'transition-all duration-300 ease-in-out';

const StudentDashboard = () => {
  const { timetableData, getAllPreferences, saveStudentPreference } = useTimetable();
  const userId = 'student1'; // Replace with real user id in production
  const myPreferences = getAllPreferences().student[userId] || {};
  const [form, setForm] = useState({ day: '', time: '', subject: '' });
  const [submitted, setSubmitted] = useState(!!myPreferences.day);
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    saveStudentPreference(userId, form);
    setSubmitted(true);
    setSuccess(true);
  };

  // Status badge helpers
  const badge = (ok, label) => (
    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${ok ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{label}</span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 pb-16">
      {/* Sticky Header - Keep this */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <FiUser className="w-7 h-7 text-primary-600 dark:text-primary-400" />
          <span className="font-bold text-lg text-gray-900 dark:text-white">Student Dashboard</span>
        </div>
        <div className="flex gap-2">
          {badge(submitted, submitted ? 'Preferences Submitted' : 'Preferences Needed')}
          {badge(timetableData.length > 0, timetableData.length > 0 ? 'Timetable Ready' : 'Timetable Pending')}
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Hero/Welcome Section - Keep this, adjust margin if needed */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-8 flex flex-col items-center text-center">
          {/* Title and Badges - Keep these */}
          <div className="flex items-center gap-3 mb-2">
            <FiUser className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">Welcome, Student</h1>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {badge(submitted, submitted ? 'Preferences Submitted' : 'Preferences Needed')}
            {badge(timetableData.length > 0, timetableData.length > 0 ? 'Timetable Ready' : 'Timetable Pending')}
          </div>
        </motion.div>

        {/* Dashboard Layout - Updated to match FacultyDashboard */}
        <div className="flex flex-col gap-8">
          {/* Timetable Table (Optimized) - Full Width */}
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0} className={cardStyle}>
            <div className="flex items-center gap-3 mb-4 text-primary-600 dark:text-primary-400">
              <FiCalendar className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Timetable</h2>
            </div>
            <TimetableTable timetable={timetableData} />
          </motion.div>

          {/* Preferences side by side - Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Submit Preferences */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className={cardStyle}>
              <div className="flex items-center gap-3 mb-4 text-green-600 dark:text-green-400">
                <FiClipboard className="w-6 h-6" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Submit Preferences</h2>
              </div>
              {submitted ? (
                <div className="text-green-700 dark:text-green-300 font-semibold flex items-center gap-2"><FiCheckCircle /> Preferences submitted!</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 mt-2">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Day</label>
                    <input name="day" value={form.day} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Time</label>
                    <input name="time" value={form.time} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" />
                  </div>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg">Submit</button>
                  {success && <div className="text-green-700 dark:text-green-300 font-semibold mt-2">Preferences saved!</div>}
                </form>
              )}
            </motion.div>

            {/* My Preferences */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className={cardStyle}>
              <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
                <FiList className="w-6 h-6" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Preferences</h2>
              </div>
               {/* Display Preferences */}
               {Object.keys(myPreferences).length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <FiBookOpen className="w-5 h-5 text-primary-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">{myPreferences.subject}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500">{myPreferences.day} {myPreferences.time}</span>
                  </div>
                  {myPreferences.additionalNotes && (
                    <div className="text-xs text-gray-500 italic mt-1">{myPreferences.additionalNotes}</div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">No preferences submitted yet.</div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard; 