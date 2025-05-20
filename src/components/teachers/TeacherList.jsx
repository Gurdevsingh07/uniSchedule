import { motion, AnimatePresence } from 'framer-motion';
import TeacherCard from './TeacherCard';
import { FiSearch, FiFilter, FiX, FiSliders, FiChevronDown, FiCalendar, FiUserCheck, FiTag, FiRefreshCw, FiBook, FiPlus } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const TeacherList = ({ teachers, onEdit, onDelete, onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    experience: '',
    subjects: ''
  });

  // Function to handle adding a new teacher
  const handleAddTeacher = () => {
    const newTeacher = {
      name: 'New Teacher',
      department: 'Department',
      email: 'teacher@example.com',
      phone: '+1 234 567 8910',
      subjects: ['Subject 1', 'Subject 2'],
      classCount: 0,
      experience: 0,
      students: 0,
      isActive: true,
      rating: 0
    };

    // Use the onAdd prop if available, otherwise fall back to onEdit
    if (onAdd) {
      onAdd(newTeacher);
    } else {
      onEdit(newTeacher);
    }
  };

  // Filter teachers based on search query and filters
  const filteredTeachers = teachers.filter(teacher => {
    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        teacher.name.toLowerCase().includes(query) ||
        teacher.department.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        (teacher.subjects && teacher.subjects.some(subject =>
          subject.toLowerCase().includes(query)
        ))
      );
      if (!matchesSearch) return false;
    }

    // Department filter
    if (filters.department && teacher.department !== filters.department) {
      return false;
    }

    // Status filter
    if (filters.status) {
      const isActive = filters.status === 'active';
      if (teacher.isActive !== isActive) {
        return false;
      }
    }

    // Experience filter
    if (filters.experience) {
      if (filters.experience === 'novice' && teacher.experience > 3) return false;
      if (filters.experience === 'intermediate' && (teacher.experience < 3 || teacher.experience > 7)) return false;
      if (filters.experience === 'experienced' && teacher.experience < 7) return false;
    }

    // Subject filter (if we had a specific subject filter)
    if (filters.subjects && teacher.subjects) {
      const hasSubject = teacher.subjects.some(s =>
        s.toLowerCase().includes(filters.subjects.toLowerCase())
      );
      if (!hasSubject) return false;
    }

    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      department: '',
      status: '',
      experience: '',
      subjects: ''
    });
  };

  // Get unique departments for filter dropdown
  const departments = [...new Set(teachers.map(t => t.department))];

  return (
    <motion.div
      variants={containerVariants}
      initial={{ 
        opacity: 0, 
        y: -20 
      }}
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full h-full flex flex-col"
      transition={{
        type: 'spring',
        damping: 18,
        stiffness: 250
      }}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 to-white/0 dark:from-primary-900/10 dark:to-gray-900/0 -z-10 rounded-3xl"></div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/30 shadow-lg p-3 md:p-5 flex flex-col flex-grow overflow-hidden w-full h-full min-h-[600px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 flex-shrink-0">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
            >
              Teachers
            </motion.h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'} found
              {(filters.department || filters.status || filters.experience || filters.subjects) &&
                ' with filters'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
            {/* Search input */}
            <div className="relative flex-1 min-w-[180px]">
              <label htmlFor="teacher-search" className="sr-only">Search teachers</label>
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="teacher-search"
                name="teacher-search"
                placeholder="Search teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500/30 dark:focus:ring-primary-400/30 focus:border-primary-500 dark:focus:border-primary-400 text-gray-800 dark:text-gray-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters ? "true" : "false"}
              aria-controls="filter-panel"
              aria-label={`${showFilters ? 'Hide' : 'Show'} filter options`}
              className={`px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center gap-1.5 ${showFilters ? 'text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-700/30' : 'text-gray-700 dark:text-gray-300'} ${(filters.department || filters.status || filters.experience || filters.subjects) ? 'ring-1 ring-primary-500 dark:ring-primary-400' : ''}`}
            >
              <FiSliders className="w-4 h-4" />
              <span>
                {filters.department || filters.status || filters.experience || filters.subjects ?
                  'Filtered' : 'Filter'}
              </span>
              {(filters.department || filters.status || filters.experience || filters.subjects) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </motion.button>

            {/* Add Teacher button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddTeacher}
              aria-label="Add new teacher"
              className="px-3 py-2 text-sm bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Teacher</span>
            </motion.button>
          </div>
        </div>

        {/* Filter options (conditionally rendered) */}
        <AnimatePresence mode="sync">
          {showFilters && (
            <motion.div
              id="filter-panel"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ 
                opacity: 0, 
                y: -10,
                transition: { duration: 0.2 }
              }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="relative mb-4 overflow-hidden flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50/20 via-white/10 to-accent-50/20 dark:from-primary-900/30 dark:via-gray-800/10 dark:to-accent-900/30 rounded-xl"></div>
              <div className="bg-white/60 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md relative">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <FiFilter className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
                    Filter Teachers
                  </h3>
                  {(filters.department || filters.status || filters.experience || filters.subjects) && (
                    <button
                      onClick={resetFilters}
                      aria-label="Reset all filters"
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 flex items-center gap-1 transition-colors"
                    >
                      <FiRefreshCw className="w-3 h-3" />
                      Reset All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Department Filter */}
                  <div className="space-y-1">
                    <label htmlFor="department-filter" className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <FiTag className="w-3 h-3 text-purple-500 dark:text-purple-400" />
                      Department
                    </label>
                    <div className="relative">
                      <select
                        id="department-filter"
                        name="department-filter"
                        value={filters.department}
                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                        className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-white/70 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/40 dark:text-gray-200"
                      >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-1">
                    <label htmlFor="status-filter" className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <FiUserCheck className="w-3 h-3 text-green-500 dark:text-green-400" />
                      Status
                    </label>
                    <div className="relative">
                      <select
                        id="status-filter"
                        name="status-filter"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-white/70 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/40 dark:text-gray-200"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>
                  </div>

                  {/* Experience Filter */}
                  <div className="space-y-1">
                    <label htmlFor="experience-filter" className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <FiCalendar className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                      Experience
                    </label>
                    <div className="relative">
                      <select
                        id="experience-filter"
                        name="experience-filter"
                        value={filters.experience}
                        onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                        className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-white/70 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/40 dark:text-gray-200"
                      >
                        <option value="">Any Experience</option>
                        <option value="novice">Novice (0-3 years)</option>
                        <option value="intermediate">Intermediate (3-7 years)</option>
                        <option value="experienced">Experienced (7+ years)</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>
                  </div>

                  {/* Subjects Filter */}
                  <div className="space-y-1">
                    <label htmlFor="subjects-filter" className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <FiBook className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                      Subject
                    </label>
                    <div className="relative">
                      <input
                        id="subjects-filter"
                        name="subjects-filter"
                        type="text"
                        placeholder="Search subject..."
                        value={filters.subjects}
                        onChange={(e) => setFilters({ ...filters, subjects: e.target.value })}
                        className="w-full pl-3 pr-3 py-2 text-sm bg-white/70 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/40 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Applied Filters */}
                {(filters.department || filters.status || filters.experience || filters.subjects) && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 py-1">Applied filters:</div>
                    {filters.department && (
                      <span className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                        {filters.department}
                        <button
                          className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                          onClick={() => setFilters({ ...filters, department: '' })}
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.status && (
                      <span className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                        {filters.status === 'active' ? 'Active' : 'Inactive'}
                        <button
                          className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                          onClick={() => setFilters({ ...filters, status: '' })}
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.experience && (
                      <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                        {filters.experience === 'novice' ? 'Novice' :
                          filters.experience === 'intermediate' ? 'Intermediate' : 'Experienced'}
                        <button
                          className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          onClick={() => setFilters({ ...filters, experience: '' })}
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.subjects && (
                      <span className="inline-flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs px-2 py-1 rounded-full">
                        Subject: {filters.subjects}
                        <button
                          className="ml-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
                          onClick={() => setFilters({ ...filters, subjects: '' })}
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 flex-shrink-0">
          {[
            { label: 'Total', value: teachers.length, color: 'bg-blue-500' },
            { label: 'Active', value: teachers.filter(t => t.isActive).length, color: 'bg-green-500' },
            { label: 'Departments', value: [...new Set(teachers.map(t => t.department))].length, color: 'bg-purple-500' },
            { label: 'Subjects', value: [...new Set(teachers.flatMap(t => t.subjects || []))].length, color: 'bg-amber-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
              className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 rounded-lg p-3 relative shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className={`w-1.5 h-6 absolute left-0 top-1/2 -translate-y-1/2 ${stat.color} rounded-r-lg`}></div>
              <p className="text-xs text-gray-600 dark:text-gray-400 pl-3">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 pl-3">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Teacher cards grid - now with flex-grow and overflow handling */}
        <div className="flex-grow overflow-y-auto overflow-x-hidden pb-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full min-h-[300px]">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} onEdit={onEdit} onDelete={onDelete} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="col-span-full bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center border border-dashed border-gray-300 dark:border-gray-700"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {searchQuery || filters.department || filters.status || filters.experience || filters.subjects
                    ? `No teachers found matching your filters. Try different criteria.`
                    : 'No teachers found.'}
                </p>
                {(searchQuery || filters.department || filters.status || filters.experience || filters.subjects) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      resetFilters();
                    }}
                    aria-label="Clear all search and filter parameters"
                    className="mt-3 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherList; 