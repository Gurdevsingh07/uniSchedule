import React from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiDownload, FiCopy, FiTrash2 } from 'react-icons/fi';

const JsonInputPanel = ({ 
  jsonInput, 
  setJsonInput, 
  onLoadJson, 
  onFileUpload,
  className 
}) => {
  const handleCopyExample = () => {
    const exampleData = [
      {
        id: "1",
        day: "Monday",
        time: "9:00 AM",
        subject: "Mathematics",
        teacher: "Dr. Smith",
        room: "101"
      }
    ];
    setJsonInput(JSON.stringify(exampleData, null, 2));
  };

  const handleClear = () => {
    setJsonInput('');
  };

  return (
    <div className={`flex flex-col shadow-lg rounded-2xl ${className}`}>
      <div className="p-4 md:p-5 border-b border-gray-200/30 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/70 backdrop-blur-sm">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Input JSON Data
        </h2>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button
            onClick={handleCopyExample}
            className="text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg 
              bg-blue-100 dark:bg-blue-900/40 
              text-blue-700 dark:text-blue-300 
              hover:bg-blue-200 dark:hover:bg-blue-800/50 
              transition-all duration-200 font-medium
              flex items-center shadow-sm hover:shadow"
          >
            <FiCopy className="inline-block mr-1.5 w-3.5 h-3.5" />
            Copy Example
          </button>
          <button
            onClick={handleClear}
            className="text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg 
              bg-red-100 dark:bg-red-900/40 
              text-red-700 dark:text-red-300 
              hover:bg-red-200 dark:hover:bg-red-800/50 
              transition-all duration-200 font-medium
              flex items-center shadow-sm hover:shadow"
          >
            <FiTrash2 className="inline-block mr-1.5 w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 md:p-5">
        <div className="relative h-full">
          <textarea
            id="jsonInputField"
            name="jsonInputField"
            className="w-full h-full min-h-[120px] md:min-h-[200px] rounded-xl p-3 md:p-4
              bg-white/90 dark:bg-gray-800/90 
              text-gray-900 dark:text-white 
              border-2 border-gray-200/50 dark:border-gray-700/50
              focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-400/40 
              focus:border-blue-500 dark:focus:border-blue-400
              transition-all duration-200 
              placeholder-gray-400 dark:placeholder-gray-500
              resize-none font-mono text-xs md:text-sm shadow-inner
              outline-none"
            placeholder={`Paste your JSON here...\n\nExample format:\n{\n  "day": "Monday",\n  "time": "9:00 AM",\n  "subject": "Mathematics",\n  "teacher": "Dr. Smith",\n  "room": "101"\n}`}
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            spellCheck="false"
          />
        </div>
      </div>

      <div className="p-4 md:p-5 border-t border-gray-200/30 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="flex flex-row gap-4 relative">
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
            onClick={onLoadJson}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-3.5
              bg-gradient-to-r from-primary-600 to-accent-600 
              hover:from-primary-700 hover:to-accent-700
              dark:from-primary-500 dark:to-accent-500
              dark:hover:from-primary-600 dark:hover:to-accent-600
              text-white font-semibold rounded-xl 
              shadow-lg relative z-10
              transition-all duration-300 transform overflow-hidden group"
          >
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
            <span className="text-sm md:text-base tracking-wide">Load Data</span>
          </motion.button>
          
          <motion.label
            htmlFor="jsonFileUpload"
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
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 
              transition-opacity duration-500 transform rotate-12 scale-150 pointer-events-none"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-primary-400/20 dark:bg-primary-300/10"></div>
            
            <motion.div
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <FiUpload className="w-5 h-5" />
            </motion.div>
            <span className="text-sm md:text-base">Upload JSON</span>
            <input
              type="file"
              id="jsonFileUpload"
              name="jsonFileUpload"
              accept=".json,application/json"
              className="hidden"
              onChange={onFileUpload}
              aria-label="Upload JSON file"
            />
          </motion.label>
        </div>
      </div>
    </div>
  );
};

export default JsonInputPanel;