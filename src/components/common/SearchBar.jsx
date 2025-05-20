import { motion } from 'framer-motion';
import { itemFade } from '../../utils/animations';
import { useTimetable } from '../../contexts/TimetableContext'
import { FiSearch, FiFilter } from 'react-icons/fi'

const SearchBar = () => {
  const { searchTerm, setSearchTerm, selectedDay, setSelectedDay } = useTimetable()
  const days = ['All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  return (
    <motion.div
      variants={itemFade}
      initial="initial"
      animate="animate" 
      className="flex flex-col sm:flex-row gap-3 w-full"
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative flex-grow"
      >
        <label htmlFor="search-input" className="sr-only">Search classes or teachers</label>
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          id="search-input"
          name="search-input"
          type="text"
          placeholder="Search classes or teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
          autoComplete="off"
        />
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative"
      >
        <label htmlFor="day-filter" className="sr-only">Filter by day</label>
        <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <select
          id="day-filter"
          name="day-filter"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="w-full sm:w-40 pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 focus:border-transparent text-gray-900 dark:text-gray-100 appearance-none transition-all duration-300"
        >
          {days.map(day => (
            <option key={day} value={day} className="py-2">
              {day}
            </option>
          ))}
        </select>
      </motion.div>
    </motion.div>
  )
}

export default SearchBar