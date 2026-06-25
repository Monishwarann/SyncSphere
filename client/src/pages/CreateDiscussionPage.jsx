import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import API from '../services/api';

const CreateDiscussionPage = ({ showToast }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('WebDev');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['WebDev', 'Tech', 'Career', 'Database', 'General'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      showToast('Title and Description are required fields', 'error');
      return;
    }
    if (title.length < 5) {
      showToast('Title must be at least 5 characters', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await API.post('/discussions', {
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tags,
      });

      showToast('New discussion thread created successfully!', 'success');
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error creating discussion thread';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6 relative">
      {/* Visual background blob */}
      <div className="bg-glow-blob bg-violet-600/10 w-[300px] h-[300px] top-1/4 right-1/4"></div>

      {/* Breadcrumbs */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-obsidian-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discussion Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Create New Discussion
        </h1>
        <p className="mt-1.5 text-xs text-obsidian-400 font-medium">
          Kickstart an asynchronous discussion thread and provision a synchronized real-time chatroom space.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card rounded-2xl border border-white/5 p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-obsidian-300 uppercase tracking-wider">
              Discussion Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-2 block w-full px-4 py-3 rounded-xl border glass-input text-white text-sm"
              placeholder="e.g. Building highly scalable WebSockets rooms with Redis adapters"
            />
          </div>

          {/* Grid for Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category selection */}
            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-obsidian-300 uppercase tracking-wider">
                Category Group
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 block w-full px-4 py-3 rounded-xl border glass-input text-white text-sm bg-obsidian-900 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-obsidian-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags (comma separated) */}
            <div>
              <label htmlFor="tags" className="block text-xs font-semibold text-obsidian-300 uppercase tracking-wider">
                Metadata Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-2 block w-full px-4 py-3 rounded-xl border glass-input text-white text-sm"
                placeholder="e.g. react, node, chat, sockets"
              />
            </div>
          </div>

          {/* Description / Content Body */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-obsidian-300 uppercase tracking-wider">
              Topic Description & Details
            </label>
            <textarea
              id="description"
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-2 block w-full px-4 py-3 rounded-xl border glass-input text-white text-sm resize-y"
              placeholder="Provide a comprehensive introduction to this topic. Describe the problems, share code blocks, or list structural proposals."
            ></textarea>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-sm font-semibold text-obsidian-300 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-102 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Launch Topic</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscussionPage;
