import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReviewSection from './ReviewSection';
import TaskManagementDemo from './TaskManagementDemo';
// ... other imports
import TaskAnimation from './TaskAnimation';
import management2 from '../assets/management2.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Voice Notes Integration",
      description: "Capture your thoughts and tasks naturally through voice recordings, making task creation effortless.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      bgGradient: 'from-purple-500/20 to-indigo-500/20'
    },
    {
      title: "AI-Powered Insights",
      description: "Receive intelligent suggestions and task categorization through our advanced AI analysis system.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bgGradient: 'from-pink-500/20 to-rose-500/20'
    },
    {
      title: "Visual Analytics",
      description: "Track your progress with beautiful charts and get insights into your task completion patterns.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgGradient: 'from-cyan-500/20 to-blue-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Sticky Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-dark-100/95 backdrop-blur-lg border-b border-dark-300/50 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Senior Todo List
          </motion.div>
          
          <div className="space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate('/auth?mode=login')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-lg 
                shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
            >
              Sign In
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate('/auth?mode=register')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg 
                shadow-lg hover:shadow-gray-500/30 transition-all duration-300 border border-gray-600"
            >
              Sign Up
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6">
        {/* Enhanced Hero Section */}
        <div className="pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left space-y-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                from-white via-indigo-200 to-indigo-400 leading-tight">
                Organize Your Tasks
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r 
                  from-indigo-400 to-purple-500">Effortlessly</span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-400 leading-relaxed"
              >
                A thoughtfully designed task management system for those who value simplicity 
                and efficiency in their daily routines.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-6"
              >
                <button
                  onClick={() => navigate('/auth?mode=register')}
                  className="group relative bg-gradient-to-r from-indigo-600 to-indigo-700 
                    text-white px-8 py-4 rounded-xl text-lg transition-all duration-300
                    hover:shadow-lg hover:shadow-indigo-500/30 overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="group relative bg-gray-800 text-white px-8 py-4 rounded-xl text-lg 
                    transition-all duration-300 hover:shadow-lg hover:shadow-gray-700/30
                    border border-gray-700 overflow-hidden"
                >
                  <span className="relative z-10">Learn More</span>
                  <div className="absolute inset-0 bg-gray-700 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </motion.div>
            </motion.div>

            {/* Enhanced Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 
                rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <img
                src={management2}
                alt="Task Management"
                className="relative rounded-2xl shadow-2xl w-full transform 
                  group-hover:scale-[1.02] transition-transform duration-500"
              />
            </motion.div>
          </div>

          {/* Enhanced Features Section with Stacked Effect */}
          <div id="features" className="relative py-24">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gray-900 to-gray-900/0 pointer-events-none"></div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                Powerful Features
              </h2>
              <p className="text-gray-400 mt-4">Discover what makes our task management system unique</p>
            </motion.div>
            
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 relative">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0,
                    transition: { 
                      duration: 0.8,
                      delay: index * 0.2,
                      type: "spring",
                      stiffness: 100
                    }
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className={`
                    group relative bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl
                    border border-gray-700/50 hover:border-indigo-500/50 
                    transition-all duration-500 transform-gpu
                    hover:shadow-[0_0_30px_rgba(79,70,229,0.1)]
                    bg-gradient-to-br ${feature.bgGradient}
                  `}
                >
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 
                    opacity-0 group-hover:opacity-90 transition-opacity duration-500 rounded-2xl"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <motion.div 
                      className="mb-6 w-16 h-16 rounded-xl bg-gray-800/50 flex items-center justify-center
                        group-hover:bg-gray-700/50 transition-all duration-300"
                      whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <motion.h3 
                      className="text-2xl font-semibold text-gray-100 mb-4"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1.02 }}
                    >
                      {feature.title}
                    </motion.h3>
                    
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 
                      transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 
                      bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full 
                      blur-2xl group-hover:from-indigo-500/20 group-hover:to-purple-500/20 
                      transition-all duration-500"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <TaskAnimation/>
          <TaskManagementDemo/>
          <ReviewSection/>

          {/* About Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-100 mb-6">About Our Project</h2>
            <p className="text-gray-400 mb-8">
              Senior Todo List was created with a vision to simplify task management while maintaining 
              a sense of elegance and tranquility. Our platform combines modern technology with an 
              intuitive interface, making it perfect for users who appreciate both functionality and aesthetics.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-xl py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-center md:text-left mb-4 md:mb-0">
              © 2024 Senior Todo List. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors duration-300">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 