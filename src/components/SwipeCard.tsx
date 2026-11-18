'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { PublicProfile } from '@/lib/db';

interface SwipeCardProps {
  profile: PublicProfile;
  isFront: boolean;
  onSwipe: (action: 'like' | 'pass') => void;
}

const MotionDiv = motion.div as any;

export default function SwipeCard({ profile, isFront, onSwipe }: SwipeCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const x = useMotionValue(0);

  // Smooth rotation as card is dragged left/right
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const cardOpacity = useTransform(x, [-250, -200, 0, 200, 250], [0.5, 1, 1, 1, 0.5]);

  // Dynamic stamp badges
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('pass');
    }
  };

  return (
    <MotionDiv
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? cardOpacity : 1,
        touchAction: 'none',
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={isFront ? { cursor: 'grabbing' } : {}}
      className={`absolute inset-0 w-full h-full rounded-3xl overflow-hidden select-none cursor-grab bg-coy-card shadow-xl border border-white/5 ${
        !isFront ? 'pointer-events-none' : ''
      }`}
    >
      {/* Background Image */}
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-full object-cover pointer-events-none transition-transform duration-700 hover:scale-105"
        />

        {/* Gradient Scrim for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none" />

        {/* Stamp Badges */}
        {isFront && (
          <>
            {/* LIKE BADGE */}
            <MotionDiv
              style={{ opacity: likeOpacity }}
              className="absolute top-6 left-6 border-4 border-emerald-400 text-emerald-400 font-extrabold text-2xl px-4 py-1 rounded-xl rotate-[-18deg] tracking-wider pointer-events-none uppercase bg-black/30 backdrop-blur-sm z-30 shadow-lg"
            >
              LIKE
            </MotionDiv>

            {/* NOPE BADGE */}
            <MotionDiv
              style={{ opacity: nopeOpacity }}
              className="absolute top-6 right-6 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl px-4 py-1 rounded-xl rotate-[18deg] tracking-wider pointer-events-none uppercase bg-black/30 backdrop-blur-sm z-30 shadow-lg"
            >
              PASS
            </MotionDiv>
          </>
        )}

        {/* Card Content Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                {profile.name}, <span className="font-normal opacity-90">{profile.age}</span>
              </h2>
              <CheckCircle2 className="w-5 h-5 text-coy-pink fill-coy-pink/20" />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-white/30 transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* College / Location */}
          <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium mb-3">
            <MapPin className="w-3.5 h-3.5 text-coy-pink" />
            <span>{profile.location}</span>
          </div>

          {/* Bio Preview */}
          <p className="text-sm text-white/90 line-clamp-2 leading-relaxed mb-3 drop-shadow">
            {profile.bio}
          </p>

          {/* Interests Pills */}
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/90 font-medium border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Expanded Drawer Modal */}
          {showDetails && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 text-xs space-y-2.5"
            >
              <div className="flex items-center gap-2 text-coy-pink font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>About {profile.name}</span>
              </div>
              <p className="text-white/80 leading-normal">{profile.bio}</p>
              <div className="pt-2 border-t border-white/10 flex justify-between text-white/50 text-[10px]">
                <span>Student at {profile.location}</span>
                <span>Verified Coy Member</span>
              </div>
            </MotionDiv>
          )}
        </div>
      </div>
    </MotionDiv>
  );
}
