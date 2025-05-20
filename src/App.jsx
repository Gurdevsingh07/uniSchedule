import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TimetableProvider, useTimetable } from './contexts/TimetableContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Teachers from './pages/Teachers'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AnimatePresence, motion } from 'framer-motion'
import { FiUpload, FiDownload, FiChevronDown } from 'react-icons/fi';
import NotificationCenter from './components/NotificationCenter';
import TimetableGridModern from './components/timetable/TimetableGridModern'
import JsonInputPanel from './components/timetable/JsonInputPanel'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard'
import FacultyDashboard from './pages/FacultyDashboard'

// Modern, animated, card-based Timetable Page
const TimetablePage = () => {
  const { timetableData, addEntry, deleteEntry, importData } = useTimetable()
  const [jsonInput, setJsonInput] = useState('');
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [importError, setImportError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load timetable from JSON input
  const handleLoadJson = async () => {
    setIsLoading(true);
    setImportError('');
    try {
      // Add artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      const parsed = JSON.parse(jsonInput)
      if (Array.isArray(parsed)) {
        // Validate each entry has required fields
        const requiredFields = ['day', 'time', 'subject', 'teacher', 'room'];
        const invalidEntries = parsed.filter(
          entry => !requiredFields.every(field => entry[field])
        );
        if (invalidEntries.length > 0) {
          setImportError(`Invalid entry data: ${JSON.stringify(invalidEntries, null, 2)}`);
          return;
        }
        importData({ timetable: parsed })
        setJsonInput('')
      } else {
        setImportError('JSON must be an array of timetable entries.');
      }
    } catch (e) {
      setImportError('Invalid JSON format. Please check your input.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileUpload = (e) => {
    setImportError('');
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (Array.isArray(parsed)) {
          const requiredFields = ['day', 'time', 'subject', 'teacher', 'room'];
          const invalidEntries = parsed.filter(
            entry => !requiredFields.every(field => entry[field])
          );
          if (invalidEntries.length > 0) {
            setImportError(`Invalid entry data: ${JSON.stringify(invalidEntries, null, 2)}`);
            return;
          }
          importData({ timetable: parsed })
          setJsonInput(event.target.result)
        } else {
          setImportError('JSON must be an array of timetable entries.');
        }
      } catch (err) {
        setImportError('Invalid JSON file.');
      }
    }
    reader.readAsText(file)
  }

  const handleSampleData = () => {
    const sampleData = [
      {
        "day": "Monday",
        "time": "09:00 AM",
        "subject": "Mathematics",
        "teacher": "Dr. Smith",
        "room": "101"
      }
    ];
    setJsonInput(JSON.stringify(sampleData, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Enhanced Mobile View */}
      <div className="lg:hidden space-y-4 px-4 py-6">
        {/* Input Form Toggle Button */}
        <button
          onClick={() => setShowMobileForm(prev => !prev)}
          className="w-full flex items-center justify-between p-4 
            bg-gradient-to-r from-white/90 to-gray-50/90 
            dark:from-gray-800/90 dark:to-gray-900/90 
            rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800
            transition-all duration-300 hover:shadow-xl"
        >
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {showMobileForm ? 'Hide Input Form' : 'Import Timetable Data'}
          </span>
          <FiChevronDown
            className={`transform transition-transform duration-300 text-gray-600 dark:text-gray-300
              ${showMobileForm ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Enhanced Mobile Input Form */}
        {showMobileForm && (
          <div className="animate-in slide-in-from-top duration-300">
            <div className="p-5 space-y-4 bg-gradient-to-br from-white/95 to-gray-50/95 
              dark:from-gray-800/95 dark:to-gray-900/95 
              rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">

              {/* JSON Input Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg
                      bg-gray-100 dark:bg-gray-700 
                      hover:bg-gray-200 dark:hover:bg-gray-600
                      transition-colors"
                  >
                    {showPreview ? 'Edit Mode' : 'Preview Mode'}
                  </button>
                  <button
                    onClick={handleSampleData}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg
                      bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                      hover:bg-blue-100 dark:hover:bg-blue-900/50
                      transition-colors"
                  >
                    Load Sample
                  </button>
                </div>
              </div>

              {/* JSON Input/Preview */}
              {showPreview ? (
                <div className="relative rounded-xl overflow-hidden">
                  <pre className="p-4 bg-gray-50 dark:bg-gray-900 
                    border border-gray-200 dark:border-gray-700
                    overflow-x-auto text-xs">
                    <code className="text-gray-800 dark:text-gray-200">
                      {jsonInput ? JSON.stringify(JSON.parse(jsonInput), null, 2) : 'No data'}
                    </code>
                  </pre>
                </div>
              ) : (
                <textarea
                  className="w-full p-4 font-mono text-sm
                    border border-gray-200 dark:border-gray-700 
                    rounded-xl bg-white/50 dark:bg-gray-800/50 
                    text-gray-900 dark:text-white backdrop-blur-sm
                    shadow-inner focus:ring-2 focus:ring-primary-200 
                    dark:focus:ring-primary-900 transition-all
                    placeholder-gray-400 dark:placeholder-gray-500"
                  rows={6}
                  placeholder="Paste your timetable JSON data here..."
                  value={jsonInput}
                  onChange={e => setJsonInput(e.target.value)}
                />
              )}

              {/* Enhanced Error Display */}
              {importError && (
                <div className="animate-in fade-in slide-in-from-top duration-300
                  mt-3 p-3 bg-red-50 dark:bg-red-900/20 
                  border border-red-100 dark:border-red-800
                  rounded-xl text-red-600 dark:text-red-400">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <p className="font-medium text-sm">Error importing data</p>
                  </div>
                  <p className="text-xs whitespace-pre-wrap break-all pl-6">{importError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex gap-4 relative">
                  {/* Decorative effect behind buttons */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/5 via-accent-500/5 to-primary-500/5 dark:from-primary-400/10 dark:via-accent-400/10 dark:to-primary-400/10 rounded-2xl blur-xl"></div>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                    }}
                    whileTap={{ 
                      scale: 0.95, 
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                      y: 0 
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15
                    }}
                    disabled={isLoading}
                    onClick={handleLoadJson}
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-3.5
                      bg-gradient-to-r from-primary-600 to-accent-600 
                      dark:from-primary-500 dark:to-accent-500
                      text-white font-semibold rounded-xl 
                      shadow-lg relative z-10
                      transition-all duration-300 transform overflow-hidden group
                      ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : (
                      <>
                        {/* Inner button light effects */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-500 transform rotate-12 scale-150 pointer-events-none"></div>
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/0 via-white/40 to-white/0"></div>
                        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/10"></div>
                        
                        <motion.div
                          whileHover={{ y: -1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                          <FiDownload className="w-5 h-5" />
                        </motion.div>
                        <span className="text-sm md:text-base tracking-wide relative z-10">Load Data</span>
                      </>
                    )}
                  </motion.button>

                  <motion.label
                    htmlFor="json-file-upload" 
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)" 
                    }}
                    whileTap={{ 
                      scale: 0.95, 
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      y: 0 
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15
                    }}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-3.5
                      border-2 border-primary-600 dark:border-primary-400 
                      text-primary-600 dark:text-primary-400 font-semibold tracking-wide
                      hover:bg-primary-50 dark:hover:bg-primary-900/20 
                      rounded-xl relative z-10
                      shadow-sm
                      transition-all duration-300 transform
                      cursor-pointer overflow-hidden group"
                  >
                    {/* Inner button light effects */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-500 transform rotate-12 scale-150 pointer-events-none"></div>
                    <div className="absolute inset-x-0 top-0 h-px bg-primary-400/20 dark:bg-primary-300/10"></div>
                    
                    <motion.div
                      whileHover={{ y: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <FiUpload className="w-5 h-5" />
                    </motion.div>
                    <span className="text-sm md:text-base relative z-10">Upload JSON</span>
                    <input
                      type="file"
                      id="json-file-upload"
                      name="json-file-upload"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={handleFileUpload}
                      aria-label="Upload JSON file"
                    />
                  </motion.label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Timetable Grid */}
        <div className="bg-gradient-to-br from-white/95 to-gray-50/95 
          dark:from-gray-800/95 dark:to-gray-900/95 
          rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 
          overflow-hidden">
          <div className="relative px-6 py-5 overflow-hidden
            bg-gradient-to-r from-emerald-600 via-purple-500 to-blue-500
            dark:from-fuchsia-900 dark:via-purple-800 dark:to-blue-900
            motion-safe:bg-[size:200%_200%]
            motion-safe:dark:bg-[size:200%_200%]
            motion-safe:animate-gradient-x
            [transition:all_1.5s_cubic-bezier(0.4,0,0.2,1)]
            after:absolute after:inset-0 
            after:bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent)]
            after:opacity-0 dark:after:opacity-100
            after:[transition:opacity_2s_ease-in-out]
            before:absolute before:inset-0
            before:bg-gradient-to-r
            before:from-transparent before:via-white/10 before:to-transparent
            before:translate-x-[-100%] dark:before:translate-x-0
            before:[transition:transform_1s_ease-in-out]">
            <div className="absolute inset-0 
              bg-gradient-to-br from-white/10 via-rose-100/5 to-transparent 
              dark:from-black/20 dark:via-violet-500/5 dark:to-transparent 
              opacity-0 dark:opacity-100
              scale-95 dark:scale-100
              [transition:all_1.5s_cubic-bezier(0.4,0,0.2,1)]"></div>
            <div className="relative">
              <h3 className="font-bold text-lg tracking-wide">
                <span className="inline-block text-white/95 dark:text-white/90 
                  drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]
                  dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
                  [transition:all_0.7s_ease-in-out]
                  transform-gpu dark:scale-[1.02]">
                  Your Timetable
                </span>
              </h3>
              <div className="mt-0.5 h-px w-24 
                bg-gradient-to-r from-white/70 via-white/40 to-transparent 
                dark:from-white/50 dark:via-violet-400/30 dark:to-transparent
                [transition:all_0.7s_ease-in-out]
                transform-gpu dark:translate-x-1"></div>
            </div>
          </div>
          <TimetableGridModern
            data={timetableData}
            onInsert={addEntry}
            onDelete={deleteEntry}
            showTimeColumn={false}
          />
        </div>
      </div>

      {/* Enhanced Desktop View */}
      <div className="hidden lg:flex flex-col h-[calc(100vh-5rem)] p-4">
        {/* Main Content Area */}
        <div className="flex gap-4 flex-1">
          {/* Sidebar with Enhanced Input Panel */}
          <div className="w-96 shrink-0 rounded-2xl">
            <div className="h-full bg-gradient-to-br from-white/95 via-white/90 to-gray-50/95 
                  dark:from-dark-900/95 dark:via-dark-800/90 dark:to-dark-900/95 
                  rounded-2xl shadow-xl backdrop-blur-sm 
                  border border-gray-200/30 dark:border-gray-700/30
                  transition-all duration-300 hover:shadow-2xl
                  hover:border-gray-300/40 dark:hover:border-gray-600/40">
              <JsonInputPanel
                jsonInput={jsonInput}
                setJsonInput={setJsonInput}
                onLoadJson={handleLoadJson}
                onFileUpload={handleFileUpload}
                className="h-full"
              />
              {importError && (
                <div className="mx-4 mb-4 p-3 bg-red-50 dark:bg-red-900/20 
                    border border-red-100 dark:border-red-800
                    rounded-xl text-red-600 dark:text-red-400 
                    text-xs whitespace-pre-wrap break-all
                    animate-in fade-in slide-in-from-top duration-300">
                  {importError}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Timetable Area */}
          <div className="flex-1 bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl 
            backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 overflow-hidden">
            <div className="relative px-6 py-5 overflow-hidden
              bg-gradient-to-r from-emerald-600 via-purple-500 to-blue-500
              dark:from-fuchsia-900 dark:via-purple-800 dark:to-blue-900
              motion-safe:bg-[size:200%_200%]
              motion-safe:dark:bg-[size:200%_200%]
              motion-safe:animate-gradient-x
              [transition:all_1.5s_cubic-bezier(0.4,0,0.2,1)]
              after:absolute after:inset-0 
              after:bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent)]
              after:opacity-0 dark:after:opacity-100
              after:[transition:opacity_2s_ease-in-out]
              before:absolute before:inset-0
              before:bg-gradient-to-r
              before:from-transparent before:via-white/10 before:to-transparent
              before:translate-x-[-100%] dark:before:translate-x-0
              before:[transition:transform_1s_ease-in-out]">
              <div className="absolute inset-0 
                bg-gradient-to-br from-white/10 via-rose-100/5 to-transparent 
                dark:from-black/20 dark:via-violet-500/5 dark:to-transparent 
                opacity-0 dark:opacity-100
                scale-95 dark:scale-100
                [transition:all_1.5s_cubic-bezier(0.4,0,0.2,1)]"></div>
              <div className="relative">
                <h3 className="font-bold text-lg tracking-wide">
                  <span className="inline-block text-white/95 dark:text-white/90 
                    drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]
                    dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
                    [transition:all_0.7s_ease-in-out]
                    transform-gpu dark:scale-[1.02]">
                    Timetable Dashboard
                  </span>
                </h3>
                <div className="mt-0.5 h-px w-24 
                  bg-gradient-to-r from-white/70 via-white/40 to-transparent 
                  dark:from-white/50 dark:via-violet-400/30 dark:to-transparent
                  [transition:all_0.7s_ease-in-out]
                  transform-gpu dark:translate-x-1"></div>
              </div>
            </div>
            <div className="h-full">
              <TimetableGridModern
                data={timetableData}
                onInsert={addEntry}
                onDelete={deleteEntry}
                showTimeColumn={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Define possible test users (replace with real user data later)
const testUsers = [
  { id: 'admin1', role: 'admin' },
  { id: 'faculty1', role: 'faculty' },
  { id: 'student1', role: 'student' },
];

const AppContent = () => {
  const { notifications, dismissNotification, currentUser } = useTimetable();

  // State for temporary user selection
  const [selectedUserId, setSelectedUserId] = useState('admin1'); // Default to admin

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <UserSetter userId={selectedUserId} users={testUsers} /> 
          <Layout>
            <NotificationCenter 
              notifications={notifications} 
              onDismiss={dismissNotification} 
              currentUser={currentUser} 
            />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route 
                  path="/timetable" 
                  element={
                    <ProtectedRoute>
                      <TimetablePage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
              </Routes>
            </AnimatePresence>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

function App() {
  return (
    <TimetableProvider>
      <AppContent />
    </TimetableProvider>
  );
}

export default App

// Helper component to set the current user in context
const UserSetter = ({ userId, users }) => {
  const { setCurrentUser } = useTimetable();

  useEffect(() => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      console.log('Current user set to:', user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, users]);

  return null; // This component doesn't render anything visible
};
