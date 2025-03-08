"use client"

import React, { useState, useEffect } from 'react';
import TaskCard from "./TaskCard"
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../styles/animations';
import { checkAIServiceHealth } from '../services/aiService';

function TaskList({ tasks, isLoading, onTaskUpdated, onTaskDeleted }) {
  const [showCompleted, setShowCompleted] = useState(false)
  const filteredTasks = showCompleted ? tasks : tasks.filter(task => !task.completed)
  const [aiServiceStatus, setAiServiceStatus] = useState('checking');

  useEffect(() => {
    const checkAIService = async () => {
      const isHealthy = await checkAIServiceHealth();
      setAiServiceStatus(isHealthy ? 'available' : 'unavailable');
    };
    checkAIService();
  }, []);
  

  const handleTaskUpdate = (updatedTask) => {
    if (onTaskUpdated) {
      onTaskUpdated(updatedTask);
    }
  };

  const handleTaskDelete = (taskId) => {
    if (onTaskDeleted) {
      onTaskDeleted(taskId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {aiServiceStatus === 'unavailable' && (
        <div className="text-yellow-500 text-sm mb-4">
          AI categorization service is currently unavailable. Manual categorization will be used.
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Task Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              {tasks.length} total tasks, {tasks.filter(t => !t.completed).length} pending
            </p>
          </div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 text-lg">
            {showCompleted 
              ? 'No completed tasks yet.' 
              : 'No pending tasks. Create one!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              variants={itemVariants}
              className="glass-effect card-hover rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TaskCard
                task={task}
                onTaskUpdated={handleTaskUpdate}
                onTaskDeleted={handleTaskDelete}
              />
            </div>
            
          ))}
          
        </div>
      )}
    </motion.div>
  )
}

export default TaskList

