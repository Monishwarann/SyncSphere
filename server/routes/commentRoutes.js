import express from 'express';
import { createComment, getCommentsByDiscussion } from '../controllers/commentController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:discussionId')
  .post(protect, createComment)
  .get(getCommentsByDiscussion);

export default router;
