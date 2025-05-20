import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTimetable } from '../contexts/TimetableContext';
import { motion } from 'framer-motion';
import { FiDatabase, FiUsers, FiCheckCircle, FiClipboard, FiChevronRight, FiCheck, FiAlertCircle, FiCalendar, FiSettings, FiMessageSquare, FiUploadCloud, FiEye, FiEdit2, FiTrash2, FiXCircle, FiBell, FiUserCheck, FiBarChart2, FiX } from 'react-icons/fi'; 
import { validateTimetable } from '../utils/timetableGenerator';
import TimetableGenerator from '../components/TimetableGenerator';
import PreferenceForm from '../components/PreferenceForm';
import FeedbackForm from '../components/FeedbackForm';
import NotificationCenter from '../components/NotificationCenter';
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

const cardStyle = "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300";
const sectionTitleStyle = "text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4"; 

const AdminDashboard = () => {
  const {
    timetableData,
    generateTimetable: generateTimetableFromContext, 
    finalizeTimetable, 
    unfinalizeTimetable, 
    isFinalized, 
    approveTimetable, 
    unapproveTimetable, 
    isApproved, 
    facultyPreferences,
    studentPreferences,
    feedback,
    clearPreferences,
    clearAllFeedback, 
    generationWarnings,
    currentUser, 
    notifications = [], 
    dismissNotification, 
    storeUploadedSchedule,
    addNotification,
    fetchAdminTimetable,
  } = useTimetable();

  const [collected, setCollected] = useState(false); 
  const [timetableGenerated, setTimetableGenerated] = useState(false); 
  const [uploadedJsonData, setUploadedJsonData] = useState(null); 
  const [uploadStatus, setUploadStatus] = useState(null); 
  const [activeTab, setActiveTab] = useState('timetable'); 

  const [selectedFeedbackItem, setSelectedFeedbackItem] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          console.log('Uploaded JSON data:', jsonData);

          if (jsonData && Array.isArray(jsonData.unscheduledClasses)) {
            storeUploadedSchedule(jsonData.unscheduledClasses);
            addNotification({ type: 'success', title: 'File Uploaded', message: `${file.name} has been uploaded and data stored.` }, currentUser?.id);
            setUploadedJsonData(jsonData); 
            setUploadStatus({ message: 'File loaded and data stored. Ready to be used in generation.', isError: false });
          } else {
            console.error('Uploaded JSON does not contain a valid unscheduledClasses array.', jsonData);
            addNotification({ type: 'error', title: 'Upload Error', message: `Uploaded file ${file.name} does not contain a valid 'unscheduledClasses' array.` }, currentUser?.id);
            storeUploadedSchedule([]); 
            setUploadedJsonData(null);
            setUploadStatus({ message: 'Error: JSON must contain a valid unscheduledClasses array.', isError: true });
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          addNotification({ type: 'error', title: 'Parsing Error', message: `Could not parse ${file.name}. Check format.` }, currentUser?.id);
          setUploadedJsonData(null);
          storeUploadedSchedule([]);
          setUploadStatus({ message: 'Error parsing JSON file. Please check the format.', isError: true });
        }
      };
      reader.readAsText(file);
    } else {
      addNotification({ type: 'warning', title: 'Invalid File', message: 'Please upload a valid .json file.' }, currentUser?.id);
      setUploadedJsonData(null);
      setUploadStatus({ message: 'Please upload a valid .json file.', isError: true });
    }
  };

  const handleGenerateTimetable = async () => {
    const allPreferences = { faculty: facultyPreferences, student: studentPreferences };
    generateTimetableFromContext(allPreferences); 
    setTimetableGenerated(true); 
    addNotification({ type: 'info', title: 'Generation Started', message: 'Timetable generation process has been initiated.' }, currentUser?.id);
  };

  const allPrefsCollected = 
    Object.keys(facultyPreferences || {}).length > 0 && 
    Object.values(facultyPreferences || {}).every(p => p.day && p.time && p.subject) && 
    Object.keys(studentPreferences || {}).length > 0 && 
    Object.values(studentPreferences || {}).every(p => p.day && p.time && p.subject);

  const allFacultyApproved = 
    (feedback || []).filter(fb => fb.type === 'approve').length > 0 && 
    (feedback || []).filter(fb => fb.type === 'approve').length === Object.keys(facultyPreferences || {}).length; 

  const workflowSteps = [
    {
      key: 'collect',
      title: 'Collect Preferences',
      icon: <FiClipboard className="w-5 h-5" />, 
      color: 'from-blue-500 to-cyan-500',
      statusText: collected ? 'Completed' : 'Pending',
      action: (
        <button 
          className="mt-3 px-4 py-2 w-full rounded text-sm bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-1" 
          onClick={() => setCollected(true)} 
          disabled={Boolean(collected || !allPrefsCollected)}
        >
          {collected ? <><FiCheck /> Collected</> : 'Mark as Collected'}
        </button>
      ),
      badgeClass: collected ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    },
    {
      key: 'finalize',
      title: 'Finalize Input Data',
      icon: <FiDatabase className="w-5 h-5" />, 
      color: 'from-green-500 to-emerald-500',
      statusText: isFinalized ? 'Data Finalized' : (collected ? 'Ready to Finalize' : 'Pending Previous Step'),
      action: (
        <div className="mt-3 space-y-2">
          {!isFinalized ? (
            <button 
              className="px-4 py-2 w-full rounded text-sm bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-1"
              onClick={finalizeTimetable} 
              disabled={Boolean(!collected)}
            >
              Finalize Data
            </button>
          ) : (
            <button 
              className="px-4 py-2 w-full rounded text-sm bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition disabled:opacity-50 flex items-center justify-center gap-1"
              onClick={unfinalizeTimetable} 
              disabled={Boolean(!isFinalized || isApproved)} 
            >
              Unfinalize Data
            </button>
          )}
        </div>
      ),
      badgeClass: isFinalized ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' : (collected ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-yellow-100' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'),
    },
    {
      key: 'approve',
      title: 'Faculty Approval & Timetable Lock',
      icon: <FiUserCheck className="w-5 h-5" />, 
      color: 'from-purple-500 to-pink-500',
      statusText: isApproved ? 'Timetable Approved & Locked' : (isFinalized ? 'Ready for Approval' : 'Pending Previous Step'),
      action: (
        <div className="mt-3 space-y-2">
          {!isApproved ? (
            <button 
              className="px-4 py-2 w-full rounded text-sm bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-1" 
              onClick={approveTimetable} 
              disabled={Boolean(!isFinalized)} 
            >
              Approve Timetable
            </button>
          ) : (
            <button 
              className="px-4 py-2 w-full rounded text-sm bg-pink-500 text-white font-semibold hover:bg-pink-600 transition disabled:opacity-50 flex items-center justify-center gap-1"
              onClick={unapproveTimetable} 
              disabled={Boolean(!isApproved)} 
            >
              Unlock & Unapprove
            </button>
          )}
        </div>
      ),
      badgeClass: isApproved ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 whitespace-normal text-center' : (isFinalized ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-yellow-100' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'),
    },
  ];

  const handleOpenFeedbackModal = (feedbackItem) => {
    setSelectedFeedbackItem(feedbackItem);
    setIsFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedFeedbackItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <header className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent"
        >
          Admin Dashboard
        </motion.h1>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            <motion.div className={cardStyle} variants={cardVariants} initial="hidden" animate="visible" custom={0}>
              <h2 className={sectionTitleStyle}>Timetable Workflow</h2>
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <motion.div 
                    key={step.key} 
                    className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm`}
                    variants={cardVariants}
                    custom={index * 0.2} 
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className={`p-2 rounded-full bg-gradient-to-br ${step.color} text-white mr-3`}>{step.icon}</span>
                        <h3 className="font-medium text-gray-900 dark:text-white">{step.title}</h3>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${step.badgeClass}`}>{step.statusText}</span>
                    </div>
                    {step.action}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className={cardStyle} variants={cardVariants} initial="hidden" animate="visible" custom={1}>
              <h2 className={sectionTitleStyle}>Manage Timetable Data</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="jsonUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload JSON Schedule:</label>
                  <input 
                    type="file" 
                    id="jsonUpload"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-700/80 file:text-primary-700 dark:file:text-primary-200 hover:file:bg-primary-100 dark:hover:file:bg-primary-600 transition-colors duration-200 cursor-pointer"
                  />
                  {uploadStatus && (
                    <div className={`mt-2.5 p-3 rounded-md text-sm ${uploadStatus.isError ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200'}`}>
                      <span className="flex items-center">
                        {uploadStatus.isError ? <FiAlertCircle className="mr-2 h-5 w-5"/> : <FiCheckCircle className="mr-2 h-5 w-5"/>}
                        {uploadStatus.message}
                      </span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleGenerateTimetable}
                  disabled={!uploadedJsonData && !allPrefsCollected} 
                  className="w-full px-4 py-2.5 rounded-md bg-accent-500 text-white font-semibold hover:bg-accent-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiCalendar className="w-5 h-5"/> Generate Timetable
                </button>
              </div>
            </motion.div>

            <motion.div className={cardStyle} variants={cardVariants} initial="hidden" animate="visible" custom={2}>
              <h2 className={sectionTitleStyle}>Admin Tools</h2>
              <div className="space-y-3">
                <button onClick={clearPreferences} className="w-full px-4 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
                  <FiSettings className="w-4 h-4"/> Clear All Preferences
                </button>
                <button onClick={clearAllFeedback} className="w-full px-4 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
                  <FiMessageSquare className="w-4 h-4"/> Clear All Feedback
                </button>
              </div>
            </motion.div>

          </div> 

          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Tab Navigation Card */}
            <motion.div className={`${cardStyle} p-0`} variants={cardVariants} initial="hidden" animate="visible" custom={0.5}>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {['timetable', 'preferences', 'feedback', 'notifications'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 sm:px-6 font-medium text-sm capitalize transition-colors duration-150
                      ${activeTab === tab 
                        ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    {tab.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content Card */}
            <motion.div className={cardStyle} variants={cardVariants} initial="hidden" animate="visible" custom={1}>
              {activeTab === 'timetable' && (
                <div>
                  <h2 className={sectionTitleStyle}>Generated Timetable</h2>
                  {(() => {
                    console.log('AdminDashboard - timetableData:', timetableData);
                    return timetableData && Object.keys(timetableData).length > 0 ? (
                      <TimetableTable timetable={timetableData} warnings={generationWarnings} />
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 italic">Timetable has not been generated or is currently empty. Upload data and use 'Generate Timetable'.</p>
                    );
                  })()}
                  {generationWarnings && generationWarnings.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200">
                      <h3 className="font-bold flex items-center"><FiAlertCircle className="mr-2" />Generation Warnings:</h3>
                      <ul className="list-disc list-inside text-sm mt-1 pl-5">
                        {generationWarnings.map((warning, index) => (
                          <li key={index}>{warning.message || JSON.stringify(warning)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className={sectionTitleStyle}>Manage & View Preferences</h2>
                  
                  {/* Section to display Faculty Preferences */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3">Faculty Preferences:</h3>
                    {facultyPreferences && Object.keys(facultyPreferences).length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {Object.entries(facultyPreferences).map(([facultyId, pref]) => (
                          <div key={facultyId} className="p-3.5 bg-gray-50 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                              <strong>Faculty ID: {facultyId}</strong> (Type: {pref.type || 'N/A'})
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1 pl-5">
                              <li>Subject: {pref.subject || 'Not set'}</li>
                              <li>Day: {pref.day || 'Not set'}</li>
                              <li>Time: {pref.time || 'Not set'}</li>
                              {pref.room && <li>Room: {pref.room}</li>}
                              {pref.notes && <li className="whitespace-pre-wrap">Notes: {pref.notes}</li>}
                            </ul>
                            {pref.timestamp && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                                Submitted: {new Date(pref.timestamp).toLocaleString()}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">No faculty preferences submitted yet.</p>
                    )}
                  </div>

                  {/* Section to display Student Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3">Student Preferences:</h3>
                    {studentPreferences && Object.keys(studentPreferences).length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {Object.entries(studentPreferences).map(([studentId, pref]) => (
                          <div key={studentId} className="p-3.5 bg-gray-50 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                              <strong>Student ID: {studentId}</strong> (Type: {pref.type || 'N/A'})
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1 pl-5">
                              <li>Subject: {pref.subject || 'Not set'}</li>
                              <li>Day: {pref.day || 'Not set'}</li>
                              <li>Time: {pref.time || 'Not set'}</li>
                              {pref.course && <li>Course: {pref.course}</li>}
                              {pref.notes && <li className="whitespace-pre-wrap">Notes: {pref.notes}</li>}
                            </ul>
                            {pref.timestamp && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                                Submitted: {new Date(pref.timestamp).toLocaleString()}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">No student preferences submitted yet.</p>
                    )}
                  </div>
                  
                  {/* Admin can still use PreferenceForm if needed, e.g., to submit on behalf of someone */}
                  {/* Consider if this form needs different props when used by an admin */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Submit/Edit Preference (Admin):</h3>
                     <PreferenceForm 
                        userId={currentUser?.id} 
                        role="admin" // Or some other prop to indicate admin context
                     />
                  </div>
                </div>
              )}
              {activeTab === 'feedback' && (
                <div>
                  <h2 className={sectionTitleStyle}>User Feedback</h2>
                  {/* The FeedbackForm is for submitting feedback. We need to display existing feedback here. */}
                  {/* For now, let's list the feedback items. Consider a dedicated component later. */}
                  <FeedbackForm 
                    submitterId={currentUser?.id}
                    submitterName={currentUser?.displayName || 'Admin'}
                  /> 
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3">Submitted Feedback:</h3>
                  {feedback && feedback.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {feedback.map((fb, index) => (
                        <div 
                          key={fb.id || index} 
                          className="p-3.5 bg-gray-50 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleOpenFeedbackModal(fb)} // Open modal on click
                        >
                          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                            <strong>{fb.userName || fb.userId || 'Anonymous'}</strong> ({fb.type || 'General'}):
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">{fb.message || fb.text}</p>
                          {fb.timestamp && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                              {/* Display timestamp as string directly if it's already formatted, or convert if it's a Date/Firestore Timestamp */}
                              {typeof fb.timestamp === 'string' ? new Date(fb.timestamp).toLocaleString() : fb.timestamp?.toDate ? fb.timestamp.toDate().toLocaleString() : 'No timestamp'}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No feedback submitted yet.</p>
                  )}
                </div>
              )}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className={sectionTitleStyle}>Notification Center</h2>
                  <NotificationCenter notifications={notifications} dismissNotification={dismissNotification} />
                </div>
              )}
            </motion.div>
          </div> {/* End Right Column */}
        
        </div>
      </main>

      {/* Feedback Detail Modal */}
      {isFeedbackModalOpen && selectedFeedbackItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }} 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg relative"
          >
            <button 
              onClick={handleCloseFeedbackModal} 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <FiX size={24} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Feedback Details
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300"> 
              <p><strong className="text-gray-800 dark:text-gray-200">From:</strong> {selectedFeedbackItem.userName || selectedFeedbackItem.userId || 'Anonymous'}</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Type:</strong> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedFeedbackItem.type === 'approve' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100'}`}>{selectedFeedbackItem.type || 'General'}</span></p>
              <p><strong className="text-gray-800 dark:text-gray-200">Date:</strong> {selectedFeedbackItem.timestamp?.toDate ? selectedFeedbackItem.timestamp.toDate().toLocaleString() : (typeof selectedFeedbackItem.timestamp === 'string' ? new Date(selectedFeedbackItem.timestamp).toLocaleString() : 'No timestamp')}</p>
              <div className="mt-2 pt-2 border-t dark:border-gray-700">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Message:</p>
                <p className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                  {selectedFeedbackItem.message || selectedFeedbackItem.text || 'No message content.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;