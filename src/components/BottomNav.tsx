'use client';

import React from 'react';
import { Home, Compass, MessageCircle } from 'lucide-react';

export type TabType = 'home' | 'discover' | 'matches';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
  matchesCount: number;
  feedCount: number;
}

export default function BottomNav({
  activeTab,
  setActiveTab,
  matchesCount,
  feedCount,
}: BottomNavProps) {
  return (
    <div className="w-full bg-[#0E1017] border-t border-white/5 py-2 px-6 flex items-center justify-around z-30 shrink-0">
      {/* Home Tab */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 transition-all py-1 px-4 rounded-xl ${
          activeTab === 'home' ? 'text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-coy-pink' : ''}`} />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      {/* Discover Tab (Hero) */}
      <button
        onClick={() => setActiveTab('discover')}
        className={`relative flex flex-col items-center gap-1 transition-all py-1 px-4 rounded-xl ${
          activeTab === 'discover' ? 'text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        <Compass
          className={`w-6 h-6 ${
            activeTab === 'discover' ? 'text-coy-pink animate-pulse-subtle' : ''
          }`}
        />
        <span className="text-[10px] font-bold tracking-tight">Discover</span>
        {feedCount > 0 && (
          <span className="absolute -top-0.5 right-2 w-4 h-4 rounded-full bg-coy-pink text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
            {feedCount > 9 ? '9+' : feedCount}
          </span>
        )}
      </button>

      {/* Matches Tab */}
      <button
        onClick={() => setActiveTab('matches')}
        className={`relative flex flex-col items-center gap-1 transition-all py-1 px-4 rounded-xl ${
          activeTab === 'matches' ? 'text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        <MessageCircle
          className={`w-5 h-5 ${activeTab === 'matches' ? 'text-coy-pink fill-coy-pink/20' : ''}`}
        />
        <span className="text-[10px] font-medium">Matches</span>
        {matchesCount > 0 && (
          <span className="absolute -top-0.5 right-2 w-4 h-4 rounded-full bg-gradient-to-r from-coy-pink to-coy-purple text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
            {matchesCount}
          </span>
        )}
      </button>
    </div>
  );
}
