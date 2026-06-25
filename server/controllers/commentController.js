import Comment from '../models/Comment.js';
import Discussion from '../models/Discussion.js';

// @desc    Add a comment to a discussion thread
// @route   POST /api/comments/:discussionId
// @access  Private
export const createComment = async (req, res, next) => {
  const { text } = req.body;
  const { discussionId } = req.params;

  try {
    if (!text || text.trim() === '') {
      res.status(400);
      throw new Error('Comment text cannot be empty');
    }

    const discussionExists = await Discussion.findById(discussionId);
    if (!discussionExists) {
      res.status(404);
      throw new Error('Discussion thread not found');
    }

    const comment = await Comment.create({
      discussion: discussionId,
      user: req.user._id,
      text: text.trim(),
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a specific discussion thread
// @route   GET /api/comments/:discussionId
// @access  Public
export const getCommentsByDiscussion = async (req, res, next) => {
  const { discussionId } = req.params;

  try {
    const comments = await Comment.find({ discussion: discussionId })
      .populate('user', 'username avatar')
      .sort({ createdAt: 1 }); // Chronological order

    res.json(comments);
  } catch (error) {
    next(error);
  }
};
