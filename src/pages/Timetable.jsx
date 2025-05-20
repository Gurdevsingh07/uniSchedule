import React, { useState, useEffect, useRef } from 'react';
import { useTimetable } from '../contexts/TimetableContext';
import useIsMobile from '../hooks/useIsMobile';
import TimetableGridMobile from '../components/timetable/TimetableGridMobile';
import TimetableGridModern from '../components/timetable/TimetableGridModern';
import { useTheme } from '../contexts/ThemeContext';
import { FiUpload, FiDownload, FiTrash2, FiX, FiChevronDown, FiChevronUp, FiClock, FiCalendar, FiGrid, FiList, FiRefreshCw, FiSettings, FiUsers, FiBookmark, FiPackage } from 'react-icons/fi';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-hot-toast';

// Animation variants
const heroContainerVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const heroElementVariants = {
  initial: {
    y: 30,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const cardVariants = {
  hidden: {
    y: 50,
    opacity: 0
  },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  })
};

const featureCardVariants = {
  hidden: {
    y: 50,
    opacity: 0
  },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  })
};

// JSON Panel with clean modern design
const JsonPanel = ({ jsonInput, setJsonInput, handleImport, handleExport, handleClear, setShowJsonPanel, isMobile }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }}
      className="relative z-10"
      ref={ref}
    >
      <div className="absolute -inset-2 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-pink-400/10 dark:from-blue-400/20 dark:via-purple-400/10 dark:to-pink-400/20 blur-xl rounded-3xl"></div>
      
      <motion.div
        className="backdrop-blur-md p-6 md:p-8 rounded-2xl border shadow-xl bg-white/90 dark:bg-gray-800/90 border-white/30 dark:border-gray-700/50 relative z-10"
        whileHover={{ y: -5, transition: { duration: 0.3 } }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white shadow-md">
                <FiUpload className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Import/Export Data
              </h3>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Paste your JSON data below to import or export your timetable
            </p>
          </div>
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowJsonPanel(false)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 group shadow-md"
            >
              <FiX className="w-4 h-4 md:w-5 md:h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            </motion.button>
          )}
        </div>

        <div className="relative rounded-xl overflow-hidden group mb-5">
          <textarea
            id="timetableJsonInput"
            name="timetableJsonInput"
            className="w-full p-4 md:p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-white 
                     border-2 border-blue-100/50 dark:border-blue-800/50 focus:border-blue-400 dark:focus:border-blue-500 
                     focus:ring-2 focus:ring-blue-400/30 dark:focus:ring-blue-500/30 transition-all duration-300 
                     min-h-[120px] md:min-h-[150px] font-mono text-xs md:text-sm resize-y rounded-xl
                     outline-none shadow-inner"
            placeholder="Paste your timetable JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck="false"
          />
          
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-blue-400/30 dark:border-blue-400/40 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-blue-400/30 dark:border-blue-400/40 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-blue-400/30 dark:border-blue-400/40 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-blue-400/30 dark:border-blue-400/40 rounded-br-lg pointer-events-none" />
        </div>

        {isMobile ? (
          <div className="mt-4 space-y-4">
            {/* Mobile layout - Load Data and Upload JSON in same row */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImport}
                className="flex-1 relative flex flex-col items-center justify-center gap-2 py-4 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl border-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
                <FiUpload className="w-5 h-5 relative z-10" />
                <div className="px-4 py-1.5 bg-white/25 rounded-lg border border-white/40 shadow-inner relative z-10 transform transition-transform active:scale-95">
                  <span className="drop-shadow-sm">Load Data</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex-1 relative flex flex-col items-center justify-center gap-2 py-4 bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl border-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
                <FiDownload className="w-5 h-5 relative z-10" />
                <div className="px-4 py-1.5 bg-white/25 rounded-lg border border-white/40 shadow-inner relative z-10 transform transition-transform active:scale-95">
                  <span className="drop-shadow-sm">Upload JSON</span>
                </div>
              </motion.button>
            </div>

            {/* Clear button in separate row */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClear}
              className="w-full relative flex items-center justify-center gap-2 py-3.5 bg-gradient-to-br from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl border-0"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Clear</span>
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4">
            {/* Desktop layout */}
            <motion.button
              whileHover={{ y: -3, scale: 1.03, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={handleImport}
              className="relative flex items-center justify-center gap-2 px-4 py-3 md:px-4 md:py-3 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-white font-semibold text-base rounded-2xl shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all duration-300 group overflow-hidden"
            >
              <FiUpload className="w-5 h-5" />
              <span>Import</span>
              {/* Shine effect */}
              <span className="absolute left-0 top-0 w-full h-full pointer-events-none">
                <span className="block w-1/3 h-full bg-white/30 blur-lg opacity-0 group-hover:opacity-80 animate-shine" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ y: -3, scale: 1.03, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="relative flex items-center justify-center gap-2 px-4 py-3 md:px-4 md:py-3 bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-500 text-white font-semibold text-base rounded-2xl shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition-all duration-300 group overflow-hidden"
            >
              <FiDownload className="w-5 h-5" />
              <span>Export</span>
              {/* Shine effect */}
              <span className="absolute left-0 top-0 w-full h-full pointer-events-none">
                <span className="block w-1/3 h-full bg-white/30 blur-lg opacity-0 group-hover:opacity-80 animate-shine" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ y: -3, scale: 1.03, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClear}
              className="relative flex items-center justify-center gap-2 px-4 py-3 md:px-4 md:py-3 bg-gradient-to-br from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600 text-white font-semibold text-base rounded-2xl shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 transition-all duration-300 group overflow-hidden"
            >
              <FiTrash2 className="w-5 h-5" />
              <span>Clear</span>
              {/* Shine effect */}
              <span className="absolute left-0 top-0 w-full h-full pointer-events-none">
                <span className="block w-1/3 h-full bg-white/30 blur-lg opacity-0 group-hover:opacity-80 animate-shine" />
              </span>
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Features section component
const FeaturesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: <FiCalendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Organize your classes with our intelligent scheduling system.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Teacher Management",
      description: "Keep track of teachers and their assigned subjects.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiBookmark className="w-6 h-6" />,
      title: "Subject Organization",
      description: "Group and organize subjects by department or curriculum.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <FiPackage className="w-6 h-6" />,
      title: "Easy Import/Export",
      description: "Seamlessly import and export your timetable data.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-10 md:py-16">
      <div ref={ref} className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Timetable Management Features
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Everything you need to keep your classes organized
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={featureCardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
              }}
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-3`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Timetable component
const Timetable = () => {
  const { timetableData, addEntry, deleteEntry, clearTimetable, setTimetableData } = useTimetable();
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  const [showGrid, setShowGrid] = useState(true);
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonPanel, setShowJsonPanel] = useState(false);
  
  // Animation controls
  const mainControls = useAnimation();
  const [pageRef, pageInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Start animations when page comes into view
  useEffect(() => {
    if (pageInView) {
      mainControls.start("animate");
    }
  }, [pageInView, mainControls]);

  // Form validation logic
  const validateTimetableData = (data) => {
    if (!Array.isArray(data)) {
      throw new Error('Invalid timetable format: Data must be an array');
    }

    // Check each entry in the array
    data.forEach((entry, index) => {
      if (!entry || typeof entry !== 'object') {
        throw new Error(`Invalid entry at position ${index}: Must be an object`);
      }

      // Add validation for required fields
      const requiredFields = ['day', 'startTime', 'endTime', 'subject'];
      requiredFields.forEach(field => {
        if (!entry[field]) {
          throw new Error(`Missing required field "${field}" at position ${index}`);
        }
      });
    });

    return true;
  };

  // CRUD Operations
  const handleImport = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      validateTimetableData(parsedData);
      setTimetableData(parsedData);
      setJsonInput('');
      toast.success('Timetable data imported successfully!');
      
      if (isMobile) {
        setShowGrid(true);
      }
    } catch (error) {
      toast.error(`Import failed: ${error.message}`);
      console.error('Import error:', error);
    }
  };

  const handleExport = () => {
    try {
      const jsonData = JSON.stringify(timetableData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'timetable.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Timetable exported successfully!');
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
      console.error('Export error:', error);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all timetable data? This action cannot be undone.')) {
      try {
        clearTimetable();
        setJsonInput('');
        toast.success('Timetable cleared successfully!');
      } catch (error) {
        toast.error(`Failed to clear timetable: ${error.message}`);
        console.error('Clear error:', error);
      }
    }
  };

  // --- DEV PANEL for localStorage logic (hidden unless ?devpanel=1 in URL) ---
  const [devPanel, setDevPanel] = useState(false);
  useEffect(() => {
    if (window.location.search.includes('devpanel=1')) setDevPanel(true);
  }, []);
  const {
    savePreference, getAllPreferences, clearPreferences,
    saveFeedback, getAllFeedback, clearFeedback,
    setFinalized, isFinalized, setApproved, isApproved
  } = useTimetable();

  // Example handlers for dev panel
  const handleTestPreference = () => savePreference('user1', { day: 'Monday', time: '9:00', subject: 'Math' });
  const handleTestFeedback = () => saveFeedback('faculty1', { approved: true, notes: 'Looks good!' });
  const handleFinalize = () => setFinalized(true);
  const handleApprove = () => setApproved(true);

  return (
    <motion.div
      ref={pageRef} 
      className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-16 sm:pb-20"
      initial="initial"
      animate={mainControls}
      variants={heroContainerVariants}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-purple-500/10" />
      
      {/* Flying particles in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%` 
            }}
            animate={{ 
              opacity: [0, 0.4, 0], 
              scale: [0.5, 1, 0.5],
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 2
            }}
            className={`absolute w-${Math.floor(Math.random() * 8) + 2} h-${Math.floor(Math.random() * 8) + 2} rounded-full ${
              i % 2 === 0 
                ? "bg-blue-400/10 dark:bg-blue-400/20" 
                : "bg-purple-400/10 dark:bg-purple-400/20"
            } blur-sm`}
          />
        ))}
      </div>
      
      {/* Hero Section Header */}
      <section className="relative pt-12 pb-10 md:pt-16 md:pb-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div 
            variants={heroElementVariants}
            className="text-center"
          >
            <motion.h1 
              variants={heroElementVariants}
              className="text-3xl md:text-4xl font-bold mb-3"
            >
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                College Timetable
              </span>
            </motion.h1>
            <motion.p 
              variants={heroElementVariants}
              className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto"
            >
              Manage your classes and schedule efficiently with our smart timetable system
            </motion.p>
          </motion.div>
        </div>
      </section>
      
      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {isMobile ? (
          <>
            {/* Mobile tab navigation */}
            <motion.div 
              variants={heroElementVariants}
              className="mb-5 flex justify-center"
            >
              <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-inner">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowGrid(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    showGrid 
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="w-3.5 h-3.5" />
                    Timetable
                  </span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowGrid(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    !showGrid 
                      ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FiUpload className="w-3.5 h-3.5" />
                    Load Data / Upload JSON
                  </span>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Mobile content based on active tab */}
            <AnimatePresence mode="wait">
              {showGrid ? (
                <motion.div
                  key="timetable-grid"
                  variants={cardVariants}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <TimetableGridMobile
                    data={timetableData}
                    onInsert={addEntry}
                    onDelete={deleteEntry}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="json-panel"
                  variants={cardVariants}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                >
                  <JsonPanel
                    jsonInput={jsonInput}
                    setJsonInput={setJsonInput}
                    handleImport={handleImport}
                    handleExport={handleExport}
                    handleClear={handleClear}
                    setShowJsonPanel={setShowJsonPanel}
                    isMobile={isMobile}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            {/* Desktop layout */}
            <motion.div 
              variants={heroElementVariants}
              className="flex justify-end mb-5"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowJsonPanel(!showJsonPanel)}
                className="relative flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all duration-300 group overflow-hidden text-base md:text-lg"
                aria-label={showJsonPanel ? 'Hide JSON Panel' : 'Show JSON Panel'}
              >
                <FiUpload className="w-5 h-5 md:w-6 md:h-6" />
                <span>{showJsonPanel ? 'Hide Data Panel' : 'Load/Export Data (JSON)'}</span>
                {/* Shine effect */}
                <span className="absolute left-0 top-0 w-full h-full pointer-events-none">
                  <span className="block w-1/3 h-full bg-white/30 blur-lg opacity-0 group-hover:opacity-80 animate-shine" />
                </span>
              </motion.button>
            </motion.div>

            {/* Desktop timetable grid */}
            <motion.div
              variants={cardVariants}
              custom={0}
              initial="hidden"
              animate="visible"
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-gray-200/50 dark:border-gray-700/50 mb-8"
            >
              <TimetableGridModern
                data={timetableData}
                onInsert={addEntry}
                onDelete={deleteEntry}
                showTimeColumn={true}
              />
            </motion.div>

            {/* JSON panel (toggleable) */}
            <AnimatePresence>
              {showJsonPanel && (
                <JsonPanel
                  jsonInput={jsonInput}
                  setJsonInput={setJsonInput}
                  handleImport={handleImport}
                  handleExport={handleExport}
                  handleClear={handleClear}
                  setShowJsonPanel={setShowJsonPanel}
                  isMobile={isMobile}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
      
      {/* Features Section */}
      <FeaturesSection />

      {devPanel && (
        <div style={{position:'fixed',bottom:0,right:0,background:'#fff',border:'1px solid #ccc',zIndex:9999,padding:12,maxWidth:350}}>
          <b>DEV PANEL (localStorage test)</b>
          <div><button onClick={handleTestPreference}>Save Test Preference</button></div>
          <div><button onClick={handleTestFeedback}>Save Test Feedback</button></div>
          <div><button onClick={handleFinalize}>Set Finalized</button></div>
          <div><button onClick={handleApprove}>Set Approved</button></div>
          <div style={{fontSize:12,marginTop:8}}>
            <div>Preferences: <pre>{JSON.stringify(getAllPreferences(),null,2)}</pre></div>
            <div>Feedback: <pre>{JSON.stringify(getAllFeedback(),null,2)}</pre></div>
            <div>Finalized: {String(isFinalized())}</div>
            <div>Approved: {String(isApproved())}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Timetable;
