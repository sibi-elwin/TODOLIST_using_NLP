import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      rating: 5,
      comment: "This task manager has completely transformed how I organize my work. The AI categorization is spot-on and saves me so much time!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Developer",
      rating: 5,
      comment: "The email reminders are a game-changer. I never miss a deadline now, and the interface is so intuitive.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Freelance Designer",
      rating: 4,
      comment: "Love how it automatically categorizes my tasks. The AI suggestions are surprisingly accurate!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Student",
      rating: 5,
      comment: "Perfect for managing my assignments. The priority system helps me focus on what's important.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % reviews.length;
        return nextIndex;
      });
      setDirection(1);
    }, 2000); // Change review every 5 seconds

    return () => clearInterval(interval);
  }, [reviews.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of satisfied users who have transformed their task management
          </p>
        </motion.div>

        <div className="relative h-[400px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full"
            >
              <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <motion.img
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={reviews[currentIndex].avatar}
                    alt={reviews[currentIndex].name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-white text-xl font-semibold">
                      {reviews[currentIndex].name}
                    </h3>
                    <p className="text-gray-400">{reviews[currentIndex].role}</p>
                  </div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex mb-4"
                >
                  {renderStars(reviews[currentIndex].rating)}
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-300 text-lg leading-relaxed italic"
                >
                  "{reviews[currentIndex].comment}"
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-accent-primary' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection; 