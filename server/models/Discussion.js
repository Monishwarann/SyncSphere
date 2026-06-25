import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a discussion title'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a discussion description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      default: 'General',
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching on title, tags, and category
discussionSchema.index({ title: 'text', description: 'text' });
discussionSchema.index({ category: 1 });
discussionSchema.index({ tags: 1 });

const Discussion = mongoose.model('Discussion', discussionSchema);
export default Discussion;
