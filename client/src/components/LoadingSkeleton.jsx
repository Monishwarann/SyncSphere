import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((n) => (
        <div key={n} className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden skeleton-shimmer">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-3 flex-1">
              {/* Category tag */}
              <div className="w-16 h-5 bg-white/5 rounded-full"></div>
              {/* Title */}
              <div className="w-3/4 h-6 bg-white/5 rounded-lg"></div>
              {/* Description */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-4 bg-white/5 rounded"></div>
                <div className="w-5/6 h-4 bg-white/5 rounded"></div>
              </div>
            </div>
            {/* Meta statistics */}
            <div className="w-12 h-12 bg-white/5 rounded-xl"></div>
          </div>
          {/* Footer details */}
          <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
            <div className="w-24 h-4 bg-white/5 rounded"></div>
            <div className="w-32 h-4 bg-white/5 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DiscussionDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 skeleton-shimmer">
      {/* Details & Comments Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 relative overflow-hidden">
          <div className="w-20 h-6 bg-white/5 rounded-full"></div>
          <div className="w-5/6 h-8 bg-white/5 rounded-lg"></div>
          <div className="space-y-2 pt-2">
            <div className="w-full h-4 bg-white/5 rounded"></div>
            <div className="w-full h-4 bg-white/5 rounded"></div>
            <div className="w-4/5 h-4 bg-white/5 rounded"></div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 relative overflow-hidden">
          <div className="w-32 h-6 bg-white/5 rounded-lg"></div>
          <div className="space-y-4 pt-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 bg-white/5 rounded"></div>
                  <div className="w-full h-4 bg-white/5 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Room Section */}
      <div className="glass-card rounded-3xl border border-white/5 h-[600px] p-6 relative overflow-hidden flex flex-col justify-between">
        <div className="space-y-4">
          <div className="w-36 h-6 bg-white/5 rounded-lg"></div>
          <div className="w-full h-px bg-white/5"></div>
        </div>
        <div className="space-y-4 flex-1 py-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-2/3 h-10 bg-white/5 rounded-2xl"></div>
          ))}
        </div>
        <div className="w-full h-12 bg-white/5 rounded-xl"></div>
      </div>
    </div>
  );
};
