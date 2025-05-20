import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import TeacherList from '../components/teachers/TeacherList';
import MobileTeacherView from '../components/teachers/MobileTeacherView';
import TeacherForm from '../components/teachers/TeacherForm';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "John Smith",
      department: "Mathematics",
      email: "john.smith@college.edu",
      phone: "+1 234 567 890",
      subjects: ["Calculus", "Linear Algebra"],
      classCount: 5,
      experience: 8,
      students: 120,
      isActive: true,
      rating: 4.8
    },
    {
      id: 2,
      name: "Sarah Johnson",
      department: "Computer Science",
      email: "sarah.johnson@college.edu",
      phone: "+1 234 567 891",
      subjects: ["Data Structures", "Algorithms", "Machine Learning"],
      classCount: 4,
      experience: 6,
      students: 95,
      isActive: true,
      rating: 4.5
    },
    {
      id: 3,
      name: "David Williams",
      department: "Physics",
      email: "david.williams@college.edu",
      phone: "+1 234 567 892",
      subjects: ["Mechanics", "Quantum Physics", "Electromagnetism"],
      classCount: 3,
      experience: 12,
      students: 85,
      isActive: false,
      rating: 4.3
    }
  ]);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile sized
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle manual form submission
    const formData = new FormData(e.target);
    const newTeacher = {
      id: teachers.length + 1,
      name: formData.get('name'),
      department: formData.get('department'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subjects: formData.get('subjects').split(',').map(s => s.trim()),
      classCount: 0,
      experience: 0,
      students: 0,
      isActive: true,
      rating: 0
    };
    setTeachers([...teachers, newTeacher]);
  };

  const handleFileUpload = (jsonData) => {
    try {
      // Validate JSON data structure
      const validatedData = jsonData.map((teacher, index) => ({
        id: teachers.length + index + 1,
        name: teacher.name || '',
        department: teacher.department || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        subjects: Array.isArray(teacher.subjects) ? teacher.subjects : [],
        classCount: teacher.classCount || 0,
        experience: teacher.experience || 0,
        students: teacher.students || 0,
        isActive: teacher.isActive !== undefined ? teacher.isActive : true,
        rating: teacher.rating || 0
      }));

      setTeachers([...teachers, ...validatedData]);
    } catch (error) {
      console.error('Error processing JSON data:', error);
    }
  };

  const handleAddTeacher = (newTeacher) => {
    // Ensure the teacher has a unique ID
    const teacherWithId = {
      ...newTeacher,
      id: teachers.length + 1
    };
    
    // Add the new teacher to the list
    setTeachers([...teachers, teacherWithId]);
  };

  const handleEdit = async (updatedTeacher) => {
    try {
      // Check if the teacher already exists
      const existingTeacher = teachers.find(teacher => teacher.id === updatedTeacher.id);
      
      if (existingTeacher) {
        // Update existing teacher
        const updatedTeachers = teachers.map(teacher =>
          teacher.id === updatedTeacher.id ? updatedTeacher : teacher
        );
        setTeachers(updatedTeachers);
      } else {
        // Add new teacher if it doesn't exist
        setTeachers([...teachers, updatedTeacher]);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating teacher:', error);
      return Promise.reject(error);
    }
  };

  const handleDelete = async (teacherToDelete) => {
    try {
      const updatedTeachers = teachers.filter(teacher => teacher.id !== teacherToDelete.id);
      setTeachers(updatedTeachers);
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      return Promise.reject(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-4 md:p-6 flex flex-col"
      id="teachers-main-container"
    >
      {!isMobile && (
        <header className="mb-6 text-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm py-4 sm:py-5 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 flex-shrink-0">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-2"
          >
            Teacher Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Add, edit, and manage all your teachers in one place.
          </motion.p>
        </header>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full h-full flex-grow overflow-hidden flex flex-col rounded-2xl pt-3"
        id="teachers-content-container"
      >
        {isMobile ? (
          <MobileTeacherView
            teachers={teachers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAddTeacher}
          />
        ) : (
          <TeacherList
            teachers={teachers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAddTeacher}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Teachers; 