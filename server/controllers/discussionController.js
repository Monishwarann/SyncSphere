import Discussion from '../models/Discussion.js';
import Comment from '../models/Comment.js';

// @desc    Create a new discussion
// @route   POST /api/discussions
// @access  Private
export const createDiscussion = async (req, res, next) => {
  const { title, description, category, tags } = req.body;

  try {
    if (!title || !description) {
      res.status(400);
      throw new Error('Please fill in title and description');
    }

    // Process tags into array of strings if sent as comma-separated text
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags)
        ? tags.map(tag => tag.trim())
        : tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    const discussion = await Discussion.create({
      title,
      description,
      category: category || 'General',
      tags: parsedTags,
      creator: req.user._id,
    });

    const populatedDiscussion = await Discussion.findById(discussion._id)
      .populate('creator', 'username email avatar');

    res.status(201).json(populatedDiscussion);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all discussions with searching, category, and tag filtering
// @route   GET /api/discussions
// @access  Public
export const getDiscussions = async (req, res, next) => {
  const { search, category, tag } = req.query;

  try {
    const query = {};

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by Tag
    if (tag) {
      query.tags = tag;
    }

    // Filter by Text Search matching title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const discussions = await Discussion.find(query)
      .populate('creator', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(discussions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get discussion by ID
// @route   GET /api/discussions/:id
// @access  Public
export const getDiscussionById = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('creator', 'username email avatar');

    if (!discussion) {
      res.status(404);
      throw new Error('Discussion thread not found');
    }

    res.json(discussion);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a discussion
// @route   DELETE /api/discussions/:id
// @access  Private
export const deleteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      res.status(404);
      throw new Error('Discussion not found');
    }

    // Check if user is the creator
    if (discussion.creator.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Unauthorized to delete this discussion');
    }

    // Cascade delete comments
    await Comment.deleteMany({ discussion: discussion._id });
    await discussion.deleteOne();

    res.json({ message: 'Discussion thread and comments removed successfully' });
  } catch (error) {
    next(error);
  }
};
