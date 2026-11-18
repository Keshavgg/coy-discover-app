'use client';

import React from 'react';
import { Home, Compass, Sparkles } from 'lucide-react';

interface HomePlaceholderProps {
  onGoToDiscover: () => void;
}

export default function HomePlaceholder({ onGoToDiscover }: HomePlaceholderProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-coy-card">
      <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-4 shadow-inner">
        <Home className="w-8 h-8 text-white/30" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[11px] text-white/60 border border-white/10 font-medium mb-3">
        <Sparkles className="w-3.5 h-3.5 text-coy-pink" />
        <span>Assignment Requirement</span>
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Home Feed</h2>
      <p className="text-xs text-white/50 max-w-[260px] leading-relaxed mb-6">
        As specified in the assignment guidelines, the Home tab remains a blank placeholder. All swipe and matching features are built in the <strong className="text-white">Discover</strong> tab!
      </p>

      <button
        onClick={onGoToDiscover}
        className="px-5 py-3 rounded-2xl coy-button-gradient text-white text-xs font-semibold shadow-lg shadow-coy-pink/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
      >
        <Compass className="w-4 h-4" />
        <span>Go to Discover Tab</span>
      </button>
    </div>
  );
}
