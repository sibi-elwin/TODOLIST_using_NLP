const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { sendTaskReminder } = require('./emailService');
const { logger } = require('../utils/logger');

const prisma = new PrismaClient();

// Helper function to get tasks due in the next interval
const getUpcomingTasks = async () => {
  const now = new Date();
  const fiveMinutesAgo = new Date(now);
  fiveMinutesAgo.setMinutes(now.getMinutes() - 5);
  const fiveMinutesFromNow = new Date(now);
  fiveMinutesFromNow.setMinutes(now.getMinutes() + 5);

  logger.info('Checking for tasks with reminders between:', {
    from: fiveMinutesAgo.toISOString(),
    to: fiveMinutesFromNow.toISOString(),
    currentTime: now.toISOString()
  });

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        // Check for tasks with specific reminder time
        {
          reminderTime: {
            gte: fiveMinutesAgo,
            lte: fiveMinutesFromNow
          },
          reminded: false,
          completed: false
        },
        // Check for tasks due soon
        {
          dueDate: {
            gte: fiveMinutesAgo,
            lte: fiveMinutesFromNow
          },
          reminded: false,
          completed: false
        }
      ],
      user: {
        emailNotifications: true
      }
    },
    include: {
      user: true
    }
  });

  if (tasks.length > 0) {
    logger.info(`Found ${tasks.length} tasks needing reminders:`, {
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        reminderTime: t.reminderTime ? new Date(t.reminderTime).toISOString() : null,
        dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : null,
        currentTime: now.toISOString()
      }))
    });
  }

  return tasks;
};

// Helper function to get tasks due today
const getTodayTasks = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  logger.info('Checking for today\'s tasks between:', {
    from: today.toISOString(),
    to: tomorrow.toISOString()
  });

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        {
          dueDate: {
            gte: today,
            lt: tomorrow
          }
        },
        {
          reminderTime: {
            gte: today,
            lt: tomorrow
          }
        }
      ],
      completed: false,
      reminded: false,
      user: {
        emailNotifications: true
      }
    },
    include: {
      user: true
    }
  });

  logger.info(`Found ${tasks.length} tasks due today:`, {
    tasks: tasks.map(t => ({
      id: t.id,
      title: t.title,
      reminderTime: t.reminderTime,
      dueDate: t.dueDate
    }))
  });

  return tasks;
};

const scheduleReminders = () => {
  // Check every minute for upcoming tasks
  cron.schedule('* * * * *', async () => {
    try {
      logger.info('Running reminder check...');
      const upcomingTasks = await getUpcomingTasks();
      
      for (const task of upcomingTasks) {
        try {
          const now = new Date();
          const reminderTime = task.reminderTime ? new Date(task.reminderTime) : null;
          
          // Only send reminder if we're within 5 minutes of the reminder time
          if (reminderTime) {
            const timeDiff = Math.abs(now - reminderTime) / 1000 / 60; // difference in minutes
            
            logger.info(`Checking reminder timing for task: ${task.id}`, {
              taskTitle: task.title,
              reminderTime: reminderTime.toISOString(),
              currentTime: now.toISOString(),
              timeDifferenceMinutes: timeDiff
            });

            if (timeDiff <= 5) {
              await sendTaskReminder(task.user.email, task);
              
              // Mark task as reminded
              await prisma.task.update({
                where: { id: task.id },
                data: { reminded: true }
              });
              
              logger.info(`Successfully sent reminder for task ${task.id} to ${task.user.email}`, {
                taskTitle: task.title,
                reminderTime: reminderTime.toISOString(),
                sentAt: new Date().toISOString()
              });
            }
          }
        } catch (error) {
          logger.error(`Failed to send reminder for task ${task.id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Error in reminder scheduler:', error);
    }
  });

  // Daily morning reminder at 9:00 AM for all tasks due today
  cron.schedule('0 9 * * *', async () => {
    try {
      const todayTasks = await getTodayTasks();
      
      for (const task of todayTasks) {
        try {
          await sendTaskReminder(task.user.email, task);
          await prisma.task.update({
            where: { id: task.id },
            data: { reminded: true }
          });
          logger.info(`Sent daily reminder for task ${task.id} to ${task.user.email}`);
        } catch (error) {
          logger.error(`Failed to send daily reminder for task ${task.id}:`, error);
        }
      }

      if (todayTasks.length > 0) {
        logger.info(`Sent ${todayTasks.length} daily task reminders`);
      }
    } catch (error) {
      logger.error('Error in daily reminder scheduler:', error);
    }
  });

  // Reset reminded flag at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      await prisma.task.updateMany({
        where: {
          completed: false,
          reminded: true
        },
        data: {
          reminded: false
        }
      });
      logger.info('Reset reminded flags for uncompleted tasks');
    } catch (error) {
      logger.error('Error resetting reminded flags:', error);
    }
  });
};

module.exports = {
  scheduleReminders
}; 