import React from 'react';
import { MessageCircle, Users, Activity, Layers } from 'lucide-react';

const StatsSection = ({ discussionsCount = 0 }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Discussions */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32 border border-white/5 shadow-lg group hover:border-indigo-500/20 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider">Total Threads</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 select-none">{discussionsCount}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-300 mt-2 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span>Indexed collections</span>
        </div>
      </div>

      {/* Online Users Indicator */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32 border border-white/5 shadow-lg group hover:border-emerald-500/20 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider">Active Rooms</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 select-none">4 Channels</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Real-time listeners live</span>
        </div>
      </div>

      {/* Message Activity Gauge */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32 border border-white/5 shadow-lg group hover:border-cyan-500/20 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider">Sync Latency</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 select-none">~12 ms</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-cyan-300 mt-2 font-medium">
          <svg className="w-16 h-2 text-cyan-500" viewBox="0 0 100 10" fill="none">
            <path d="M0,5 Q15,0 30,5 T60,5 T90,5" stroke="currentColor" strokeWidth="2" fill="none" className="stroke-cyan-400" />
          </svg>
          <span>Ultra low-ping WebSockets</span>
        </div>
      </div>

      {/* Course Sandbox Info */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32 border border-white/5 shadow-lg group hover:border-violet-500/20 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider">Architecture</p>
            <h3 className="text-3xl font-extrabold text-violet-400 mt-1 select-none">MERN</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-violet-300 mt-2 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
          <span>Verified Full-Stack Portfolio</span>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
