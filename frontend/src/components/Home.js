import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaShieldAlt, FaChartLine, FaUsers, FaCheckCircle, FaInstagram, FaYoutube, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const fullText = "Transform Your Brand with Social Media Marketing";

  useEffect(() => {
    window.scrollTo(0, 0);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(prev => fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <FaRocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Instant Verification",
      description: "Get your brand verified instantly with our advanced verification system"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security measures"
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Analytics Dashboard",
      description: "Track your brand's performance with detailed analytics"
    },
    {
      icon: <FaUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Community Support",
      description: "Join a thriving community of verified brands"
    }
  ];

  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: <FaInstagram className="w-8 h-8 text-white dark:text-white" />,
      gradient: 'from-pink-500 to-purple-500',
      tasks: ['Follow accounts', 'Like posts', 'Comment']
    },
    {
      name: 'YouTube',
      icon: <FaYoutube className="w-8 h-8 text-white dark:text-white" />,
      gradient: 'from-red-500 to-red-700',
      tasks: ['Subscribe channels', 'Like videos', 'Watch content']
    },
    {
      name: 'Facebook',
      icon: <FaFacebook className="w-8 h-8 text-white dark:text-white" />,
      gradient: 'from-blue-500 to-blue-700',
      tasks: ['Like pages', 'Share posts', 'Join groups']
    },
    {
      name: 'Twitter',
      icon: <FaTwitter className="w-8 h-8 text-white dark:text-white" />,
      gradient: 'from-blue-400 to-blue-600',
      tasks: ['Follow accounts', 'Retweet', 'Like tweets']
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="w-8 h-8 text-white dark:text-white" />,
      gradient: 'from-blue-600 to-blue-800',
      tasks: ['Connect', 'Like posts', 'Share content']
    }
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen text-gray-900 dark:text-white flex flex-col"
      >
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 flex-shrink-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.h1 
                variants={itemAnimation}
                className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 mb-6 animate-gradient"
              >
                {typedText}
              </motion.h1>
              <motion.div 
                variants={itemAnimation}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto space-y-4"
              >
                <p className="leading-relaxed">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Join thousands</span> of verified brands and 
                  <span className="font-bold text-purple-600 dark:text-purple-400"> establish trust</span> with your audience through our 
                  <span className="font-semibold text-pink-600 dark:text-pink-400"> secure verification platform</span>.
                </p>
                <p className="text-lg italic text-gray-500 dark:text-gray-400">
                  "Building trust, one verification at a time"
                </p>
              </motion.div>
              <motion.div 
                variants={itemAnimation}
                className="flex justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/register')}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 shadow-lg hover:shadow-xl animate-pulse"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/about')}
                  className="px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transform transition-all duration-200"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated Background Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-gray-900/20 dark:to-purple-900/20" />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
              className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl"
            />
          </motion.div>
        </section>

        {/* Features Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-grow"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={itemAnimation}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
                Why Choose BrandHash?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Experience the benefits of our comprehensive verification platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemAnimation}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="text-blue-600 dark:text-blue-400 mb-4"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Social Platforms Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white flex-shrink-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={itemAnimation}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
                Supported Platforms
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Verify your presence across all major social media platforms
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {socialPlatforms.map((platform, index) => (
                <motion.div
                  key={index}
                  variants={itemAnimation}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className={`p-6 rounded-2xl bg-gradient-to-r ${platform.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 dark:text-white`}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-4 mb-4 text-white dark:text-white"
                  >
                    {platform.icon}
                    <h3 className="text-xl font-semibold">
                      {platform.name}
                    </h3>
                  </motion.div>
                  <ul className="space-y-2">
                    {platform.tasks.map((task, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-white dark:text-white"
                      >
                        <FaCheckCircle className="w-4 h-4 text-white dark:text-white" />
                        {task}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-shrink-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={itemAnimation}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-8">
                Ready to Get Started?
              </h2>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/register')}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 shadow-lg hover:shadow-xl animate-pulse"
                >
                  Start Verification
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/contact')}
                  className="px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transform transition-all duration-200"
                >
                  Contact Us
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;