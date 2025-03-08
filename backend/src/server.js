const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { logger } = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize reminder service
const { scheduleReminders } = require('./services/reminderService');
const { sendTaskReminder } = require('./services/emailService');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

logger.info('Task reminder service initialized');

// Test route for email reminders
app.post('/api/test-reminder/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    
    // Find the task with user information
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { user: true }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Send test reminder
    await sendTaskReminder(task.user.email, task);
    res.json({ message: 'Test reminder sent successfully' });
  } catch (error) {
    logger.error('Error sending test reminder:', error);
    res.status(500).json({ message: 'Failed to send test reminder', error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Use centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
