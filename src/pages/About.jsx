import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiClock, FiSettings, FiCode, FiShield, FiCheck, FiBookOpen, FiAward } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const card3dHoverVariants = {
    hover: {
      rotateY: 5,
      rotateX: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const features = [
    {
      icon: <FiCalendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Our intelligent algorithm optimizes class schedules to minimize conflicts and maximize efficiency.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Teacher Management",
      description: "Easily manage teacher schedules, preferences, and workload distribution.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Time Optimization",
      description: "Automatically optimize class timings based on various factors including teacher availability and room capacity.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FiSettings className="w-6 h-6" />,
      title: "Customizable Settings",
      description: "Tailor the system to your institution's specific needs with flexible configuration options.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      title: "Modern Technology",
      description: "Built with the latest web technologies for a smooth and responsive user experience.",
      color: "from-indigo-500 to-violet-500"
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Your data is protected with industry-standard security measures and regular backups.",
      color: "from-rose-500 to-red-500"
    }
  ];

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [missionRef, missionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-12"
    >
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden pt-16 pb-24">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 dark:from-primary-400/10 dark:to-accent-400/10"
        />
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            className="text-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-block mb-4 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium"
            >
              Educational Scheduling Reimagined
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent pb-2"
            >
              About College Timetable
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              A modern solution for managing college schedules, designed to streamline the process of creating and maintaining timetables for educational institutions.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <a href="#features" className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1">
                Explore Features
              </a>
              <a href="#mission" className="px-8 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-medium rounded-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-200 hover:-translate-y-1">
                Our Mission
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" ref={missionRef} className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-50/30 to-accent-50/30 dark:from-primary-900/30 dark:to-accent-900/30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-200/30 dark:bg-primary-800/20 rounded-full filter blur-3xl"></div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 relative">
                <span className="inline-block bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">Our Mission</span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 relative">
                We aim to revolutionize the way educational institutions manage their schedules by providing an intuitive, efficient, and reliable platform that saves time and reduces administrative overhead.
              </p>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 relative">
                Our platform is designed with both administrators and teachers in mind, ensuring a seamless experience for everyone involved in the scheduling process.
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                {["100+ Schools", "50% Time Saved", "98% Satisfaction", "24/7 Support"].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stat.split(' ')[0]}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.split(' ').slice(1).join(' ')}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-lg relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-200/30 dark:bg-accent-800/20 rounded-full filter blur-3xl"></div>
              
              <motion.div
                variants={iconVariants}
                className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-400 dark:to-accent-400 flex items-center justify-center text-white mb-6"
              >
                <FiAward className="w-8 h-8" />
              </motion.div>
              
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 relative">
                Key Benefits
              </h3>
              
              <ul className="space-y-4 relative">
                {[
                  "Reduced scheduling conflicts",
                  "Improved teacher satisfaction",
                  "Enhanced student experience",
                  "Time-saving automation",
                  "Resource optimization",
                  "Data-driven insights"
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="shrink-0 h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-800/50 flex items-center justify-center mr-3">
                      <FiCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-gray-50/50 to-white/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
                Powerful Capabilities
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Our Features
              </h2>
              
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to manage your college schedule effectively and efficiently
              </p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: [0.6, -0.05, 0.01, 0.99]
                    }
                  }
                }}
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                whileHover={cardHoverVariants.hover}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
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

          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="text-center mt-16"
          >
            <a 
              href="#" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-medium rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <span>Get Started Today</span>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About; 