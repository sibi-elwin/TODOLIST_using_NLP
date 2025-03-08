const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');
const { authMiddleware } = require('../middlewares/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

router.patch('/notifications', authMiddleware, async (req, res) => {
  try {
    const { emailNotifications } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { emailNotifications }
    });

    res.json({ emailNotifications: user.emailNotifications });
  } catch (error) {
    logger.error('Error updating notification preferences:', error);
    res.status(500).json({ message: 'Error updating notification preferences' });
  }
});

module.exports = router; 