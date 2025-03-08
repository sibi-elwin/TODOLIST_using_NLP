const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');
const { logger } = require('../utils/logger');
const path = require('path');

const prisma = new PrismaClient();

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});

const upload = multer({ storage: storage });

// Apply auth middleware to all task routes
router.use(authMiddleware);

// Get all tasks
router.get('/', async (req, res) => {
  try {
    console.log('User ID from request:', req.user.id); // Debug log

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: 'desc' // Most recent tasks first
      }
    });

    console.log('Tasks found:', tasks.length); // Debug log
    res.json(tasks);
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    console.error('Detailed error:', error); // Debug log
    res.status(500).json({ 
      message: 'Error fetching tasks',
      error: error.message 
    });
  }
});

// Create task
router.post('/', upload.single('audioRecording'), async (req, res) => {
  try {
    // Parse the stringified task data
    const taskData = JSON.parse(req.body.taskData);
    console.log('Received task data:', taskData);

    const { 
      title, 
      description, 
      dueDate, 
      reminderTime,
      category = 'General', 
      priority = 'Medium' 
    } = taskData;
    
    // Create task with all fields
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        reminderTime: reminderTime ? new Date(reminderTime) : null,
        category,
        priority,
        userId: req.user.id,
        reminded: false
      }
    });

    // If there's an audio file, just log it and store it
    if (req.file) {
      console.log('Audio file saved:', {
        taskId: task.id,
        audioPath: req.file.path,
        filename: req.file.filename
      });
    }

    res.status(201).json(task);
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({ 
      message: 'Error creating task', 
      error: error.message 
    });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      completed, 
      dueDate, 
      reminderTime,
      category,
      reminded 
    } = req.body;

    // Validate required fields
    if (title && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    
    const task = await prisma.task.update({
      where: {
        id,
        userId: req.user.id
      },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(reminderTime !== undefined && { reminderTime: reminderTime ? new Date(reminderTime) : null }),
        ...(category !== undefined && { category: category?.trim() || null }),
        ...(reminded !== undefined && { reminded })
      }
    });
    res.json(task);
  } catch (error) {
    logger.error('Error updating task:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Task not found' });
    } else {
      res.status(500).json({ message: 'Error updating task' });
    }
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: {
        id,
        userId: req.user.id
      }
    });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Error deleting task:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Task not found' });
    } else {
      res.status(500).json({ message: 'Error deleting task' });
    }
  }
});

module.exports = router; 