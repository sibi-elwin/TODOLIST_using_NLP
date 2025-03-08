import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import Sidebar from './Sidebar'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import ProfileMenu from './ProfileMenu'
import Dashboard from '../../pages/Dashboard'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn, slideIn, containerVariants } from '../styles/animations'
import ChatBot from './ChatBot'

const Layout = () => {
  const [currentView, setCurrentView] = useState('list')
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get("http://localhost:3000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      if (error.response?.status === 401) {
        toast.error('Please log in again')
        navigate('/auth')
      } else {
        toast.error('Failed to load tasks')
      }
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleTaskCreated = useCallback(async (newTask) => {
    setTasks(prev => [newTask, ...prev])
    setCurrentView('list') // Switch to list view after creating a task
  }, [])

  const handleTaskUpdated = useCallback((updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    )
  }, [])

  const handleTaskDeleted = useCallback((taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/auth')
    toast.success('Logged out successfully')
  }

  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <TaskList 
            tasks={tasks}
            isLoading={isLoading}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        )
      case 'create':
        return <TaskForm onTaskCreated={handleTaskCreated} />
      case 'analytics':
        return <Dashboard tasks={tasks} />
      default:
        return null
    }
  }

  return (
    <motion.div 
      className="flex min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 grid-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <motion.main 
        className="flex-1 ml-64 p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent-primary"></div>
              </div>
            ) : (
              renderContent()
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>
      <ChatBot />
    </motion.div>
  )
}

export default Layout 