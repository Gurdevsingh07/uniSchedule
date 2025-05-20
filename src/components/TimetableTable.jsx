import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBook, FiAlertCircle } from 'react-icons/fi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00'
];

const getCellStyle = (type) => {
  switch (type) {
    case 'faculty':
      return 'bg-green-100 dark:bg-green-800/70 border-green-300 dark:border-green-600';
    case 'student':
      return 'bg-blue-100 dark:bg-blue-800/70 border-blue-300 dark:border-blue-600';
    case 'default':
      return 'bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600';
    default:
      return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  }
};

const TimetableTable = ({ timetable, warnings = [] }) => {
  const slotMap = {};
  if (timetable && typeof timetable === 'object' && Object.keys(timetable).length > 0) {
    Object.keys(timetable).forEach(day => {
      if (Array.isArray(timetable[day])) {
        timetable[day].forEach(entry => {
          if (entry && entry.time) {
            slotMap[`${day}-${entry.time}`] = entry;
          }
        });
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto rounded-xl shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-4"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <FiBook className="w-5 h-5" /> Generated Timetable
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b text-left bg-gray-100 dark:bg-gray-800"></th>
              {DAYS.map(day => (
                <th key={day} className="p-2 border-b text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(time => (
              <tr key={time}>
                <td className="p-2 border-b text-right font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">{time}</td>
                {DAYS.map(day => {
                  const slotKey = `${day}-${time}`;
                  const entry = slotMap[slotKey];
                  return (
                    <td
                      key={slotKey}
                      className={`p-2.5 border text-sm text-center align-top ${getCellStyle(entry?.type)} relative group`}
                    >
                      {entry ? (
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1 justify-center">
                            {entry.subject}
                            {entry.type === 'faculty' && <FiUser className="inline w-4 h-4 text-green-600 dark:text-green-400 ml-1" title="Faculty preference" />}
                            {entry.type === 'student' && <FiUser className="inline w-4 h-4 text-blue-600 dark:text-blue-400 ml-1" title="Student preference" />}
                          </div>
                          {entry.teacher && (
                            <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">{entry.teacher}</div>
                          )}
                          {entry.type === 'default' && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 italic">Free Period</div>
                          )}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 hidden group-hover:block w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 text-xs text-gray-700 dark:text-gray-200">
                            <div><b>Type:</b> {entry.type}</div>
                            {entry.teacher && <div><b>Teacher:</b> {entry.teacher}</div>}
                            {entry.preferenceScore && <div><b>Preference Score:</b> {entry.preferenceScore}</div>}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {warnings.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-start gap-2">
          <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-1" />
          <div>
            <div className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Warnings</div>
            <ul className="list-disc pl-5 text-yellow-700 dark:text-yellow-300 text-sm">
              {warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TimetableTable;