import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Lottie from 'lottie-react';
import { 
  FaHeartbeat,  // Health & Wellness
  FaWallet,     // Finance & Bills
  FaHome,       // Home Maintenance
  FaUsers,      // Social & Communication
  FaLaptop,     // Technology Assistance
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaTasks,
  FaMoneyBillWave,
  FaLaptopCode,
  FaBell,
  FaClock
} from 'react-icons/fa';

// Import animations from the correct paths
import health from '../assets/animations/health-animation.json';
import home from '../assets/animations/home-animation.json';
import finance from '../assets/animations/finance-animation.json';
import social from '../assets/animations/social-animation.json';
import tech from '../assets/animations/tech-animation.json';

// Update category mapping to match your backend categories
const categoryAnimations = {
  'health': health,
  'social': social,
  'tech': tech,
  'finance': finance,
  'home': home,
  'general': home
};

const categoryConfig = {
  'Health & Wellness': {
    animation: health,
    icon: <FaHeartbeat className="w-6 h-6 transition-transform group-hover:animate-heartbeat-strong text-red-400" />,
    color: 'bg-emerald-400/40',
    bgColor: 'from-emerald-400/30 to-green-500/30',
    hoverAnimation: 'group-hover:scale-110'
  },
  'Social Communication': {
    animation: social,
    icon: <FaUsers className="w-6 h-6 transition-transform group-hover:animate-vibrate" />,
    color: 'bg-fuchsia-400/40',
    bgColor: 'from-fuchsia-400/30 to-fuchsia-500/30',
    iconColor: 'text-fuchsia-300 group-hover:text-fuchsia-200',
    hoverAnimation: 'group-hover:scale-110'
  },
  'Technology': {
    animation: tech,
    icon: <FaLaptopCode className="w-6 h-6 group-hover:text-yellow-300 transition-all duration-300" />,
    color: 'bg-cyan-400/40',
    bgColor: 'from-cyan-400/30 to-pink-500/30',
    iconColor: 'text-cyan-300 group-hover:text-cyan-200',
    hoverAnimation: 'lightning-flash'
  },
  'Finance & Bills': {
    animation: finance,
    icon: <FaMoneyBillWave className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />,
    color: 'bg-amber-400/40',
    bgColor: 'from-amber-400/30 to-orange-500/30',
    hoverAnimation: 'hover:animate-wiggle'
  },
  'Home Maintenance': {
    animation: home,
    icon: <FaHome className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />,
    color: 'bg-blue-400/40',
    bgColor: 'from-blue-400/30 to-indigo-500/30',
    hoverAnimation: 'hover:animate-bounce'
  },
  'General': {
    animation: home,
    icon: <FaTasks className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />,
    color: 'bg-gray-400/40',
    bgColor: 'from-gray-400/30 to-gray-500/30',
    hoverAnimation: 'hover:animate-bounce'
  }
};

const formatCategory = (category) => {
  if (!category) return 'General';
  
  const categoryLower = category.toLowerCase();
  
  // Map to standardized category names
  if (categoryLower.includes('health')) return 'Health & Wellness';
  if (categoryLower.includes('social')) return 'Social Communication';
  if (categoryLower.includes('tech')) return 'Technology';
  if (categoryLower.includes('finance')) return 'Finance & Bills';
  if (categoryLower.includes('home')) return 'Home Maintenance';
  
  return 'General';
};

const getCategoryConfig = (category) => {
  if (!category) return categoryConfig.General;
  
  const categoryLower = category.toLowerCase();
  
  // Check for each category type
  if (categoryLower.includes('health')) return categoryConfig['Health & Wellness'];
  if (categoryLower.includes('social')) return categoryConfig['Social Communication'];
  if (categoryLower.includes('tech')) return categoryConfig['Technology'];
  if (categoryLower.includes('finance')) return categoryConfig['Finance & Bills'];
  if (categoryLower.includes('home')) return categoryConfig['Home Maintenance'];
  
  return categoryConfig.General;
};

const TaskCard = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHeartBeating, setIsHeartBeating] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  // Get animation for category with better error handling
  const getAnimationData = (category) => {
    if (!category) return categoryAnimations.General;
    
    // Log the incoming category
    console.log('Category received:', category);
    
    // Try to find a matching animation by checking if the category includes any of our keys
    const matchingKey = Object.keys(categoryAnimations).find(key => 
      category.toLowerCase().includes(key.toLowerCase())
    );
    
    // Log the matched key
    console.log('Matched animation key:', matchingKey);
    
    return categoryAnimations[matchingKey] || categoryAnimations.General;
  };

  const categoryStyle = getCategoryConfig(task.category);

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy hh:mm a');
  };

  const handleComplete = async () => {
    try {
      setIsUpdating(true);
      const updatedTask = {
        ...task,
        completed: !task.completed
      };

      const response = await axios.put(
        `http://localhost:3000/api/tasks/${task.id}`,
        updatedTask,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        onTaskUpdated(response.data);
        toast.success(task.completed ? 'Task marked as incomplete' : 'Task marked as complete');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = async () => {
    // Implement edit functionality
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${task.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      onTaskDeleted(task.id);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative overflow-hidden bg-gray-800/90 backdrop-blur-md rounded-xl p-6 
        border border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300
        group ${task.completed ? 'opacity-75' : ''}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      onHoverStart={() => {
        setIsHeartBeating(true);
        setIsVibrating(true);
      }}
      onHoverEnd={() => {
        setIsHeartBeating(false);
        setIsVibrating(false);
      }}
    >
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 bg-gray-900/95 backdrop-blur-sm 
              rounded-xl flex items-center justify-center"
          >
            <motion.div className="text-center p-6">
              <h3 className="text-white text-lg font-semibold mb-4">
                Delete this task?
              </h3>
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 
                    rounded-lg text-white font-medium"
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 
                    rounded-lg text-white font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation Container */}
      <div className="absolute top-2 right-2 w-40 h-40 opacity-30 group-hover:opacity-40 transition-opacity duration-300">
        <Lottie
          animationData={categoryStyle.animation}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryStyle.bgColor} opacity-100 
        group-hover:opacity-90 transition-opacity duration-300`} />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* Category and Priority Section */}
        <div className="flex items-center justify-between">
          <motion.div 
            className={`px-4 py-2 rounded-lg ${categoryStyle.color} flex items-center gap-2 
              backdrop-blur-sm border border-white/10 shadow-lg cursor-pointer
              group-hover:border-white/20 transition-all duration-300`}
          >
            {task.category.toLowerCase().includes('health') ? (
              <motion.div
                animate={isHeartBeating ? {
                  scale: [1, 1.3, 1, 1.3, 1],
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                } : {}}
                className="text-red-400"
              >
                <FaHeartbeat className="w-6 h-6" />
              </motion.div>
            ) : task.category.toLowerCase().includes('social') ? (
              <motion.div
                animate={isVibrating ? {
                  x: [-2, 2, -2, 2, 0],
                  y: [1, -1, 1, -1, 0],
                  transition: {
                    duration: 0.3,
                    repeat: Infinity,
                    ease: "linear"
                  }
                } : {}}
                className="text-fuchsia-300 group-hover:text-fuchsia-200 drop-shadow-glow"
              >
                <FaUsers className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div className={`transition-all duration-500 ease-out ${
                task.category.toLowerCase().includes('tech') 
                  ? 'group-hover:lightning-flash' 
                  : categoryStyle.hoverAnimation
              }`}>
                {categoryStyle.icon}
              </motion.div>
            )}
            <span className="text-base font-medium text-white group-hover:text-white/90">
              {formatCategory(task.category)}
            </span>
          </motion.div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-200">Priority:</span>
            <div className={`h-3 w-3 rounded-full shadow-lg ${getPriorityColor(task.priority)}`} />
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-3">
          <h3 className={`text-xl font-semibold text-white ${
            task.completed ? 'line-through text-gray-300' : ''
          }`}>
            {task.title}
          </h3>
          <p className="text-gray-200 text-base leading-relaxed">{task.description}</p>
        </div>

        {/* Due Date and Time */}
        {task.dueDate && (
          <div className="flex items-center gap-2 text-gray-200">
            <FaClock className="w-5 h-5 text-indigo-400" />
            <span className="text-base">
              Due: {formatDateTime(task.dueDate)}
            </span>
          </div>
        )}

        {/* Reminder Time */}
        {task.reminderTime && (
          <div className="flex items-center gap-2 text-gray-200">
            <FaBell className="w-5 h-5 text-yellow-400" />
            <span className="text-base">
              Reminder: {formatDateTime(task.reminderTime)}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            disabled={isUpdating}
            className={`p-3 rounded-full shadow-lg ${
              task.completed 
                ? 'bg-yellow-400 hover:bg-yellow-500' 
                : 'bg-green-400 hover:bg-green-500'
            }`}
          >
            <FaCheckCircle className="w-5 h-5 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.info('Edit functionality coming soon')}
            className="p-3 rounded-full bg-blue-400 hover:bg-blue-500 shadow-lg"
          >
            <FaEdit className="w-5 h-5 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="p-3 rounded-full bg-red-400 hover:bg-red-500 shadow-lg"
          >
            <FaTrash className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Add these styles to your global CSS or Tailwind config
const styles = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  @keyframes pulse-red {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; background-color: rgba(239, 68, 68, 0.2); }
  }

  @keyframes pulse-green {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; background-color: rgba(16, 185, 129, 0.2); }
  }

  @keyframes pulse-blue {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; background-color: rgba(59, 130, 246, 0.2); }
  }

  @keyframes pulse-purple {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; background-color: rgba(139, 92, 246, 0.2); }
  }

  @keyframes pulse-yellow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; background-color: rgba(245, 158, 11, 0.2); }
  }

  .animate-pulse-red { animation: pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .animate-pulse-green { animation: pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .animate-pulse-blue { animation: pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .animate-pulse-purple { animation: pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .animate-pulse-yellow { animation: pulse-yellow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

  @keyframes lightning-flash {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
      filter: drop-shadow(0 0 0 rgba(250, 204, 21, 0));
    }
    25% {
      opacity: 1;
      transform: scale(1.2);
      filter: drop-shadow(0 0 5px rgba(250, 204, 21, 0.7));
    }
    50% {
      opacity: 0.8;
      transform: scale(1);
      filter: drop-shadow(0 0 10px rgba(250, 204, 21, 0.5));
    }
    75% {
      opacity: 1;
      transform: scale(1.1);
      filter: drop-shadow(0 0 15px rgba(250, 204, 21, 0.3));
    }
  }

  .lightning-flash {
    animation: lightning-flash 1.5s ease-in-out infinite;
  }
`;

export default TaskCard; 