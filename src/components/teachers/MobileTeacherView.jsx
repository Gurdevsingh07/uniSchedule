import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiPlus, FiChevronUp, FiChevronDown, FiMenu, FiList, FiGrid, FiUser, FiTag, FiUserCheck, FiCalendar, FiBook, FiRefreshCw, FiTrash2, FiEdit2 } from 'react-icons/fi';
import EditTeacherModal from './EditTeacherModal';

const MobileTeacherView = ({ teachers, onEdit, onDelete, onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const [activeTeacher, setActiveTeacher] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [quickFilters, setQuickFilters] = useState('all'); // 'all', 'active', 'inactive'
  const [advancedFilters, setAdvancedFilters] = useState({
    department: '',
    experience: '',
    subjects: ''
  });
  
  // Get unique departments for filter dropdown
  const departments = [...new Set(teachers.map(t => t.department))];
  
  // Filter teachers based on search, quick filters, and advanced filters
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
    
    // Quick filter
    if (quickFilters === 'active' && !teacher.isActive) return false;
    if (quickFilters === 'inactive' && teacher.isActive) return false;
    
    // Advanced filters
    if (advancedFilters.department && teacher.department !== advancedFilters.department) {
      return false;
    }
    
    // Experience filter
    if (advancedFilters.experience) {
      if (advancedFilters.experience === 'novice' && teacher.experience > 3) return false;
      if (advancedFilters.experience === 'intermediate' && (teacher.experience < 3 || teacher.experience > 7)) return false;
      if (advancedFilters.experience === 'experienced' && teacher.experience < 7) return false;
    }
    
    // Subject filter
    if (advancedFilters.subjects && teacher.subjects) {
      const hasSubject = teacher.subjects.some(s =>
        s.toLowerCase().includes(advancedFilters.subjects.toLowerCase())
      );
      if (!hasSubject) return false;
    }
    
    return true;
  });
  
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
    
    onAdd(newTeacher);
  };
  
  const handleEditTeacher = (teacher) => {
    setActiveTeacher(teacher);
    setIsEditModalOpen(true);
  };
  
  const handleSaveTeacher = (updatedTeacher) => {
    onEdit(updatedTeacher);
    setIsEditModalOpen(false);
  };
  
  // Reset advanced filters
  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      department: '',
      experience: '',
      subjects: ''
    });
  };
  
  // Check if any advanced filter is applied
  const hasAdvancedFilters = Object.values(advancedFilters).some(value => value !== '');
  
  return (
    <div className="relative h-full flex flex-col">
      {/* Top header with fixed position */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-20 pt-2 pb-2 px-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Teachers
          </h2>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                filterOpen || hasAdvancedFilters
                  ? 'bg-primary-100 dark:bg-primary-900/30'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiFilter className={`w-4 h-4 ${
                filterOpen || hasAdvancedFilters
                  ? 'text-primary-500 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              {hasAdvancedFilters && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full"></span>
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-500 dark:bg-primary-600 text-white shadow-md"
              onClick={handleAddTeacher}
            >
              <FiPlus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-3">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 w-4 h-4" />
          <input
            type="text"
            placeholder="Search teachers..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm border-none focus:ring-2 focus:ring-primary-500/30 dark:focus:ring-primary-400/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"
              onClick={() => setSearchQuery('')}
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Advanced Filter Panel */}
        <AnimatePresence mode="sync">
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-3"
            >
              <div className="bg-gray-50 dark:bg-gray-800/90 rounded-xl p-3 shadow-inner">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <FiFilter className="w-3 h-3 text-primary-500 dark:text-primary-400" />
                    Advanced Filters
                  </h3>
                  {hasAdvancedFilters && (
                    <button
                      onClick={resetAdvancedFilters}
                      className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1"
                    >
                      <FiRefreshCw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {/* Department Filter */}
                  <div className="space-y-1">
                    <label htmlFor="mobile-department-filter" className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <FiTag className="w-3 h-3 text-purple-500 dark:text-purple-400" />
                      Department
                    </label>
                    <div className="relative">
                      <select
                        id="mobile-department-filter"
                        value={advancedFilters.department}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, department: e.target.value })}
                        className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                      >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Experience Filter */}
                  <div className="space-y-1">
                    <label htmlFor="mobile-experience-filter" className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <FiCalendar className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                      Experience
                    </label>
                    <div className="relative">
                      <select
                        id="mobile-experience-filter"
                        value={advancedFilters.experience}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, experience: e.target.value })}
                        className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
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
                    <label htmlFor="mobile-subjects-filter" className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <FiBook className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                      Subject
                    </label>
                    <input
                      id="mobile-subjects-filter"
                      type="text"
                      placeholder="Search subject..."
                      value={advancedFilters.subjects}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, subjects: e.target.value })}
                      className="w-full pl-3 pr-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
                
                {/* Applied Filters */}
                {hasAdvancedFilters && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {advancedFilters.department && (
                      <span className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full">
                        {advancedFilters.department}
                        <button
                          className="ml-1 text-purple-600 dark:text-purple-400"
                          onClick={() => setAdvancedFilters({ ...advancedFilters, department: '' })}
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {advancedFilters.experience && (
                      <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                        {advancedFilters.experience === 'novice' ? 'Novice' :
                          advancedFilters.experience === 'intermediate' ? 'Intermediate' : 'Experienced'}
                        <button
                          className="ml-1 text-blue-600 dark:text-blue-400"
                          onClick={() => setAdvancedFilters({ ...advancedFilters, experience: '' })}
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {advancedFilters.subjects && (
                      <span className="inline-flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full">
                        Subject: {advancedFilters.subjects}
                        <button
                          className="ml-1 text-amber-600 dark:text-amber-400"
                          onClick={() => setAdvancedFilters({ ...advancedFilters, subjects: '' })}
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
        
        {/* Quick filter tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-2 shadow-inner">
          <button
            className={`flex-1 py-1.5 px-2 rounded-full text-xs font-medium transition-all ${
              quickFilters === 'all' 
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setQuickFilters('all')}
          >
            All ({teachers.length})
          </button>
          <button
            className={`flex-1 py-1.5 px-2 rounded-full text-xs font-medium transition-all ${
              quickFilters === 'active' 
                ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setQuickFilters('active')}
          >
            Active ({teachers.filter(t => t.isActive).length})
          </button>
          <button
            className={`flex-1 py-1.5 px-2 rounded-full text-xs font-medium transition-all ${
              quickFilters === 'inactive' 
                ? 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setQuickFilters('inactive')}
          >
            Inactive ({teachers.filter(t => !t.isActive).length})
          </button>
        </div>
        
        {/* View toggle */}
        <div className="flex justify-end">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-1">
            <button
              className={`py-1 px-2 rounded-full text-xs font-medium transition-all ${
                viewMode === 'card' 
                  ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setViewMode('card')}
            >
              <FiGrid className="w-3.5 h-3.5" />
            </button>
            <button
              className={`py-1 px-2 rounded-full text-xs font-medium transition-all ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setViewMode('list')}
            >
              <FiList className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main scrollable content */}
      <div className="flex-grow overflow-y-auto p-3 pb-20">
        {filteredTeachers.length > 0 ? (
          <div className={viewMode === 'card' ? 'grid grid-cols-1 gap-4 mb-16' : 'flex flex-col gap-2 mb-16'}>
            {filteredTeachers.map(teacher => (
              viewMode === 'card' ? (
                <TeacherCard 
                  key={teacher.id || teacher.email} 
                  teacher={teacher} 
                  onEdit={() => handleEditTeacher(teacher)}
                  onDelete={() => onDelete(teacher)}
                />
              ) : (
                <TeacherListItem
                  key={teacher.id || teacher.email}
                  teacher={teacher}
                  onEdit={() => handleEditTeacher(teacher)}
                  onDelete={() => onDelete(teacher)}
                />
              )
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-5 mb-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FiUser className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              {searchQuery || hasAdvancedFilters
                ? "No teachers found matching your criteria" 
                : quickFilters !== 'all'
                  ? `No ${quickFilters} teachers found`
                  : "No teachers found"}
            </p>
            {(searchQuery || hasAdvancedFilters || quickFilters !== 'all') && (
              <button
                className="bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-medium"
                onClick={() => {
                  setSearchQuery('');
                  resetAdvancedFilters();
                  setQuickFilters('all');
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Edit Modal */}
      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={activeTeacher}
        onSave={handleSaveTeacher}
      />
      
      {/* Floating Add Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary-600 to-indigo-600 shadow-lg flex items-center justify-center z-30"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleAddTeacher}
      >
        <FiPlus className="w-7 h-7 text-white" />
      </motion.button>
    </div>
  );
};

// Card View Component
const TeacherCard = ({ teacher, onEdit, onDelete }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Header */}
      <div className="relative h-20 bg-gradient-to-r from-primary-500/10 to-indigo-500/10 dark:from-primary-500/20 dark:to-indigo-500/20 p-4">
        <div className="absolute -bottom-5 left-4">
          <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {teacher.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-2 right-4 flex items-center">
          <div className={`h-2 w-2 rounded-full ${teacher.isActive ? 'bg-green-500' : 'bg-gray-400'} mr-1.5`}></div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {teacher.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-8 pb-3 px-4">
        <h3 className="text-gray-900 dark:text-gray-100 font-bold text-lg">{teacher.name}</h3>
        <p className="text-primary-600 dark:text-primary-400 text-sm">{teacher.department}</p>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Classes</p>
            <p className="text-gray-900 dark:text-gray-100 font-bold">{teacher.classCount || 0}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Years</p>
            <p className="text-gray-900 dark:text-gray-100 font-bold">{teacher.experience || 0}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Students</p>
            <p className="text-gray-900 dark:text-gray-100 font-bold">{teacher.students || 0}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <motion.button
            className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(teacher)}
            aria-label="Delete teacher"
          >
            <FiTrash2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(teacher)}
            aria-label="Edit teacher"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// List Item Component
const TeacherListItem = ({ teacher, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div 
        className="flex items-center p-3" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center mr-3">
          <span className="text-white font-bold">{teacher.name.charAt(0)}</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-gray-900 dark:text-gray-100 font-medium">{teacher.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs">{teacher.department}</p>
        </div>
        
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full ${teacher.isActive ? 'bg-green-500' : 'bg-gray-400'} mr-1.5`}></div>
          {expanded ? (
            <FiChevronUp className="text-gray-400 ml-2" />
          ) : (
            <FiChevronDown className="text-gray-400 ml-2" />
          )}
        </div>
      </div>
      
      <AnimatePresence mode="sync">
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 dark:border-gray-700"
          >
            <div className="p-3 space-y-2">
              <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Classes</p>
                  <p className="text-gray-900 dark:text-gray-100 font-bold">{teacher.classCount || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Years</p>
                  <p className="text-gray-900 dark:text-gray-100 font-bold">{teacher.experience || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Students</p>
                  <p className="text-gray-900 dark:text-gray-100 font-bold">{teacher.students || 0}</p>
                </div>
              </div>
              
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p>{teacher.email}</p>
                <p>{teacher.phone}</p>
                <p className="mt-1">
                  <span className="font-medium">Subjects:</span> {teacher.subjects?.join(', ') || 'None'}
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <motion.button
                  className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(teacher);
                  }}
                  aria-label="Delete teacher"
                >
                  <FiTrash2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(teacher);
                  }}
                  aria-label="Edit teacher"
                >
                  <FiEdit2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MobileTeacherView; 