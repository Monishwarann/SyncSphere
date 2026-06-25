import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, LogOut, Radio, Menu, X, Award } from 'lucide-react';
import { socket } from '../sockets/socket';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-obsidian-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-neon-indigo">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-obsidian-200 to-indigo-400 bg-clip-text text-transparent">
                SyncSphere
              </span>
            </Link>
          </div>

          {/* Right Area (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {/* Connection Status Indicator */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-sm ${
                  isConnected 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                }`}>
                  <Radio className={`w-3.5 h-3.5 ${isConnected ? 'animate-pulse' : ''}`} />
                  <span>{isConnected ? 'Real-Time Sync active' : 'REST Mode only'}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                </div>

                {/* Developer Course Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Project Portfolio</span>
                </div>

                {/* Profile Card */}
                <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-9 w-9 rounded-xl border border-white/10 bg-obsidian-900 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{user.username}</span>
                    <span className="text-[10px] text-obsidian-400 font-medium">Logged in</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogoutClick}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-obsidian-400 hover:text-white hover:bg-rose-600/10 hover:border-rose-500/20 transition-all duration-200"
                  title="Sign Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-obsidian-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-102"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-obsidian-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-obsidian-950 px-4 py-4 animate-fade-in-up">
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-10 w-10 rounded-xl border border-white/10"
                />
                <div>
                  <div className="text-sm font-semibold text-white">{user.username}</div>
                  <div className="text-xs text-obsidian-400">{user.email}</div>
                </div>
              </div>
              
              <div className="h-px bg-white/5 my-1"></div>

              <div className="flex flex-col gap-2.5">
                <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold ${
                  isConnected 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                }`}>
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    Real-time Sync
                  </span>
                  <span>{isConnected ? 'Connected' : 'REST Mode'}</span>
                </div>

                <button
                  onClick={handleLogoutClick}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-rose-600/10 border border-rose-500/25 px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center rounded-xl border border-white/5 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
