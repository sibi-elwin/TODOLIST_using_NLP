import React from 'react';
import PriorityDistribution from './PriorityDistribution';

// Add standardized categories mapping
const STANDARD_CATEGORIES = {
  'Health & Wellness': 'bg-emerald-400',
  'Social Communication': 'bg-fuchsia-500',
  'Technology': 'bg-cyan-400',
  'Finance & Bills': 'bg-amber-400',
  'Home Maintenance': 'bg-blue-400',
  'General': 'bg-gray-400'
};

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

const TaskMetrics = ({ tasks }) => {
  const calculateMetrics = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    // Normalize categories when counting
    const byCategory = tasks.reduce((acc, task) => {
      const normalizedCategory = normalizeCategory(task.category);
      acc[normalizedCategory] = (acc[normalizedCategory] || 0) + 1;
      return acc;
    }, {});

    return { total, completed, pending, byCategory };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Basic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Completion Rate</h3>
          <div className="flex items-center justify-center">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(107, 114, 128, 0.2)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray={`${(metrics.completed / metrics.total) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold text-blue-500">
                    {metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 0}%
                  </span>
                  <p className="text-sm text-gray-400 mt-1">Completed</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 text-center">
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-500">{metrics.completed}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-500">{metrics.pending}</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
          </div>
        </div>

        {/* Update Categories section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Tasks by Category</h3>
          <div className="space-y-3">
            {Object.entries(metrics.byCategory)
              .sort(([,a], [,b]) => b - a) // Sort by count in descending order
              .map(([category, count]) => (
                <div key={category} 
                  className="flex justify-between items-center bg-gray-700/30 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${STANDARD_CATEGORIES[category]}/60`} />
                    <span className="text-gray-300">{category}</span>
                  </div>
                  <span className="text-lg font-semibold text-blue-500">{count}</span>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <PriorityDistribution tasks={tasks} />
    </div>
  );
};

export default TaskMetrics; 