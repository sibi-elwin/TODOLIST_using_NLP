import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import thinkingAnimation from '../assets/animations/thinking-animation.json';
import writingAnimation from '../assets/animations/writing-animation.json';
import successAnimation from '../assets/animations/success-animation.json';

const AnimationTest = () => {
  const [currentAnimation, setCurrentAnimation] = useState('thinking');

  const playSequence = async () => {
    // Play thinking animation
    setCurrentAnimation('thinking');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Transition to writing
    setCurrentAnimation('writing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success animation
    setCurrentAnimation('success');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset to thinking
    setCurrentAnimation('thinking');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Animation Test Page</h1>
      
      {/* Animation Container */}
      <div className="relative w-96 h-96 bg-gray-800/30 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30">
        <AnimatePresence mode="wait">
          {currentAnimation === 'thinking' && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Lottie
                animationData={thinkingAnimation}
                loop={true}
                className="w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-gray-900/80 px-3 py-1 rounded-full text-sm text-gray-300">
                Thinking...
              </div>
            </motion.div>
          )}
          
          {currentAnimation === 'writing' && (
            <motion.div
              key="writing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Lottie
                animationData={writingAnimation}
                loop={true}
                className="w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-gray-900/80 px-3 py-1 rounded-full text-sm text-gray-300">
                Writing...
              </div>
            </motion.div>
          )}
          
          {currentAnimation === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Lottie
                animationData={successAnimation}
                loop={false}
                className="w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-gray-900/80 px-3 py-1 rounded-full text-sm text-gray-300">
                Success!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-8 space-x-4">
        <button
          onClick={() => setCurrentAnimation('thinking')}
          className={`px-4 py-2 rounded-lg ${
            currentAnimation === 'thinking' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700 text-gray-300'
          } hover:bg-opacity-80 transition-colors`}
        >
          Thinking
        </button>
        <button
          onClick={() => setCurrentAnimation('writing')}
          className={`px-4 py-2 rounded-lg ${
            currentAnimation === 'writing' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700 text-gray-300'
          } hover:bg-opacity-80 transition-colors`}
        >
          Writing
        </button>
        <button
          onClick={() => setCurrentAnimation('success')}
          className={`px-4 py-2 rounded-lg ${
            currentAnimation === 'success' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700 text-gray-300'
          } hover:bg-opacity-80 transition-colors`}
        >
          Success
        </button>
        <button
          onClick={playSequence}
          className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-opacity-80 transition-colors"
        >
          Play Sequence
        </button>
      </div>
    </div>
  );
};

export default AnimationTest;
