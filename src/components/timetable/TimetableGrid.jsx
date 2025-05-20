import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TimetableGrid = ({ data }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [touchStart, setTouchStart] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8); // 8 AM to 5 PM

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextWeek();
      } else {
        handlePrevWeek();
      }
      setTouchStart(null);
    }
  };

  const handlePrevWeek = () => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Timetable Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevWeek}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <h2 className="text-lg font-semibold">
            Week of {currentWeek.toLocaleDateString()}
          </h2>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextWeek}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Timetable Grid */}
        <div 
          className="overflow-x-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="min-w-[768px]">
            <div className="grid grid-cols-6 gap-px bg-gray-200 dark:bg-gray-700">
              {/* Time Column */}
              <div className="bg-gray-50 dark:bg-gray-800 p-2">
                <div className="h-12 flex items-center justify-center font-medium">
                  Time
                </div>
              </div>

              {/* Days Columns */}
              {days.map((day) => (
                <div key={day} className="bg-gray-50 dark:bg-gray-800 p-2">
                  <div className="h-12 flex items-center justify-center font-medium">
                    {day}
                  </div>
                </div>
              ))}

              {/* Time Slots */}
              {timeSlots.map((time) => (
                <>
                  <div key={`time-${time}`} className="bg-gray-50 dark:bg-gray-800 p-2">
                    <div className="h-20 flex items-center justify-center">
                      {time}:00
                    </div>
                  </div>
                  {days.map((day) => (
                    <div 
                      key={`${day}-${time}`} 
                      className="bg-white dark:bg-gray-800 p-2 border-t dark:border-gray-700"
                    >
                      {data?.[day]?.[time] && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="h-full p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30"
                        >
                          <p className="text-sm font-medium">{data[day][time].subject}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {data[day][time].room}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Instructions */}
        <div className="md:hidden p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Swipe left or right to navigate between weeks
        </div>
      </div>
    </div>
  );
};

export default TimetableGrid;