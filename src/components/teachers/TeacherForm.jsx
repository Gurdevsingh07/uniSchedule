import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiUpload, FiUser, FiMail, FiPhone, FiBookOpen, FiBriefcase, FiPlus } from 'react-icons/fi';

const TeacherForm = ({ onSubmit, onFileUpload }) => {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonData, setJsonData] = useState('');

  // Add global styles for the highlight pulse animation using useEffect
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes highlight-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        50% { box-shadow: 0 0 0 8px rgba(79, 70, 229, 0.2); }
      }
      .highlight-pulse {
        animation: highlight-pulse 1.5s ease-in-out;
      }
    `;

    // Append it to the head
    document.head.appendChild(styleElement);

    // Clean up on component unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        onFileUpload(data);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Invalid JSON file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      id="add-teacher-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          id="manual-entry-btn"
          name="manual-entry-btn"
          onClick={() => setIsJsonMode(false)}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${!isJsonMode
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          aria-pressed={!isJsonMode}
        >
          Manual Entry
        </button>
        <button
          type="button"
          id="json-upload-btn"
          name="json-upload-btn"
          onClick={() => setIsJsonMode(true)}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${isJsonMode
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          aria-pressed={isJsonMode}
        >
          JSON Upload
        </button>
      </div>

      {isJsonMode ? (
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="jsonInput" className="sr-only">JSON Data</label>
            <textarea
              id="jsonInput"
              name="jsonInput"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder="Paste JSON data here..."
              className="w-full min-h-[180px] p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white/50 dark:bg-gray-800/50 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm resize-y"
              aria-label="JSON Data Input"
              autoComplete="off"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              id="import-json-btn"
              name="import-json-btn"
              onClick={() => {
                try {
                  const parsedData = JSON.parse(jsonData);
                  onFileUpload(Array.isArray(parsedData) ? parsedData : [parsedData]);
                  setJsonData('');
                } catch (error) {
                  alert('Invalid JSON format. Please check and try again.');
                }
              }}
              className="py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={!jsonData.trim()}
            >
              <FiUpload className="w-4 h-4" />
              <span>Import JSON</span>
            </motion.button>

            <label htmlFor="jsonFileUpload" className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer">
              <FiUpload className="w-4 h-4" />
              <span>Upload File</span>
              <input
                type="file"
                id="jsonFileUpload"
                name="jsonFileUpload"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload JSON file"
              />
            </label>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Expected JSON Format:
            </h3>
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto bg-white/50 dark:bg-gray-900/50 p-3 rounded-md">
              {`[
                  {
                    "name": "Dr. James Wilson",
                    "department": "Physics",
                    "email": "james.wilson@college.edu",
                    "phone": "+1 (555) 123-4567",
                    "subjects": ["Physics 101", "Quantum Mechanics"]
                  }
              ]`}
            </pre>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FiUser className="inline mr-1" /> Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/50 dark:bg-gray-800/50 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter teacher's name"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FiBriefcase className="inline mr-1" /> Department
            </label>
            <input
              type="text"
              name="department"
              id="department"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/50 dark:bg-gray-800/50 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter department"
              autoComplete="organization"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FiMail className="inline mr-1" /> Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/50 dark:bg-gray-800/50 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter email address"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FiPhone className="inline mr-1" /> Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/50 dark:bg-gray-800/50 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter phone number"
              autoComplete="tel"
            />
          </div>

          <div>
            <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FiBookOpen className="inline mr-1" /> Subjects
            </label>
            <input
              type="text"
              name="subjects"
              id="subjects"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/50 dark:bg-gray-800/50 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter subjects (comma separated)"
              autoComplete="off"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            id="add-teacher-submit"
            name="add-teacher-submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 dark:from-primary-500 dark:to-indigo-500 dark:hover:from-primary-600 dark:hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Teacher</span>
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

export default TeacherForm;