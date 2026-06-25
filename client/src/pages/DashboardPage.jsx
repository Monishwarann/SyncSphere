import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MessageSquare, Trash2, ArrowUpRight, Tag, BookOpen } from 'lucide-react';
import API from '../services/api';
import StatsSection from '../components/StatsSection';
import { DashboardSkeleton } from '../components/LoadingSkeleton';

const DashboardPage = ({ user, showToast }) => {
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'WebDev', 'Tech', 'Career', 'Database'];

  const fetchDiscussions = async () => {
    setIsLoading(true);
    try {
      let url = '/discussions';
      const params = {};
      if (activeCategory !== 'All') {
        params.category = activeCategory;
      }
      if (search.trim() !== '') {
        params.search = search;
      }
      
      const response = await API.get(url, { params });
      setDiscussions(response.data);
    } catch (error) {
      console.error('Fetch discussions error:', error);
      showToast('Could not load discussion feed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly or pull on category/search modifications
    fetchDiscussions();
  }, [activeCategory, search]);

  const handleDelete = async (id, e) => {
    e.preventDefault(); // Prevent navigating
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to permanently delete this discussion thread and all its comments?')) return;

    try {
      await API.delete(`/discussions/${id}`);
      showToast('Discussion thread successfully removed', 'success');
      setDiscussions(discussions.filter((d) => d._id !== id));
    } catch (error) {
      const msg = error.response?.data?.message || 'Unauthorized to delete this thread';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8 relative">
      {/* Glow effect */}
      <div className="bg-glow-blob bg-indigo-500/10 w-[400px] h-[400px] top-10 left-10"></div>

      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Community Collaboration Hub
          </h1>
          <p className="mt-2 text-sm text-obsidian-400 font-medium">
            Join hot developer rooms, post persistent comments, and converse with engineers in real time.
          </p>
        </div>
        <Link
          to="/create-discussion"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-102 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>New Discussion</span>
        </Link>
      </div>

      {/* Stats Widgets */}
      <StatsSection discussionsCount={discussions.length} />

      {/* Search & Filter section */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between bg-obsidian-900/50 p-4 rounded-2xl border border-white/5">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 order-2 lg:order-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white/5 border border-white/5 text-obsidian-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative rounded-xl max-w-sm w-full order-1 lg:order-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-obsidian-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-4 py-2 rounded-xl border glass-input text-white text-xs"
            placeholder="Search discussion title or tags..."
          />
        </div>
      </div>

      {/* Discussions Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <DashboardSkeleton />
        ) : discussions.length > 0 ? (
          discussions.map((disc) => (
            <Link
              key={disc._id}
              to={`/discussion/${disc._id}`}
              className="block glass-card glass-card-hover rounded-2xl p-6 border border-white/5 relative overflow-hidden"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  {/* Category & Tags Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-2xs font-extrabold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      {disc.category}
                    </span>
                    {disc.tags && disc.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-white/5 text-3xs font-medium text-obsidian-300">
                        <Tag className="w-2.5 h-2.5 opacity-60" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                    <span>{disc.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                  </h3>

                  {/* Truncated Description */}
                  <p className="text-sm text-obsidian-400 leading-relaxed max-w-4xl line-clamp-2">
                    {disc.description}
                  </p>
                </div>

                {/* Live Room Indicator Card */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-obsidian-950 border border-white/5 text-obsidian-400 shadow-inner group-hover:border-indigo-500/35 transition-colors">
                  <MessageSquare className="h-5 w-5 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>

              {/* Feed Card Footer details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5 text-2xs text-obsidian-400 font-semibold">
                <div className="flex items-center gap-2">
                  <img
                    src={disc.creator?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=creator'}
                    alt="creator avatar"
                    className="w-5 h-5 rounded-md border border-white/10 bg-obsidian-900 object-cover"
                  />
                  <span>Created by <span className="text-obsidian-200">{disc.creator?.username}</span></span>
                  <span className="w-1 h-1 rounded-full bg-obsidian-500"></span>
                  <span>{new Date(disc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Delete trigger */}
                  {user && disc.creator?._id === user._id && (
                    <button
                      onClick={(e) => handleDelete(disc._id, e)}
                      className="flex items-center gap-1 text-rose-500 hover:text-rose-400 py-1 px-2 rounded hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all cursor-pointer"
                      title="Delete Thread"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="glass-card rounded-2xl p-12 border border-white/5 text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-6">
            <BookOpen className="w-12 h-12 text-obsidian-500 mb-4" />
            <h3 className="text-lg font-bold text-white">No discussions found</h3>
            <p className="text-sm text-obsidian-400 mt-1 max-w-sm">
              We could not find any active threads. Be the first to start a conversation in our community forum!
            </p>
            <Link
              to="/create-discussion"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Thread</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
