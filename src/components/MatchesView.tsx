'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Heart, MapPin, Sparkles, Send, X, ShieldCheck } from 'lucide-react';
import { MatchRecord } from '@/lib/db';

interface MatchesViewProps {
  matches: MatchRecord[];
  activeChatProfile: MatchRecord | null;
  setActiveChatProfile: (p: MatchRecord | null) => void;
  onRefresh: () => void;
}

const MotionDiv = motion.div as any;

export default function MatchesView({
  matches,
  activeChatProfile,
  setActiveChatProfile,
}: MatchesViewProps) {
  const [messages, setMessages] = useState<Record<string, { sender: 'me' | 'them'; text: string; time: string }[]>>({
    coy_01: [
      { sender: 'them', text: "Hey! Didn't expect to see you here ✨", time: "Just now" },
      { sender: 'them', text: "Are you free for coffee near campus sometime?", time: "Just now" },
    ],
  });
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChatProfile) return;
    const profileId = activeChatProfile.id;
    const newMsg = { sender: 'me' as const, text: inputText.trim(), time: 'Just now' };

    setMessages((prev) => ({
      ...prev,
      [profileId]: [...(prev[profileId] || []), newMsg],
    }));
    setInputText('');

    // Mock friendly automated reply after 1.5s
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [profileId]: [
          ...(prev[profileId] || []),
          { sender: 'them', text: "Haha absolutely! Let's do it ☕", time: 'Just now' },
        ],
      }));
    }, 1500);
  };

  const currentChat = activeChatProfile ? messages[activeChatProfile.id] || [] : [];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-coy-card">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Matches</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-coy-pink/20 text-coy-pink font-semibold">
              {matches.length}
            </span>
          </h1>
          <p className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Only mutual crushes appear here. 100% private.</span>
          </p>
        </div>
      </div>

      {/* Matches List or Empty State */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {matches.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40 border border-white/10">
              <Heart className="w-8 h-8 text-white/30" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white/90">No mutual matches yet</h3>
              <p className="text-xs text-white/50 max-w-[240px] mt-1.5 leading-relaxed">
                Swipe right on profiles in the Discover tab. When you both like each other, they will appear here!
              </p>
            </div>
          </div>
        ) : (
          matches.map((m) => (
            <MotionDiv
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveChatProfile(m)}
              className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 flex items-center gap-3.5 cursor-pointer transition-colors"
            >
              {/* Avatar with pulse ring */}
              <div className="relative w-13 h-13 rounded-full overflow-hidden border-2 border-coy-pink/60 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {m.name}, <span className="font-normal text-white/70">{m.age}</span>
                  </h4>
                  <span className="text-[10px] text-white/40">Matched</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-white/50 truncate mt-0.5">
                  <MapPin className="w-3 h-3 text-coy-pink shrink-0" />
                  <span className="truncate">{m.location}</span>
                </div>

                <p className="text-[11px] text-white/70 truncate mt-1 italic">
                  &ldquo;{m.bio}&rdquo;
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-coy-pink/15 text-coy-pink flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
            </MotionDiv>
          ))
        )}
      </div>

      {/* Chat Drawer Modal */}
      <AnimatePresence>
        {activeChatProfile && (
          <MotionDiv
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="absolute inset-0 z-40 bg-[#12141C] flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-coy-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-coy-pink/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activeChatProfile.photo} alt={activeChatProfile.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{activeChatProfile.name}</span>
                    <Sparkles className="w-3 h-3 text-coy-pink" />
                  </h3>
                  <p className="text-[10px] text-white/50">{activeChatProfile.location}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveChatProfile(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[11px] text-white/50 border border-white/10">
                  <span>Matched on Coy</span> • <span>Mutual Crush</span>
                </div>
              </div>

              {currentChat.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-xs">
                  Say hi to {activeChatProfile.name}! Break the ice with a compliment ✨
                </div>
              ) : (
                currentChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'me'
                          ? 'bg-gradient-to-r from-coy-pink to-coy-purple text-white rounded-br-xs'
                          : 'bg-white/10 text-white/90 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="block text-[9px] opacity-60 text-right mt-1">{msg.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-white/10 bg-coy-card flex items-center gap-2">
              <input
                type="text"
                placeholder={`Message ${activeChatProfile.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-coy-pink"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-full coy-button-gradient flex items-center justify-center text-white disabled:opacity-40 disabled:pointer-events-none transition-opacity shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
