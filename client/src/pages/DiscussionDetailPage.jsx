import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, Radio, User, SendHorizonal, Calendar, Users2, ChevronRight, MessageSquareText } from 'lucide-react';
import API from '../services/api';
import { socket } from '../sockets/socket';
import { DiscussionDetailSkeleton } from '../components/LoadingSkeleton';

const DiscussionDetailPage = ({ user, showToast }) => {
  const { id: discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [activeTab, setActiveTab] = useState('forum'); // 'forum' or 'chat' (for mobile responsive tabs)

  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll chat feed locked to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Load discussion, persistent comments and chat history
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Thread Core Details
        const discRes = await API.get(`/discussions/${discussionId}`);
        setDiscussion(discRes.data);

        // Fetch Forum Comments
        const commentRes = await API.get(`/comments/${discussionId}`);
        setComments(commentRes.data);

        // Fetch Live Chat logs
        const msgRes = await API.get(`/messages/${discussionId}`);
        setChatMessages(msgRes.data);
      } catch (error) {
        console.error('Fetch detail error:', error);
        showToast('Could not load discussion details', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [discussionId]);

  // Manage Socket.IO Event Handlers
  useEffect(() => {
    if (!discussionId || !user) return;

    // Connect to Socket server if disconnected
    if (!socket.connected) {
      socket.connect();
    }

    // Join discussion room
    socket.emit('join-room', { discussionId, user });

    // Handle Active Users inside room
    socket.on('room-users', (users) => {
      setActiveUsers(users);
    });

    // Handle Incoming Real-Time Chat messages
    socket.on('receive-message', (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    // Handle typing actions
    socket.on('user-typing', ({ username }) => {
      setTypingUser(username);
      setIsTyping(true);
    });

    socket.on('user-stop-typing', () => {
      setIsTyping(false);
      setTypingUser('');
    });

    // Cleanups on unmount
    return () => {
      socket.emit('leave-room', { discussionId });
      socket.off('room-users');
      socket.off('receive-message');
      socket.off('user-typing');
      socket.off('user-stop-typing');
    };
  }, [discussionId, user]);

  // Submit Persistent Forum Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await API.post(`/comments/${discussionId}`, {
        text: newComment.trim(),
      });
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
      showToast('Comment published to thread', 'success');
    } catch (error) {
      showToast('Failed to post comment', 'error');
    }
  };

  // Submit Real-time Chat message
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    // Emit live message event
    socket.emit('send-message', {
      discussionId,
      userId: user._id,
      text: newChatMessage.trim(),
    });

    // Send stop typing trigger
    socket.emit('stop-typing', { discussionId });
    setNewChatMessage('');
  };

  // Typing event trigger
  const handleChatInputChange = (e) => {
    setNewChatMessage(e.target.value);

    // Emit user typing event
    socket.emit('typing', { discussionId, username: user.username });

    // Clear existing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set stop typing debouncer
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { discussionId });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <DiscussionDetailSkeleton />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">Discussion thread not found</h2>
        <Link to="/" className="text-indigo-400 mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col space-y-6 relative h-[calc(100vh-64px)] min-h-[500px]">
      {/* Glow */}
      <div className="bg-glow-blob bg-indigo-500/5 w-[350px] h-[350px] top-10 right-10"></div>

      {/* Header breadcrumb & info */}
      <div className="flex flex-col gap-3 shrink-0">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-obsidian-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wider">
                {discussion.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-obsidian-500"></span>
              <span className="flex items-center gap-1 text-3xs text-obsidian-400 font-bold uppercase tracking-wider">
                <Calendar className="w-3 h-3" />
                {new Date(discussion.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {discussion.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Responsive Page layout switcher (Tabs on Mobile) */}
      <div className="flex md:hidden bg-obsidian-900 border border-white/5 p-1 rounded-xl shrink-0">
        <button
          onClick={() => setActiveTab('forum')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold ${
            activeTab === 'forum' ? 'bg-indigo-600 text-white shadow-sm' : 'text-obsidian-300'
          }`}
        >
          <MessageSquareText className="w-4 h-4" />
          <span>Forum ({comments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold ${
            activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-sm' : 'text-obsidian-300'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Live Chat ({activeUsers.length})</span>
        </button>
      </div>

      {/* Split grid layout (Forum on left, Real-time room chat on right) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden pb-4">
        
        {/* Left Column (Forum comments - visible on desktop, or if activeTab === 'forum' on mobile) */}
        <div className={`md:col-span-2 flex flex-col min-h-0 space-y-6 ${activeTab === 'forum' ? 'flex' : 'hidden md:flex'}`}>
          {/* Discussion Description Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 shrink-0 shadow-lg">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5">
              <img
                src={discussion.creator?.avatar}
                alt={discussion.creator?.username}
                className="w-8 h-8 rounded-lg border border-white/10 bg-obsidian-900 object-cover"
              />
              <div>
                <p className="text-xs font-bold text-white">{discussion.creator?.username}</p>
                <p className="text-3xs text-obsidian-400 font-semibold uppercase tracking-wider">Creator</p>
              </div>
            </div>
            <p className="text-sm text-obsidian-300 leading-relaxed whitespace-pre-line select-text">
              {discussion.description}
            </p>
          </div>

          {/* Comments Feed list */}
          <div className="flex-1 min-h-0 flex flex-col space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide shrink-0">
              Forum Discussion Board ({comments.length})
            </h3>

            {/* Comment Scroll viewport */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-0">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="glass-card rounded-2xl p-4 border border-white/5 space-y-2 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                          alt={comment.user?.username}
                          className="w-6 h-6 rounded-md border border-white/10 bg-obsidian-900 object-cover"
                        />
                        <span className="text-xs font-bold text-white">{comment.user?.username}</span>
                      </div>
                      <span className="text-3xs text-obsidian-400 font-semibold">
                        {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-obsidian-300 leading-relaxed whitespace-pre-line select-text pl-8">
                      {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white/2 rounded-2xl border border-dashed border-white/5">
                  <p className="text-xs text-obsidian-400 font-semibold">No persistent comments yet.</p>
                  <p className="text-3xs text-obsidian-500 mt-0.5">Post a message below to seed the discussion board.</p>
                </div>
              )}
            </div>

            {/* Post comment block */}
            <form onSubmit={handleCommentSubmit} className="shrink-0 flex gap-2 pt-2 border-t border-white/5 bg-obsidian-950">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post an answer or permanent solution to this board..."
                className="flex-1 px-4 py-2.5 rounded-xl border glass-input text-white text-xs"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
              >
                <span>Comment</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (Live Socket.IO chat - visible on desktop, or if activeTab === 'chat' on mobile) */}
        <div className={`md:col-span-1 flex flex-col min-h-0 glass-card rounded-2xl border border-white/5 shadow-2xl relative ${activeTab === 'chat' ? 'flex' : 'hidden md:flex'}`}>
          {/* Sockets header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-obsidian-900/50 rounded-t-2xl shrink-0">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider leading-none">Live Room Chat</h3>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {activeUsers.length} online
                </span>
              </div>
            </div>

            {/* Online members preview trigger */}
            <div className="flex items-center gap-1 text-2xs text-obsidian-400 font-semibold bg-white/5 px-2 py-1 rounded-md">
              <Users2 className="w-3.5 h-3.5" />
              <span>Rooms Active</span>
            </div>
          </div>

          {/* Active members ribbon */}
          <div className="px-4 py-2 bg-obsidian-950 border-b border-white/5 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {activeUsers.map((u) => (
              <div 
                key={u.socketId} 
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-300 shrink-0 select-none cursor-help"
                title={`${u.username} is connected via WebSocket`}
              >
                <img src={u.avatar} alt={u.username} className="w-3.5 h-3.5 rounded bg-obsidian-900" />
                <span>{u.username}</span>
              </div>
            ))}
          </div>

          {/* Live Chat scroll-feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-obsidian-950/40">
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => {
                const isSelf = msg.user?._id === user._id || msg.user === user._id;
                return (
                  <div 
                    key={msg._id || index} 
                    className={`flex items-start gap-2.5 max-w-[85%] animate-fade-in-up ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {!isSelf && (
                      <img
                        src={msg.user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                        alt="sender avatar"
                        className="w-7 h-7 rounded-lg border border-white/10 bg-obsidian-900 object-cover mt-0.5"
                      />
                    )}
                    <div className="space-y-0.5">
                      {!isSelf && (
                        <p className="text-[10px] font-bold text-obsidian-400 pl-1">{msg.user?.username || 'user'}</p>
                      )}
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed border select-text ${
                        isSelf 
                          ? 'bg-gradient-to-br from-indigo-600 to-violet-700 border-indigo-500/20 text-white rounded-tr-none' 
                          : 'bg-white/5 border-white/5 text-obsidian-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                <MessageSquare className="w-8 h-8 text-obsidian-400 mb-2" />
                <p className="text-2xs text-obsidian-400 font-semibold">Live chat log empty.</p>
                <p className="text-[10px] text-obsidian-500 mt-0.5">Send a message to sync in real time.</p>
              </div>
            )}

            {/* Typing status alert */}
            {isTyping && typingUser !== user.username && (
              <div className="flex items-center gap-1.5 pl-2 text-[10px] font-bold text-indigo-400 select-none animate-pulse">
                <div className="flex gap-0.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span>{typingUser} is typing...</span>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Sockets input panel */}
          <form onSubmit={handleChatSubmit} className="p-3 border-t border-white/5 bg-obsidian-900/50 rounded-b-2xl shrink-0 flex gap-2">
            <input
              type="text"
              value={newChatMessage}
              onChange={handleChatInputChange}
              placeholder="Send instant message..."
              className="flex-1 px-4 py-2 rounded-xl border glass-input text-white text-xs focus:ring-0"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-neon-indigo hover:scale-105 transition-transform cursor-pointer shrink-0"
              aria-label="Send real time message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetailPage;
