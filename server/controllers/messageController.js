import Message from '../models/Message.js';

// @desc    Get live chat history for a discussion room
// @route   GET /api/messages/:discussionId
// @access  Private
export const getMessagesByDiscussion = async (req, res, next) => {
  const { discussionId } = req.params;

  try {
    const messages = await Message.find({ discussion: discussionId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 }) // Get recent first
      .limit(50); // Keep performance optimal

    // Return in chronological order
    res.json(messages.reverse());
  } catch (error) {
    next(error);
  }
};
