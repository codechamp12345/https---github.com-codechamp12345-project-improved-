import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaShieldAlt, FaChartLine, FaUsers, FaCheckCircle, FaInstagram, FaYoutube, FaFacebook, FaTwitter, FaLinkedin, FaAward, FaRegClock, FaRegMoneyBillAlt } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
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

  const benefits = [
    {
      icon: <FaAward className="w-8 h-8 text-green-500" />,
      title: "Enhanced Credibility",
      description: "Build trust with your audience through verified status"
    },
    {
      icon: <FaRegClock className="w-8 h-8 text-yellow-500" />,
      title: "Time-Saving",
      description: "Automated verification process saves you valuable time"
    },
    {
      icon: <FaRegMoneyBillAlt className="w-8 h-8 text-purple-500" />,
      title: "Cost-Effective",
      description: "Affordable solutions for businesses of all sizes"
    }
  ];

  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: <FaInstagram className="w-8 h-8 text-white dark:text-white" />,
      gradient: 'from-pink-500 to-purple-500',
      tasks: ['Follow accounts', 'Like posts', 'Comment'],
      stats: '1M+ Active Users'
    },
    {
      name: 'YouTube',
      icon: <FaYoutube className="w-8 h-8 text-white dark:text-white" />,
      gradient: 'from-red-500 to-red-700',
      tasks: ['Subscribe channels', 'Like videos', 'Watch content'],
      stats: '500K+ Subscribers'
    },
    {
      name: 'Facebook',
      icon: <FaFacebook className="w-8 h-8 text-white dark:text-white" />,
      gradient: 'from-blue-500 to-blue-700',
      tasks: ['Like pages', 'Share posts', 'Join groups'],
      stats: '2M+ Page Likes'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter className="w-8 h-8 text-white dark:text-white" />,
      gradient: 'from-blue-400 to-blue-600',
      tasks: ['Follow accounts', 'Retweet', 'Like tweets'],
      stats: '750K+ Followers'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="w-8 h-8 text-white dark:text-white" />,
      gradient: 'from-blue-600 to-blue-800',
      tasks: ['Connect', 'Like posts', 'Share content'],
      stats: '300K+ Connections'
    }
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen ${theme.palette.mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} flex flex-col`}
      >
        {/* Hero Section */}
        <section className={`relative overflow-hidden ${
          theme.palette.mode === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        } py-24 flex-shrink-0`}>
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
          className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={itemAnimation}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mb-4">
                Why Choose BrandHash?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Experience the benefits of our comprehensive verification platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                // Define unique gradients for each feature
                const gradients = [
                  {
                    from: 'from-blue-500',
                    via: 'via-indigo-500',
                    to: 'to-violet-500',
                    text: 'from-blue-600 to-indigo-600',
                    icon: 'text-blue-600'
                  },
                  {
                    from: 'from-emerald-500',
                    via: 'via-teal-500',
                    to: 'to-cyan-500',
                    text: 'from-emerald-600 to-teal-600',
                    icon: 'text-emerald-600'
                  },
                  {
                    from: 'from-amber-500',
                    via: 'via-orange-500',
                    to: 'to-red-500',
                    text: 'from-amber-600 to-orange-600',
                    icon: 'text-amber-600'
                  },
                  {
                    from: 'from-purple-500',
                    via: 'via-fuchsia-500',
                    to: 'to-pink-500',
                    text: 'from-purple-600 to-fuchsia-600',
                    icon: 'text-purple-600'
                  }
                ];

                const gradient = gradients[index];

                return (
                  <motion.div
                    key={index}
                    variants={itemAnimation}
                    whileHover={{ scale: 1.05 }}
                    className="relative group h-[280px]"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from}/20 ${gradient.via}/20 ${gradient.to}/20 dark:${gradient.from}/20 dark:${gradient.via}/20 dark:${gradient.to}/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300`} />
                    <div className={`relative bg-gradient-to-br ${gradient.from}/10 ${gradient.via}/10 ${gradient.to}/10 dark:${gradient.from}/20 dark:${gradient.via}/20 dark:${gradient.to}/20 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 overflow-hidden h-full`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from}/5 ${gradient.via}/5 ${gradient.to}/5 dark:${gradient.from}/10 dark:${gradient.via}/10 dark:${gradient.to}/10 animate-gradient-x`} />
                      <div className="relative z-10 h-full flex flex-col">
                        <div className={`mb-4 ${gradient.icon} dark:${gradient.icon.replace('600', '400')}`}>{feature.icon}</div>
                        <h3 className={`text-xl font-semibold mb-2 bg-gradient-to-r ${gradient.text} dark:${gradient.text.replace('600', '400')} bg-clip-text text-transparent`}>
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 flex-grow">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={itemAnimation}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-fuchsia-600 dark:from-rose-400 dark:to-fuchsia-400 mb-4">
                Key Benefits
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Discover how BrandHash can transform your social media presence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                // Define unique gradients for each benefit with improved dark mode support
                const gradients = [
                  {
                    from: 'from-violet-500',
                    via: 'via-purple-500',
                    to: 'to-fuchsia-500',
                    darkFrom: 'dark:from-violet-400',
                    darkVia: 'dark:via-purple-400',
                    darkTo: 'dark:to-fuchsia-400',
                    text: 'from-violet-600 to-purple-600',
                    darkText: 'dark:from-violet-400 dark:to-purple-400',
                    icon: 'text-violet-600',
                    darkIcon: 'dark:text-violet-400'
                  },
                  {
                    from: 'from-sky-500',
                    via: 'via-blue-500',
                    to: 'to-indigo-500',
                    darkFrom: 'dark:from-sky-400',
                    darkVia: 'dark:via-blue-400',
                    darkTo: 'dark:to-indigo-400',
                    text: 'from-sky-600 to-blue-600',
                    darkText: 'dark:from-sky-400 dark:to-blue-400',
                    icon: 'text-sky-600',
                    darkIcon: 'dark:text-sky-400'
                  },
                  {
                    from: 'from-green-500',
                    via: 'via-emerald-500',
                    to: 'to-teal-500',
                    darkFrom: 'dark:from-green-400',
                    darkVia: 'dark:via-emerald-400',
                    darkTo: 'dark:to-teal-400',
                    text: 'from-green-600 to-emerald-600',
                    darkText: 'dark:from-green-400 dark:to-emerald-400',
                    icon: 'text-green-600',
                    darkIcon: 'dark:text-green-400'
                  }
                ];

                const gradient = gradients[index];

                return (
                  <motion.div
                    key={index}
                    variants={itemAnimation}
                    whileHover={{ scale: 1.05 }}
                    className="relative group h-[280px]"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from}/20 ${gradient.via}/20 ${gradient.to}/20 ${gradient.darkFrom}/20 ${gradient.darkVia}/20 ${gradient.darkTo}/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300`} />
                    <div className={`relative bg-gradient-to-br ${gradient.from}/10 ${gradient.via}/10 ${gradient.to}/10 ${gradient.darkFrom}/20 ${gradient.darkVia}/20 ${gradient.darkTo}/20 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 overflow-hidden h-full`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from}/5 ${gradient.via}/5 ${gradient.to}/5 ${gradient.darkFrom}/10 ${gradient.darkVia}/10 ${gradient.darkTo}/10 animate-gradient-x`} />
                      <div className="relative z-10 h-full flex flex-col">
                        <div className={`mb-4 ${gradient.icon} ${gradient.darkIcon}`}>{benefit.icon}</div>
                        <h3 className={`text-xl font-semibold mb-2 bg-gradient-to-r ${gradient.text} ${gradient.darkText} bg-clip-text text-transparent`}>
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 flex-grow">{benefit.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Social Platforms Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className={`py-20 ${
            theme.palette.mode === 'dark' 
              ? 'bg-gray-800 text-white' 
              : 'bg-white text-gray-900'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={itemAnimation}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 mb-4">
                Supported Platforms
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Expand your reach across multiple social media platforms
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {socialPlatforms.map((platform, index) => (
                <motion.div
                  key={index}
                  variants={itemAnimation}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-r ${platform.gradient} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center mb-4">
                    {platform.icon}
                    <h3 className="text-xl font-semibold text-white ml-3">{platform.name}</h3>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {platform.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-center text-white">
                        <FaCheckCircle className="mr-2" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  <p className="text-white/80 text-sm">{platform.stats}</p>
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
          className={`py-20 ${
            theme.palette.mode === 'dark' 
              ? 'bg-gray-900 text-white' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 text-gray-900'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              variants={itemAnimation}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your Social Media Presence?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of brands that trust BrandHash for their social media verification needs
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('/register')}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Now
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;