import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Add standardized priorities
const STANDARD_PRIORITIES = {
  'high': {
    label: 'High',
    color: 'rgba(239, 68, 68, 0.8)',    // red-500
    borderColor: 'rgba(239, 68, 68, 1)',
    indicatorClass: 'bg-red-500'
  },
  'medium': {
    label: 'Medium',
    color: 'rgba(234, 179, 8, 0.8)',    // yellow-500
    borderColor: 'rgba(234, 179, 8, 1)',
    indicatorClass: 'bg-yellow-500'
  },
  'low': {
    label: 'Low',
    color: 'rgba(34, 197, 94, 0.8)',    // green-500
    borderColor: 'rgba(34, 197, 94, 1)',
    indicatorClass: 'bg-green-500'
  }
};

const PriorityDistribution = ({ tasks }) => {
  // Normalize and calculate distributions
  const priorityCounts = tasks.reduce((acc, task) => {
    const normalizedPriority = task.priority?.toLowerCase() || 'low';
    acc[normalizedPriority] = (acc[normalizedPriority] || 0) + 1;
    return acc;
  }, {});

  // Calculate completed vs pending with normalized priorities
  const completionByPriority = tasks.reduce((acc, task) => {
    const normalizedPriority = task.priority?.toLowerCase() || 'low';
    if (!acc[normalizedPriority]) {
      acc[normalizedPriority] = { completed: 0, pending: 0 };
    }
    if (task.completed) {
      acc[normalizedPriority].completed++;
    } else {
      acc[normalizedPriority].pending++;
    }
    return acc;
  }, {});

  // Update chart data to use standardized priorities
  const doughnutData = {
    labels: Object.values(STANDARD_PRIORITIES).map(p => p.label),
    datasets: [{
      data: Object.keys(STANDARD_PRIORITIES).map(p => priorityCounts[p] || 0),
      backgroundColor: Object.values(STANDARD_PRIORITIES).map(p => p.color),
      borderColor: Object.values(STANDARD_PRIORITIES).map(p => p.borderColor),
      borderWidth: 1,
    }],
  };

  // Update bar data
  const barData = {
    labels: Object.values(STANDARD_PRIORITIES).map(p => p.label),
    datasets: [
      {
        label: 'Completed',
        data: Object.keys(STANDARD_PRIORITIES).map(p => 
          completionByPriority[p]?.completed || 0
        ),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: Object.keys(STANDARD_PRIORITIES).map(p => 
          completionByPriority[p]?.pending || 0
        ),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(156, 163, 175)',
          font: { size: 14 },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(156, 163, 175)',
          font: { size: 14 },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Completion Status by Priority',
        color: 'rgb(156, 163, 175)',
        font: { size: 16 },
        padding: { bottom: 20 }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(156, 163, 175, 0.2)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      }
    },
    barPercentage: 0.7,
    categoryPercentage: 0.8
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30"
    >
      <h2 className="text-xl font-semibold text-gray-200 mb-6">
        Task Distribution Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Distribution */}
        <div className="space-y-6">
          <h3 className="text-lg text-gray-300">Priority Distribution</h3>
          <div className="relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Completion Status */}
        <div className="space-y-6">
          <h3 className="text-lg text-gray-300">Completion Status</h3>
          <div className="relative">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {Object.entries(STANDARD_PRIORITIES).map(([priority, config]) => (
            <motion.div
              key={priority}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: Object.keys(STANDARD_PRIORITIES).indexOf(priority) * 0.1 }}
              className="bg-gray-700/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.indicatorClass}`}></div>
                  <span className="text-gray-300">{config.label}</span>
                </div>
                <span className="text-lg font-semibold text-gray-200">
                  {priorityCounts[priority] || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Completed: {completionByPriority[priority]?.completed || 0}</span>
                <span>Pending: {completionByPriority[priority]?.pending || 0}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PriorityDistribution; 