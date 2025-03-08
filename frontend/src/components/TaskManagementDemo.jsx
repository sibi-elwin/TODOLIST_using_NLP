import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaTasks, FaBrain } from 'react-icons/fa';

const TaskManagementDemo = () => {
  const features = [
    {
      icon: <FaTasks className="w-5 h-5" />,
      title: "Smart Organization",
      description: "AI-powered task categorization",
      color: "text-blue-400"
    },
    {
      icon: <FaBrain className="w-5 h-5" />,
      title: "AI Insights",
      description: "Intelligent priority suggestions",
      color: "text-purple-400"
    },
    {
      icon: <FaClock className="w-5 h-5" />,
      title: "Reminders",
      description: "Never miss deadlines",
      color: "text-green-400"
    },
    {
      icon: <FaCheckCircle className="w-5 h-5" />,
      title: "Progress",
      description: "Visual completion tracking",
      color: "text-pink-400"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <section className="relative py-12 overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800/95 to-gray-900 transform-gpu"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 relative"
        >
          {/* Decorative blur effect behind title */}
          <div className="absolute inset-0 -top-8 bg-gradient-to-r from-accent-primary/10 via-purple-500/10 to-accent-primary/10 blur-3xl"></div>
          
          <h2 className="relative text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Smart Task Management
          </h2>
          <p className="relative text-gray-400/90 text-base max-w-xl mx-auto backdrop-blur-sm">
            Experience efficient task organization with AI assistance
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 hover:bg-gray-800/60 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-700/30"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`${feature.color} mb-2`}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-xs">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-gray-700/30 shadow-lg"
        >
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <motion.div
                key={item}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: item * 0.15 }}
                className="flex items-center bg-gray-800/40 rounded-xl p-4 hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/20"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-3 h-3 rounded-full bg-accent-primary mr-3 shadow-md shadow-accent-primary/20"
                />
                <div className="flex-1">
                  <div className="h-3 bg-gray-700/40 rounded-full w-3/4" />
                  <div className="h-2 bg-gray-700/20 rounded-full w-1/2 mt-2" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 bg-accent-primary/10 text-accent-primary rounded-full text-xs border border-accent-primary/20 hover:bg-accent-primary/20 transition-all duration-300"
                >
                  Done
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TaskManagementDemo; 