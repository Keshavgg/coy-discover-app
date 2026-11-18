'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X, Heart, Star, Sparkles, RefreshCw, Flame } from 'lucide-react';
import SwipeCard from './SwipeCard';
import { PublicProfile } from '@/lib/db';

interface DiscoverFeedProps {
  profiles: PublicProfile[];
  onSwipe: (profileId: string, action: 'like' | 'pass') => Promise<void>;
  onUndo: () => Promise<void>;
  onReset: () => Promise<void>;
  canUndo: boolean;
  isLoading: boolean;
}

const MotionDiv = motion.div as any;

export default function DiscoverFeed({
  profiles,
  onSwipe,
  onUndo,
  onReset,
  canUndo,
  isLoading,
}: DiscoverFeedProps) {
  const [swipingCardId, setSwipingCardId] = useState<string | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const activeProfile = profiles[0];
  const nextProfile = profiles[1];

  const handleCardSwipe = async (action: 'like' | 'pass') => {
    if (!activeProfile || swipingCardId) return;

    setSwipingCardId(activeProfile.id);
    setSwipeDirection(action === 'like' ? 'right' : 'left');

    await onSwipe(activeProfile.id, action);

    setSwipingCardId(null);
    setSwipeDirection(null);
  };

  const handleButtonAction = (action: 'like' | 'pass') => {
    handleCardSwipe(action);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-coy-card">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coy-pink to-coy-purple flex items-center justify-center shadow-lg shadow-coy-pink/20">
            <Flame className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight coy-gradient-text">
              coy discover
            </h1>
            <p className="text-[10px] text-white/50">Double-blind crush matching</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 font-medium">
            {profiles.length} left
          </div>

          <button
            onClick={onReset}
            title="Reset demo data"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Deck Viewport */}
      <div className="flex-1 relative p-3.5 overflow-hidden flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-coy-pink/30 border-t-coy-pink rounded-full animate-spin" />
            <p className="text-xs text-white/50">Curating fresh profiles...</p>
          </div>
        ) : profiles.length === 0 ? (
          /* Empty State */
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full max-h-[500px] rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center text-center p-6 space-y-5"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-coy-pink/20 to-coy-purple/20 flex items-center justify-center border border-white/10">
                <Sparkles className="w-10 h-10 text-coy-pink" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                <span className="text-emerald-400 text-xs font-bold">✓</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1.5">You&apos;re All Caught Up!</h3>
              <p className="text-xs text-white/50 max-w-[260px] mx-auto leading-relaxed">
                You&apos;ve reviewed all 35 campus profiles. Check your Matches tab to see your mutual crushes!
              </p>
            </div>

            <button
              onClick={onReset}
              className="px-5 py-2.5 rounded-full coy-button-gradient text-white text-xs font-semibold shadow-lg shadow-coy-pink/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset & Test Again</span>
            </button>
          </MotionDiv>
        ) : (
          /* Active Card Stack */
          <div className="relative w-full h-full max-h-[560px]">
            {/* Background Card Preview (for depth) */}
            {nextProfile && (
              <div className="absolute inset-0 scale-[0.94] translate-y-3 opacity-60 pointer-events-none transition-all duration-300">
                <SwipeCard
                  profile={nextProfile}
                  isFront={false}
                  onSwipe={() => {}}
                />
              </div>
            )}

            {/* Front Interactive Card */}
            <AnimatePresence>
              {activeProfile && (
                <SwipeCard
                  key={activeProfile.id}
                  profile={activeProfile}
                  isFront={true}
                  onSwipe={handleCardSwipe}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom Floating Action Bar */}
      {profiles.length > 0 && (
        <div className="p-4 pt-1 flex items-center justify-center gap-4 z-20">
          {/* Undo / Rewind */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Rewind previous swipe"
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 border border-white/10 text-amber-400 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Pass (Left) */}
          <button
            onClick={() => handleButtonAction('pass')}
            title="Pass (Swipe Left)"
            className="w-14 h-14 rounded-full bg-white/5 hover:bg-rose-500/20 active:scale-90 border border-white/10 hover:border-rose-500/50 text-rose-500 flex items-center justify-center transition-all shadow-lg hover:shadow-rose-500/20"
          >
            <X className="w-7 h-7 stroke-[2.5]" />
          </button>

          {/* Superlike */}
          <button
            onClick={() => handleButtonAction('like')}
            title="Super Crush"
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-cyan-500/20 active:scale-90 border border-white/10 hover:border-cyan-400/50 text-cyan-400 flex items-center justify-center transition-all shadow-md"
          >
            <Star className="w-5 h-5 fill-cyan-400/20" />
          </button>

          {/* Like (Right) */}
          <button
            onClick={() => handleButtonAction('like')}
            title="Like (Swipe Right)"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-coy-pink to-coy-purple hover:brightness-110 active:scale-90 text-white flex items-center justify-center transition-all shadow-xl shadow-coy-pink/30"
          >
            <Heart className="w-7 h-7 fill-white stroke-[2]" />
          </button>
        </div>
      )}
    </div>
  );
}
