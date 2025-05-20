import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      // Use throttling to prevent excessive calculations
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        // Calculate if we're at the bottom of the page
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        
        // Show footer when within 50px of the bottom or at the bottom
        const isBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 50;
        
        // Use functional update to access the latest state
        setIsVisible(currentVisible => {
          // Only update if there's a change
          if (currentVisible !== isBottom) {
            return isBottom;
          }
          return currentVisible;
        });
      }, 50); // Small delay for better performance
    };
    
    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial scroll position
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // Empty dependency array

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.footer
          variants={footerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 shadow-lg z-10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                  UniSchedule
                </span>
                <div className="flex space-x-4">
                  {[FiGithub, FiTwitter, FiLinkedin].map((Icon, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    >
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span> {new Date().getFullYear()} College Schedule Manager</span>
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy</a>
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Terms</a>
              </div>
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  );
};

export default Footer;