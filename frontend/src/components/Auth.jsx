"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import Lottie from "lottie-react"
import loginAnimation from "../assets/animations/task-animation.json"

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/${isLogin ? 'login' : 'register'}`,
        isLogin ? { email, password } : { name, email, password }
      )
      localStorage.setItem("token", response.data.token)
      toast.success(isLogin ? "Login successful!" : "Registration successful!")
      navigate("/dashboard")
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        <div className="glass-effect card-hover rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <Lottie
              animationData={loginAnimation}
              style={{ width: 150, height: 150 }}
            />
          </div>

          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-gray-200 mb-2 text-lg">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-200 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent-primary"
                  required
                  autoComplete="name"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-gray-200 mb-2 text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-200 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent-primary"
                required
                autoComplete="email"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-200 mb-2 text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-200 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent-primary"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-accent-primary hover:bg-accent-hover text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-300"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300 text-lg">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLogin(!isLogin)}
                className="text-accent-primary hover:text-accent-hover font-semibold ml-1"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </motion.button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Auth

