const express = require('express');
const router = express.Router();
const axios = require('axios');
const { logger } = require('../utils/logger');
const authMiddleware = require('../middleware/authMiddleware');
 // Import your AI prediction logic
 const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Add authentication middleware
const FLASK_API_URL = ' http://127.0.0.1:5000'
const normalizeCategory = (category) => {
  const categoryLower = category.toLowerCase();
  
  for (const [key, value] of Object.entries(STANDARD_CATEGORIES)) {
    if (categoryLower.includes(key)) {
      return value;
    }
  }
  
  return STANDARD_CATEGORIES.general;
}; 

// Add this constant at the top of the file
const STANDARD_CATEGORIES = {
  'health': 'Health & Wellness',
  'social': 'Social Communication',
  'tech': 'Technology',
  'finance': 'Finance & Bills',
  'home': 'Home Maintenance',
  'general': 'General'
};


// Middleware to handle AI analysis requests
router.post('/api/analyze', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required',
      });
    }

    // Combine title and description for AI analysis
    const textToAnalyze = `${title} ${description}`.trim();

    // Call Flask API for prediction
    const response = await axios.post(
      `${FLASK_API_URL}/predict`,
      { text: textToAnalyze },
    
    );

    if (response.data.error) {
      console.error('AI Model Error:', response.data.error);
      return res.status(500).json({
        message: 'AI model error',
        fallback: {
          category: 'errands',
          priority: 'medium',
        },
      });
    }

    // Normalize category
    const predictedCategory = response.data.predicted_category.toLowerCase();
    const normalizedCategory = normalizeCategory(predictedCategory);

    // Prepare AI analysis response
    const aiAnalysis = {
      analysis: {
        category: {
          label: normalizedCategory,
          confidence: response.data.category_confidence,
        },
        priority: {
          level: response.data.predicted_priority.toLowerCase(),
          confidence: response.data.priority_confidence,
        },
      },
    };

    res.json(aiAnalysis);
  } catch (error) {
    console.error('AI Analysis Error:', error.message || error);

    // Return a fallback response if AI service fails
    res.status(500).json({
      message: 'Error analyzing task',
      fallback: {
        category: 'errands',
        priority: 'medium',
      },
    });
  }
});

module.exports = router;

router.post('/api/user-tasks', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from auth middleware
    const { message } = req.body;
    // Fetch all tasks for the authenticated user
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' } // Optional: Order tasks by newest first
    });
    const taskList = tasks.length
    ? tasks.map((task, index) =>
        `${index + 1}. ${task.title} - ${task.description || "No description"} (Due: ${task.dueDate || "No due date"})`
    ).join("\n")
    : "No tasks available.";

// ✅ Step 3: Send request to Gemini AI with both tasks and the user's query
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCTTS24IilfC9fTcwGEQx1BnYCtisZaIEY`;
const aiRequest = {
    contents: [{
        parts: [{
            text: `User's Current Tasks:\n${taskList}\n\nUser's Query: ${message}`
        }]
    }]
};

const aiResponse = await axios.post(
    GEMINI_API_URL,
    aiRequest,
    { headers: { "Content-Type": "application/json" } }
);

res.json({ response: aiResponse.data });

    
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error retrieving tasks' });
  }
});



module.exports = router; 