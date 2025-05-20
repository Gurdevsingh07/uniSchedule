import React, { useState } from 'react';
import { useTimetable } from '../contexts/TimetableContext';
import { motion } from 'framer-motion';
import { FiCalendar, FiClipboard } from 'react-icons/fi';
import TimetableTable from '../components/TimetableTable';

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

const cardStyle = 
  'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700 '
  + 'hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-primary-400/5 hover:ring-purple-500 dark:hover:ring-primary-400 '
  + 'transition-all duration-300 ease-in-out';

const FacultyDashboard = () => {
  const { timetableData, getAllFeedback, saveFeedback, saveFacultyPreference, getAllPreferences } = useTimetable();
  const facultyId = 'faculty1'; // Replace with real faculty id in production
  const myFeedback = getAllFeedback()[facultyId] || {};
  const myPreferences = getAllPreferences()[facultyId] || {};
  const [feedbackText, setFeedbackText] = useState('');
  const [prefForm, setPrefForm] = useState({ day: '', time: '', subject: '' });
  const [prefSubmitted, setPrefSubmitted] = useState(!!myPreferences.day);
  const [prefSuccess, setPrefSuccess] = useState(false);

  const handleSubmit = () => {
    saveFeedback(facultyId, { feedback: feedbackText, date: new Date().toISOString() });
    setFeedbackText('');
  };

  const handlePrefChange = e => setPrefForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePrefSubmit = e => {
    e.preventDefault();
    saveFacultyPreference(facultyId, prefForm);
    setPrefSubmitted(true);
    setPrefSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent"
        >
          Faculty Dashboard
        </motion.h1>
        <div className="flex flex-col gap-8">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={0} className={cardStyle}>
            <div className="flex items-center gap-3 mb-2 text-primary-600 dark:text-primary-400">
              <FiCalendar className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Timetable</h2>
            </div>
            <TimetableTable timetable={timetableData} />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className={cardStyle}>
              <div className="flex items-center gap-3 mb-2 text-green-600 dark:text-green-400">
                <FiClipboard className="w-6 h-6" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Submit Preferences</h2>
              </div>
              {prefSubmitted ? (
                <div className="text-green-700 dark:text-green-300 font-semibold">Preferences submitted!</div>
              ) : (
                <form onSubmit={handlePrefSubmit} className="space-y-3 mt-2">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Day</label>
                    <input name="day" value={prefForm.day} onChange={handlePrefChange} required className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Time</label>
                    <input name="time" value={prefForm.time} onChange={handlePrefChange} required className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                    <input name="subject" value={prefForm.subject} onChange={handlePrefChange} required className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
                  </div>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition">Submit</button>
                  {prefSuccess && <div className="text-green-700 dark:text-green-300 font-semibold mt-2">Preferences saved!</div>}
                </form>
              )}
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className={cardStyle}>
              <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400">
                <FiClipboard className="w-6 h-6" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Feedback</h2>
              </div>
              <pre className="overflow-x-auto text-xs bg-gray-100 dark:bg-gray-900 rounded p-3 mt-2 text-gray-600 dark:text-gray-300">{JSON.stringify(myFeedback, null, 2)}</pre>
              <textarea
                className="w-full mt-2 p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                rows={3}
                placeholder="Enter feedback..."
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
              />
              <button className="mt-2 px-3 py-1 rounded bg-blue-500 text-white" onClick={handleSubmit}>Submit Feedback</button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FacultyDashboard; 