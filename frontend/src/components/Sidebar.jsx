import { ClipboardDocumentListIcon, PlusCircleIcon, ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Sidebar({ currentView, setCurrentView }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()

  const navigation = [
    {
      name: 'Task Dashboard',
      icon: ClipboardDocumentListIcon,
      view: 'list',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      name: 'Create Task',
      icon: PlusCircleIcon,
      view: 'create',
      gradient: 'from-emerald-500 to-teal-400'
    },
    {
      name: 'Analytics',
      icon: ChartBarIcon,
      view: 'analytics',
      gradient: 'from-purple-500 to-fuchsia-400'
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/auth')
    toast.success('Logged out successfully')
  }

  return (
    <motion.div 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 w-72 fixed h-full min-h-screen flex flex-col shadow-2xl border-r border-gray-700/30 backdrop-blur-xl"
    >
      <div className="p-6 mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Senior Todo
        </h1>
        <div className="mt-2 text-sm text-gray-400">Task Management System</div>
      </div>

      <nav className="px-4 space-y-2 flex-1">
        {navigation.map((item, index) => (
          <motion.button
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setCurrentView(item.view)}
            className={`
              group w-full flex items-center px-4 py-3 text-lg font-medium rounded-xl
              transition-all duration-300 ease-out
              ${currentView === item.view 
                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }
            `}
          >
            <item.icon
              className={`
                mr-3 flex-shrink-0 h-6 w-6 transition-all duration-300
                ${currentView === item.view 
                  ? 'text-white' 
                  : 'text-gray-500 group-hover:text-gray-300'
                }
              `}
              aria-hidden="true"
            />
            {item.name}
          </motion.button>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="border-t border-gray-700/30 p-4">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center px-4 py-3 text-lg font-medium 
              text-gray-300 hover:bg-gray-800/50 rounded-xl transition-all duration-300
              bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm
              shadow-lg border border-gray-700/30"
          >
            <UserCircleIcon className="h-8 w-8 mr-3 text-purple-400" />
            <span>Profile</span>
          </motion.button>
          
          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 w-full mb-2 
                bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl 
                border border-gray-700/30 overflow-hidden"
            >
              <motion.button
                whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-gray-300 
                  hover:text-white transition-colors duration-200
                  flex items-center space-x-2"
              >
                <span>Logout</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar 