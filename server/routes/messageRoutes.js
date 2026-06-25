import express from 'express';
import { getMessagesByDiscussion } from '../controllers/messageController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:discussionId', protect, getMessagesByDiscussion);

export default router;
