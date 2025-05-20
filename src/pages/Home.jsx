import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiUsers, FiSettings, FiArrowRight, FiClock, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer';

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

const heroImageVariants = {
  initial: {
    scale: 0.8,
    opacity: 0
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
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

const FeaturesSection = ({ features }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-20 bg-gradient-to-b from-white/50 via-gray-50/50 to-white/50 dark:from-dark-900/50 dark:via-dark-800/50 dark:to-dark-900/50">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to manage your institution's schedule effectively
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={featureCardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [touchStart, setTouchStart] = useState(null)
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 640

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (!touchStart) return
    
    const touchEnd = e.touches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next month
        handleNextMonth()
      } else {
        // Swipe right - previous month
        handlePrevMonth()
      }
      setTouchStart(null)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const date = new Date(prev)
      date.setMonth(date.getMonth() - 1)
      return date
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const date = new Date(prev)
      date.setMonth(date.getMonth() + 1)
      return date
    })
  }

  const features = [
    {
      icon: <FiCalendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Intelligent algorithm for creating optimized class schedules that minimize conflicts.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Teacher Management",
      description: "Comprehensive tools for managing teacher assignments and availability.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Instant updates and notifications for schedule changes and conflicts.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const benefits = [
    "Automated schedule generation",
    "Conflict resolution",
    "Teacher workload balancing",
    "Room allocation optimization",
    "Custom constraints support",
    "Export to multiple formats"
  ]

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timeSlots = [
    { time: '8:00', label: isMobile ? '8am' : 'Morning' },
    { time: '9:00', label: isMobile ? '9am' : 'Mid Morning' },
    { time: '10:00', label: isMobile ? '10am' : 'Late Morning' }
  ];

  // Class schedule matrix - true means slot is occupied
  const scheduleMatrix = [
    [1, 0, 1, 0, 1], // 8:00
    [0, 1, 0, 1, 1], // 9:00
    [1, 0, 1, 1, 0], // 10:00
  ];

  const classNames = [
    ['Math', 'Eng', 'Physics', 'Art', 'Chemistry'],
    ['CS', 'History', 'Bio', 'Literature', 'Physics Lab'],
    ['Chem', 'Geo', 'Stats', 'Music', 'Project']
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 mb-4 sm:mb-0 pb-16 sm:pb-0">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <motion.div
          variants={heroContainerVariants}
          initial="initial"
          animate="animate"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Hero Content */}
            <motion.div 
              variants={heroElementVariants}
              className="flex-1 text-center lg:text-left"
            >
              <motion.h1 
                variants={heroElementVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                <span className="block bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                  Intelligent Timetable
                </span>
                <span className="block text-gray-900 dark:text-gray-100">
                  Management System
                </span>
              </motion.h1>
              
              <motion.p
                variants={heroElementVariants}
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                Transform your college scheduling process with our AI-powered timetable management system. Create conflict-free schedules in minutes.
              </motion.p>

              <motion.div
                variants={heroElementVariants}
                className="flex flex-row gap-3 justify-center lg:justify-start flex-wrap"
              >
                <Link
                  to="/timetable"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Get Started
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center px-6 py-3 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Image/Animation */}
            <motion.div
              variants={heroImageVariants}
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 dark:from-primary-500/10 dark:to-accent-500/10 rounded-3xl transform rotate-3"></div>
                <motion.div 
                  className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-2 sm:p-4 hover:shadow-xl dark:shadow-lg transition-all duration-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                >
                  {/* Calendar Navigation */}
                  <div className="flex flex-col gap-2 sm:gap-3">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-xl border border-gray-100/30 dark:border-gray-700/30 shadow-sm">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevMonth}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-primary-50/80 dark:hover:bg-primary-900/30 active:bg-primary-100"
                      >
                        <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                      </motion.button>
                      <div className="flex items-center gap-2">
                        <motion.h3 
                          className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent"
                          layout
                        >
                          {isMobile ? currentMonth.toLocaleString('default', { month: 'short' }) : currentMonth.toLocaleString('default', { month: 'long' })}
                        </motion.h3>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {currentMonth.getFullYear()}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextMonth}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-primary-50/80 dark:hover:bg-primary-900/30 active:bg-primary-100"
                      >
                        <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                      </motion.button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl p-2 sm:p-3 border border-gray-100/30 dark:border-gray-700/30 shadow-sm">
                      {/* Days Header */}
                      <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-2">
                        {weekDays.map((day, i) => (
                          <motion.div
                            key={day}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="text-center p-1 sm:p-2 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200"
                          >
                            {isMobile ? day.substring(0, 1) : day}
                          </motion.div>
                        ))}
                      </div>

                      {/* Time Slots Grid */}
                      <div className="grid grid-cols-5 gap-1 sm:gap-2">
                        {timeSlots.map((slot, row) => (
                          weekDays.map((day, col) => (
                            <motion.div
                              key={`${row}-${col}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.2,
                                delay: (row * 5 + col) * 0.02,
                                type: "spring",
                                stiffness: 400
                              }}
                              whileHover={{ scale: 1.02, translateY: -2 }}
                              className="relative aspect-[4/3] bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border border-gray-100/20 dark:border-gray-700/20 p-1 sm:p-2 group hover:shadow-md transition-all duration-300"
                            >
                              <div className="absolute inset-x-0 -top-5 sm:-top-6 text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {slot.label}
                              </div>
                              {scheduleMatrix[row][col] ? (
                                <motion.div 
                                  className={`h-full rounded-md ${
                                    row % 2 === 0
                                      ? "bg-primary-50/90 dark:bg-primary-900/30"
                                      : "bg-accent-50/90 dark:bg-accent-900/30"
                                  } p-1 sm:p-2 flex flex-col justify-between`}
                                  layoutId={`class-${row}-${col}`}
                                >
                                  <div className={`text-[8px] sm:text-xs font-medium truncate ${
                                    row % 2 === 0
                                      ? "text-primary-700 dark:text-primary-300"
                                      : "text-accent-700 dark:text-accent-300"
                                  }`}>
                                    {classNames[row][col]}
                                  </div>
                                  <div className="text-[6px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                                    {slot.time}
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="h-full flex items-center justify-center">
                                  <div className="text-[6px] sm:text-[10px] text-gray-400 dark:text-gray-600">
                                    Free
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* Benefits Section */}
      <section className="py-20 pb-24 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Why Choose Our Solution?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 dark:bg-green-500/10 flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full lg:w-auto"
            >
              <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 dark:from-primary-500/5 dark:to-accent-500/5 p-4 sm:p-8 rounded-2xl">
                <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-left text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                    Impact Numbers
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6">
                    {[
                      { value: "85%", label: "Time Saved" },
                      { value: "99%", label: "Conflict Resolution" },
                      { value: "500+", label: "Active Users" },
                      { value: "24/7", label: "Support" }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                      >
                        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home