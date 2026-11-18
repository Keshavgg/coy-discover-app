'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DiscoverFeed from '@/components/DiscoverFeed';
import MatchesView from '@/components/MatchesView';
import HomePlaceholder from '@/components/HomePlaceholder';
import BottomNav, { TabType } from '@/components/BottomNav';
import MatchModal from '@/components/MatchModal';
import { PublicProfile, MatchRecord } from '@/lib/db';

export default function CoyApp() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [feed, setFeed] = useState<PublicProfile[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [matchedProfile, setMatchedProfile] = useState<PublicProfile | null>(null);
  const [activeChatProfile, setActiveChatProfile] = useState<MatchRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canUndo, setCanUndo] = useState(false);

  // Fetch Feed
  const fetchFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.success) {
        setFeed(data.profiles);
      }
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Matches
  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    fetchMatches();
  }, [fetchFeed, fetchMatches]);

  // Handle Swipe (like or pass)
  const handleSwipe = async (profileId: string, action: 'like' | 'pass') => {
    // Optimistically remove from feed
    setFeed((prev) => prev.filter((p) => p.id !== profileId));
    setCanUndo(true);

    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, action }),
      });

      const data = await res.json();
      if (data.success && data.matched && data.profile) {
        setMatchedProfile(data.profile);
        fetchMatches(); // update matches list
      }
    } catch (err) {
      console.error('Error during swipe:', err);
    }
  };

  // Handle Undo / Rewind
  const handleUndo = async () => {
    try {
      const res = await fetch('/api/undo', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.profile) {
        setFeed((prev) => [data.profile, ...prev]);
        fetchMatches();
      } else {
        setCanUndo(false);
      }
    } catch (err) {
      console.error('Error undoing swipe:', err);
    }
  };

  // Handle Reset for Demo
  const handleReset = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      setCanUndo(false);
      await fetchFeed();
      await fetchMatches();
    } catch (err) {
      console.error('Error resetting demo:', err);
    }
  };

  // Open Chat from Match Modal
  const handleOpenChatFromModal = (profile: PublicProfile) => {
    const asMatchRecord: MatchRecord = {
      ...profile,
      matched_at: new Date().toISOString(),
    };
    setActiveTab('matches');
    setActiveChatProfile(asMatchRecord);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden relative">
      {/* Tab Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeTab === 'home' && (
          <HomePlaceholder onGoToDiscover={() => setActiveTab('discover')} />
        )}

        {activeTab === 'discover' && (
          <DiscoverFeed
            profiles={feed}
            onSwipe={handleSwipe}
            onUndo={handleUndo}
            onReset={handleReset}
            canUndo={canUndo}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            activeChatProfile={activeChatProfile}
            setActiveChatProfile={setActiveChatProfile}
            onRefresh={fetchMatches}
          />
        )}
      </div>

      {/* Match Celebration Screen */}
      <MatchModal
        matchedProfile={matchedProfile}
        onClose={() => setMatchedProfile(null)}
        onOpenChat={handleOpenChatFromModal}
      />

      {/* Persistent Bottom Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchesCount={matches.length}
        feedCount={feed.length}
      />
    </div>
  );
}
