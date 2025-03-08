import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { toast } from 'react-toastify'

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/auth')
    toast.success('Logged out successfully')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 group"
      >
        <span className="sr-only">Open user menu</span>
        <div className="relative">
          <UserCircleIcon className="h-10 w-10 text-gray-400 group-hover:text-gray-500 transition-colors" />
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          onClick={() => setIsOpen(false)}
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-700">Signed in as</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {localStorage.getItem('userEmail') || 'User'}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu 