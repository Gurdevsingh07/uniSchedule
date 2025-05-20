import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiAlertCircle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { useTimetable } from '../contexts/TimetableContext';

const TimetableGenerator = () => {
  const { 
    getAllPreferences, 
    generateTimetable, 
    addNotification,
    isFinalized,
    setFinalized,
    isApproved,
    setApproved,
    currentUser
  } = useTimetable();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStatus('generating');
    setWarnings([]);

    try {
      const preferences = getAllPreferences();
      const { timetable, errors } = await generateTimetable(preferences);
      
      if (errors && errors.length > 0) {
        setWarnings(errors);
        setGenerationStatus('warning');
        addNotification({
          type: 'warning',
          title: 'Generation Complete with Warnings',
          message: `${errors.length} issues found during generation.`,
          timestamp: new Date().toISOString()
        }, currentUser?.id);
      } else {
        setGenerationStatus('success');
        addNotification({
          type: 'success',
          title: 'Timetable Generated',
          message: 'New timetable has been generated successfully.',
          timestamp: new Date().toISOString()
        }, currentUser?.id);
      }
    } catch (error) {
      setGenerationStatus('error');
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: error.message,
        timestamp: new Date().toISOString()
      }, currentUser?.id);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalize = () => {
    setFinalized(true);
    addNotification({
      type: 'success',
      title: 'Timetable Finalized',
      message: 'The timetable has been finalized and sent for faculty approval.',
      timestamp: new Date().toISOString()
    }, currentUser?.id);
  };

  const handleApprove = () => {
    setApproved(true);
    addNotification({
      type: 'success',
      title: 'Timetable Approved',
      message: 'The timetable has been approved and is now live.',
      timestamp: new Date().toISOString()
    }, currentUser?.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Timetable Generation
        </h2>
        <div className="flex items-center gap-2">
          {isFinalized() && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Finalized
            </span>
          )}
          {isApproved() && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Approved
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Generation Controls */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isFinalized()}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white
              ${isGenerating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : isFinalized()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              } transition-colors duration-200`}
          >
            {isGenerating ? (
              <>
                <FiRefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FiSettings className="w-5 h-5" />
                Generate Timetable
              </>
            )}
          </button>

          {generationStatus === 'success' && !isFinalized() && (
            <button
              onClick={handleFinalize}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold
                bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
            >
              <FiCheckCircle className="w-5 h-5" />
              Finalize Timetable
            </button>
          )}

          {isFinalized() && !isApproved() && (
            <button
              onClick={handleApprove}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold
                bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              <FiCheckCircle className="w-5 h-5" />
              Approve Timetable
            </button>
          )}
        </div>

        {/* Warnings Display */}
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Generation Warnings
                </h3>
                <ul className="mt-2 space-y-2">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Messages */}
        {generationStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-1" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  Generation Failed
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  There was an error generating the timetable. Please try again.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TimetableGenerator; 