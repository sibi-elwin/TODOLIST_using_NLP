import React from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import taskAnimation from '../assets/animations/task-management.json';

const TaskAnimation = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Add a smooth fade-out effect before navigation
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.style.opacity = '0';
      mainContent.style.transition = 'opacity 0.3s ease-out';
    }

    // Navigate to signup page after brief delay for animation
    setTimeout(() => {
      navigate('/auth?mode=register');
    }, 300);
  };

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800/95 to-gray-900"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Organize Tasks Effortlessly
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              Let our AI-powered system handle the organization while you focus on what matters most.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="group px-6 py-3 bg-accent-primary rounded-full text-white font-semibold 
                       shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 
                       hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
            >
              Get Started
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="inline-block"
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 via-purple-500/10 to-accent-primary/10 blur-3xl -z-10"></div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 shadow-xl">
              <Lottie
                animationData={taskAnimation}
                loop={true}
                className="w-full h-auto max-w-md mx-auto"
                onClick={handleGetStarted}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TaskAnimation; 