'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { PublicProfile } from '@/lib/db';

interface MatchModalProps {
  matchedProfile: PublicProfile | null;
  onClose: () => void;
  onOpenChat: (profile: PublicProfile) => void;
}

const MotionDiv = motion.div as any;

export default function MatchModal({
  matchedProfile,
  onClose,
  onOpenChat,
}: MatchModalProps) {
  useEffect(() => {
    if (matchedProfile) {
      // Fire vibrant celebration confetti
      const end = Date.now() + 1.2 * 1000;
      const colors = ['#FF2E93', '#7928CA', '#00F2FE', '#FF8E53'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [matchedProfile]);

  if (!matchedProfile) return null;

  return (
    <AnimatePresence>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      >
        <MotionDiv
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="relative w-full max-w-sm p-6 text-center rounded-[32px] bg-gradient-to-b from-[#1C1A29] to-[#12111A] border border-coy-pink/30 shadow-2xl overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-coy-pink/25 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coy-pink/15 border border-coy-pink/30 text-coy-pink text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Mutual Crush Unlocked</span>
          </div>

          <h2 className="text-3xl font-extrabold coy-gradient-text tracking-tight mb-2">
            It&apos;s a Match!
          </h2>

          <p className="text-xs text-white/70 max-w-[260px] mx-auto mb-6 leading-relaxed">
            You and <span className="text-white font-semibold">{matchedProfile.name}</span> secretly liked each other. The feeling is completely mutual!
          </p>

          {/* Avatar Circles Animation */}
          <div className="flex items-center justify-center -space-x-4 mb-8">
            {/* User Avatar */}
            <MotionDiv
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-coy-pink to-coy-purple shadow-xl z-10"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-coy-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
            </MotionDiv>

            {/* Heart Badge */}
            <MotionDiv
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3 }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-coy-pink to-rose-500 flex items-center justify-center text-white shadow-lg z-30 border-2 border-[#1C1A29]"
            >
              <Heart className="w-5 h-5 fill-white" />
            </MotionDiv>

            {/* Matched Avatar */}
            <MotionDiv
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-coy-purple to-coy-cyan shadow-xl z-20"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-coy-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={matchedProfile.photo}
                  alt={matchedProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </MotionDiv>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onOpenChat(matchedProfile);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-2xl coy-button-gradient text-white font-semibold text-sm shadow-lg shadow-coy-pink/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Say Hello to {matchedProfile.name}</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 font-medium text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Keep Swiping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
}
