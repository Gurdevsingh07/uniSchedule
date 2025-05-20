import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { FiHome, FiCalendar, FiSettings, FiLogOut, FiMenu, FiX, FiBook, FiClock, FiUser, FiLogIn } from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import logo from '../../assets/logo.svg'
import { useAuth } from '../../contexts/AuthContext'

// Modern, animated NavbarTitle component
const NavbarTitle = () => {
  const { isDarkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const pulseAnimation = useAnimation();
  
  // Handle mouse movement for interactive effects
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };
  
  // Pulsing animation
  useEffect(() => {
    pulseAnimation.start({
      scale: [1, 1.03, 1],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    });
  }, [pulseAnimation]);
  
  // Track window size for responsive styling
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine if we're on mobile view
  const isMobile = windowWidth < 768;
  
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.03
      }
    }
  };
  
  const letterVariants = {
    initial: { 
      opacity: 0,
      y: 10
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10
      }
    },
    hover: (custom) => ({
      y: [0, -3, 0],
      scale: [1, 1.1, 1],
      rotateY: [0, 5, 0],
      transition: {
        y: {
          duration: 0.3,
          delay: custom * 0.05,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.3,
          delay: custom * 0.05,
          ease: "easeInOut"
        },
        rotateY: {
          duration: 0.3,
          delay: custom * 0.05,
          ease: "easeInOut"
        }
      }
    })
  };

  // Create particles
  const renderParticles = (count, color) => {
    return Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className={`absolute rounded-full ${isHovered || isMobile ? 'opacity-50' : 'opacity-0'}`}
        initial={{ scale: 0 }}
        animate={(isHovered || isMobile) ? {
          x: [
            Math.random() * 30 - 15,
            Math.random() * 60 - 30
          ],
          y: [
            Math.random() * 30 - 15,
            Math.random() * 60 - 30
          ],
          scale: [0, Math.random() * 0.7 + 0.3, 0],
          opacity: [0, isDarkMode ? 0.5 : 0.6, 0],
        } : { scale: 0, opacity: 0 }}
        transition={{
          duration: Math.random() * 1 + 1,
          ease: "easeInOut",
          delay: Math.random() * 0.2,
          repeat: Infinity,
          repeatDelay: Math.random() * 0.5,
        }}
        style={{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: color,
          filter: "blur(1px)",
        }}
      />
    ));
  };

  return (
    <div 
      className="relative" 
      style={{ perspective: '800px' }}
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {/* Ambient background glow effect */}
      <motion.div 
        className={`absolute inset-0 rounded-2xl blur-md bg-transparent dark:bg-transparent transition-opacity duration-700 opacity-0`} 
        style={{ 
          transform: 'scale(1.5) translateZ(-10px)', 
          background: 'none'
        }}
      />
      
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-0"
        style={{
          backgroundImage: "none"
        }}
      />
      
      {/* Main title container */}
      <motion.div
        className="relative"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Glass morphism card effect for mobile only */}
        {isMobile && (
          <motion.div 
            className="absolute inset-0 -left-3 -right-3 -top-2 -bottom-1 bg-transparent dark:bg-transparent backdrop-blur-none rounded-xl border-0"
            style={{ transform: 'translateZ(-5px)' }}
          />
        )}
        
        <div className={`flex ${isMobile ? 'flex-row items-center' : ''}`}>
          {/* First word with primary gradient and particles */}
          <div className={`flex ${isMobile ? 'mr-1 relative z-10 items-center' : 'mr-2'} relative overflow-visible`}>
            {/* Particle effects for first word */}
            {renderParticles(8, 'rgba(37, 99, 235, 0.7)')}
            
            {'Uni'.split('').map((letter, i) => (
              <motion.span
                key={`uni-${i}`}
                custom={i}
                variants={letterVariants}
                whileHover="hover"
                animate={isMobile ? "hover" : ""}
                className={`relative inline-block font-extrabold tracking-tight ${isMobile ? 'text-base' : 'text-2xl'} overflow-hidden`}
                style={{ 
                  letterSpacing: isMobile ? '-0.01em' : 'normal',
                  textShadow: 'none',
                  transform: isMobile ? `translateZ(${2 + i * 0.3}px)` : 'none',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundImage: `linear-gradient(135deg, ${isDarkMode ? '#4f46e5' : '#3b82f6'} 0%, ${isDarkMode ? '#60a5fa' : '#2563eb'} 100%)`,
                  backgroundSize: '300% 300%',
                  animation: (isHovered || isMobile) ? `gradientShift 3s ${i * 0.1}s infinite alternate` : 'none'
                }}
              >
                {letter}
                {/* Enhanced sparkle shine effect */}
                <span 
                  className={`absolute inset-0 ${isMobile ? 'opacity-0' : 'opacity-0 hover:opacity-100'} transition-opacity duration-300 pointer-events-none`}
                  aria-hidden="true"
                  style={{
                    background: `linear-gradient(90deg, 
                                transparent 0%, 
                                rgba(255, 255, 255, 0) 5%, 
                                rgba(255, 255, 255, 0.8) 45%, 
                                rgba(255, 255, 255, 0.9) 55%, 
                                rgba(255, 255, 255, 0) 95%, 
                                transparent 100%)`,
                    animation: `shine 1.8s infinite ${i * 0.07}s`,
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    right: 0,
                    bottom: 0,
                    transform: 'skewX(-15deg)',
                    zIndex: 10
                  }}
                />
              </motion.span>
            ))}
          </div>
          
          {/* Second word with accent gradient and particles */}
          <div className={`flex ${isMobile ? 'relative z-20 items-center' : ''} relative overflow-visible`}>
            {/* Particle effects for second word */}
            {renderParticles(12, 'rgba(168, 85, 247, 0.7)')}
            
            {'Schedule'.split('').map((letter, i) => (
              <motion.span
                key={`schedule-${i}`}
                custom={i}
                variants={letterVariants}
                whileHover="hover"
                animate={isMobile ? "hover" : ""}
                className={`relative inline-block font-extrabold tracking-tight ${isMobile ? 'text-base' : 'text-2xl'} overflow-hidden`}
                style={{ 
                  letterSpacing: isMobile ? '-0.01em' : 'normal',
                  textShadow: 'none',
                  transform: isMobile ? `translateZ(${5 + i * 0.2}px)` : 'none',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundImage: `linear-gradient(135deg, ${isDarkMode ? '#a855f7' : '#8b5cf6'} 0%, ${isDarkMode ? '#ec4899' : '#d946ef'} 100%)`,
                  backgroundSize: '300% 300%',
                  animation: (isHovered || isMobile) ? `gradientShift 3s ${i * 0.1 + 0.5}s infinite alternate` : 'none'
                }}
              >
                {letter}
                {/* Enhanced sparkle shine effect */}
                <span 
                  className={`absolute inset-0 ${isMobile ? 'opacity-0' : 'opacity-0 hover:opacity-100'} transition-opacity duration-300 pointer-events-none`}
                  aria-hidden="true"
                  style={{
                    background: `linear-gradient(90deg, 
                                transparent 0%, 
                                rgba(255, 255, 255, 0) 5%, 
                                rgba(255, 255, 255, 0.8) 45%, 
                                rgba(255, 255, 255, 0.9) 55%, 
                                rgba(255, 255, 255, 0) 95%, 
                                transparent 100%)`,
                    animation: `shine 1.8s infinite ${i * 0.1 + 0.4}s`,
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    right: 0,
                    bottom: 0,
                    transform: 'skewX(-15deg)',
                    zIndex: 10
                  }}
                />
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      <style>
        {`
        @keyframes shine {
          0% {
            left: -100%;
          }
          20%, 100% {
            left: 200%;
          }
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        `}
      </style>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { currentUser, isAuthenticated, logout } = useAuth() 
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getRole = () => {
    // Try AuthContext, fallback to localStorage
    try {
      const stored = localStorage.getItem('user_role');
      if (stored) return stored;
    } catch {}
    return null;
  };
  const userRole = getRole();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Timetable', href: '/timetable' },
    { name: 'Teachers', href: '/teachers' },
    { name: 'About', href: '/about' },
    ...(userRole === 'admin' ? [{ name: 'Admin Dashboard', href: '/admin-dashboard' }] : []),
    ...(userRole === 'student' ? [{ name: 'Student Dashboard', href: '/student-dashboard' }] : []),
    ...(userRole === 'faculty' ? [{ name: 'Faculty Dashboard', href: '/faculty-dashboard' }] : []),
  ]

  const linkVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.9
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 250,
        damping: 15,
        mass: 0.5
      }
    })
  }

  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05
      }
    }
  }

  const navbarVariants = {
    initial: {
      y: -20,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const handleLogout = () => {
    logout()
    if (location.pathname === '/timetable') {
      // Redirect to home if on protected route
      window.location.href = '/'
    }
  }

  return (
    <motion.nav
      variants={navbarVariants}
      initial="initial"
      animate="animate"
      className={`
        fixed top-0 left-0 right-0 z-50
        theme-transition
        ${scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-700 shadow-lg'
          : 'bg-white/70 dark:bg-gray-900/90'
        }
        ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}
        backdrop-blur-lg
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <motion.div
        className="flex items-center"
        >
        <Link to="/" className={`flex items-center group ${isMobile ? 'scale-90 transform-gpu' : ''}`}>
          <div className={`relative ${isMobile ? 'mr-1.5' : 'mx-2'}`}>
            <img src={logo} className='w-12 h-12 text-primary-600 dark:text-primary-500' />
          </div>
          <NavbarTitle />
        </Link>
        </motion.div>

        {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        {navigation.map((link, i) => (
          <motion.div
            key={link.href}
            custom={i}
            variants={linkVariants}
          >
            <Link
              to={link.href}
              className={`relative text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === link.href
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20 backdrop-blur-sm shadow-sm'
                  : 'hover:bg-white/50 dark:hover:bg-white/5'
                } hover:shadow-md hover:-translate-y-0.5`}
            >
              {link.name}
            </Link>
          </motion.div>
        ))}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="theme-transition p-2 rounded-lg 
            text-gray-700 dark:text-gray-200 
            hover:text-primary-600 dark:hover:text-primary-400 
            hover:bg-white/50 dark:hover:bg-white/5"
          aria-label="Toggle dark mode"
        >
          <motion.div
            key={isDarkMode ? 'dark' : 'light'}
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </motion.div>
        </motion.button>

        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/10 
                        text-primary-700 dark:text-primary-300 px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Link to="/profile" className="flex items-center">
                <FiUser className="inline-block mr-2" />
                {currentUser?.name || 'User'}
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05, x: 3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-900/20 hover:shadow-md"
            >
              <FiLogOut className="inline-block mr-2" />
              Logout
            </motion.button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:shadow-md flex items-center"
              >
                <FiLogIn className="inline-block mr-2" />
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/signup"
                className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg flex items-center"
              >
                <FiUser className="inline-block mr-2" />
                Sign up
              </Link>
            </motion.div>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200/70 dark:border-gray-700/30'
          }`}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <FiX className="h-5 w-5" />
          ) : (
            <div className="flex flex-col gap-1 items-end">
              <span className="block w-5 h-0.5 bg-current rounded-full"></span>
              <span className="block w-3.5 h-0.5 bg-current rounded-full"></span>
              <span className="block w-4 h-0.5 bg-current rounded-full"></span>
            </div>
          )}
        </motion.button>
      </div>
    </div>
  </div>

  {/* Mobile Navigation */}
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={menuVariants}
        className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-white/30 dark:border-gray-700/30 shadow-lg rounded-b-2xl mx-2 mt-1 overflow-hidden"
      >
        <div className="px-3 pt-5 pb-6 space-y-3.5 flex flex-col">
          {navigation.map((link, i) => {
            // Map icons to navigation items
            const iconMap = {
              'Home': <FiHome className="w-4 h-4" />,
              'Timetable': <FiCalendar className="w-4 h-4" />,
              'Teachers': <FiBook className="w-4 h-4" />,
              'About': <FiSettings className="w-4 h-4" />
            };
            
            return (
              <motion.div
                key={link.href}
                custom={i}
                variants={linkVariants}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.href
                      ? 'bg-gradient-to-r from-primary-50/80 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/30'
                  }`}
                >
                  <span className={`flex items-center justify-center w-7 h-7 rounded-full ${
                    location.pathname === link.href
                      ? 'bg-gradient-to-br from-primary-100 to-primary-200/60 dark:from-primary-900/40 dark:to-primary-800/20 text-primary-600 dark:text-primary-400'
                      : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400'
                  }`}>
                    {iconMap[link.name] || <FiSettings className="w-4 h-4" />}
                  </span>
                  <span className="relative">
                    {link.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}

          {/* Add Profile link for authenticated users */}
          {isAuthenticated && (
            <motion.div
              variants={linkVariants}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/profile'
                    ? 'bg-gradient-to-r from-primary-50/80 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/30'
                }`}
              >
                <FiUser className="w-4 h-4" />
                Profile
              </Link>
            </motion.div>
          )}

          {/* Toggle Theme Button */}
          <motion.button
            variants={linkVariants}
            whileTap={{ scale: 0.97 }}
            onClick={toggleDarkMode}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 text-gray-700 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/30"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </motion.button>

          {/* Authentication buttons at the bottom */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
              <motion.button
                variants={linkVariants}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </motion.button>
            ) : (
              <div className="flex flex-col space-y-2">
                <motion.div
                  variants={linkVariants}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                  >
                    <FiLogIn className="w-4 h-4" />
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  variants={linkVariants}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 bg-gradient-to-r from-indigo-600 to-blue-500 text-white"
                  >
                    <FiUser className="w-4 h-4" />
                    Sign up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.nav>
)
}

export default Navbar