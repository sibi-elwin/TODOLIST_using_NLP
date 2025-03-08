import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import TaskMetrics from '../src/components/TaskMetrics';
import { format, subDays } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { motion } from 'framer-motion';
import { containerVariants, scaleIn } from '../src/styles/animations';

// Register ChartJS components once
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Standardized chart styles
const chartStyles = {
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    x: {
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: 'rgba(255, 255, 255, 0.7)'
      }
    }
  }
};

// Standardized categories and priorities (matching with TaskCard and AI service)
const STANDARD_CATEGORIES = {
  'Health & Wellness': 'rgb(16, 185, 129)', // emerald
  'Social Communication': 'rgb(217, 70, 239)', // Updated to match fuchsia-500
  'Technology': 'rgb(34, 211, 238)', // cyan
  'Finance & Bills': 'rgb(251, 191, 36)', // amber
  'Home Maintenance': 'rgb(59, 130, 246)', // blue
  'General': 'rgb(156, 163, 175)' // gray
};

const Dashboard = ({ tasks }) => {
  // Helper function to normalize category names
  const normalizeCategory = (category) => {
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

  const getWeeklyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    const completedByDay = tasks.reduce((acc, task) => {
      if (task.completed && task.updatedAt) {
        const date = format(new Date(task.updatedAt), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      labels: last7Days.map(date => format(new Date(date), 'EEE')),
      datasets: [{
        label: 'Tasks Completed',
        data: last7Days.map(date => completedByDay[date] || 0),
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.1
      }]
    };
  };

  const getCategoryCompletionData = () => {
    // Group tasks by normalized category and calculate completion rates
    const categoryStats = tasks.reduce((acc, task) => {
      const normalizedCategory = normalizeCategory(task.category);
      
      if (!acc[normalizedCategory]) {
        acc[normalizedCategory] = { total: 0, completed: 0 };
      }
      
      acc[normalizedCategory].total += 1;
      if (task.completed) {
        acc[normalizedCategory].completed += 1;
      }
      
      return acc;
    }, {});

    // Calculate and sort completion rates
    const sortedCategories = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        completionRate: (stats.completed / stats.total) * 100,
        completed: stats.completed,
        total: stats.total,
        color: STANDARD_CATEGORIES[category]
      }))
      .sort((a, b) => b.completionRate - a.completionRate);

    return {
      labels: sortedCategories.map(c => c.category),
      datasets: [{
        label: 'Completion Rate',
        data: sortedCategories.map(c => c.completionRate),
        backgroundColor: sortedCategories.map(c => `${c.color}cc`), // Add transparency
        borderColor: sortedCategories.map(c => c.color),
        borderWidth: 1
      }]
    };
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-100">Task Analytics</h2>
      
      <TaskMetrics tasks={tasks} />
      
      <motion.div variants={scaleIn} className="gap-6">
        <div className="glass-effect card-hover rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-100">Daily Progress</h3>
          <div style={{ height: '300px' }}>
            <Line 
              data={getWeeklyData()} 
              options={{ 
                ...chartStyles,
                maintainAspectRatio: false,
                scales: {
                  ...chartStyles.scales,
                  y: {
                    ...chartStyles.scales.y,
                    ticks: {
                      ...chartStyles.scales.y.ticks,
                      stepSize: 1
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </motion.div>

      <div className="glass-effect card-hover rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Most Prioritized Categories</h3>
        <p className="text-gray-400 mb-4">Based on your completion patterns</p>
        <div style={{ height: '400px' }}>
          <Bar
            data={getCategoryCompletionData()}
            options={{
              ...chartStyles,
              indexAxis: 'y',
              maintainAspectRatio: false,
              scales: {
                x: {
                  ...chartStyles.scales.x,
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    ...chartStyles.scales.x.ticks,
                    callback: value => `${value}%`
                  }
                },
                y: {
                  ...chartStyles.scales.y,
                  grid: {
                    display: false
                  }
                }
              },
              plugins: {
                ...chartStyles.plugins,
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard; 