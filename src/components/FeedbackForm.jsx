import React, { useState } from 'react';
import { useTimetable } from '../contexts/TimetableContext';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const FeedbackForm = ({ facultyId, submitterId, submitterName, onFeedbackSubmitted }) => {
  const { saveFeedback, currentUser } = useTimetable();
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState('approve'); // 'approve' or 'issue'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Feedback cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Determine the actual submitter details
    const finalSubmitterId = submitterId || facultyId || currentUser?.id;
    const finalSubmitterName = submitterName || (facultyId ? `Faculty ${facultyId}` : currentUser?.displayName || 'Anonymous');

    if (!finalSubmitterId) {
      setError('Could not determine the submitter. Please ensure you are logged in.');
      setIsSubmitting(false);
      return;
    }

    const feedbackPayload = {
      userId: finalSubmitterId,
      userName: finalSubmitterName,
      type: feedbackType,
      message: feedback,
      // timestamp will be added by saveFeedback in context
    };

    try {
      // Call the context's saveFeedback, which expects a single object
      const result = await saveFeedback(feedbackPayload);
      
      if (result.success) {
        setFeedback('');
        setFeedbackType('approve'); // Reset type
        setShowSuccessMessage(true);
        if (onFeedbackSubmitted) onFeedbackSubmitted(feedbackPayload);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } else {
        setError(result.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Timetable Feedback
      </h2>
      
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          {error}
        </div>
      )}

      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 my-2 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800 flex items-center gap-2"
          role="alert"
        >
          <FiCheckCircle className="w-5 h-5" />
          <span className="font-medium">Thank you for your feedback!</span> We appreciate you taking the time to help us improve.
        </motion.div>
      )}

      {submitted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 dark:text-green-400 font-semibold"
        >
          Feedback submitted successfully!
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Feedback Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="feedbackType"
                  value="approve"
                  checked={feedbackType === 'approve'}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <FiCheckCircle className="w-4 h-4" />
                  Approve
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="feedbackType"
                  value="issue"
                  checked={feedbackType === 'issue'}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                  <FiAlertCircle className="w-4 h-4" />
                  Report Issue
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <FiMessageSquare className="w-4 h-4" /> Feedback Message
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              placeholder={feedbackType === 'approve' 
                ? "Any additional comments about the timetable..."
                : "Please describe the issue you've found..."
              }
              className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 text-sm"
              rows="4"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 rounded-lg font-semibold text-white transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : (feedbackType === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500')}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <FiSend className="mr-2 -ml-1 w-5 h-5" /> 
                Send Feedback
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default FeedbackForm;