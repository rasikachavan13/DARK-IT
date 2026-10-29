import React, { useState, useEffect } from 'react';
import {
  SummonedRepository,
  ChatMessage,
  GhostCompanionId,
  Achievement,
  DailyHauntState,
} from './types/index.js';
import { Navbar, ActiveTab } from './components/layout/Navbar.js';
import { LandingHero } from './components/landing/LandingHero.js';
import { DashboardOverview } from './components/dashboard/DashboardOverview.js';
import { InvestigateWorkspace } from './components/investigate/InvestigateWorkspace.js';
import { GhostChat } from './components/chat/GhostChat.js';
import { BugCemetery } from './components/cemetery/BugCemetery.js';
import { EvidenceWall } from './components/evidence/EvidenceWall.js';
import { RevivalPlan } from './components/revival/RevivalPlan.js';
import { XPProgression } from './components/progression/XPProgression.js';
import { DailyHaunt } from './components/daily/DailyHaunt.js';
import { AmbientEmbers } from './components/common/AmbientEmbers.js';
import { JackOLantern } from './components/illustrations/JackOLantern.js';
import { GhostCompanion } from './components/illustrations/GhostCompanion.js';
import { soundEngine } from './utils/soundEffects.js';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-summoning',
    name: 'First Summoning',
    description: 'Call forth your first public repository from the spectral realm.',
    unlocked: false,
    progress: 0,
    max: 1,
    icon: 'flame',
    rewardXP: 100,
  },
  {
    id: 'ghost-whisperer',
    name: 'Ghost Whisperer',
    description: 'Interrogate the repository spirits with 3 distinct inquiries in Ghost Q&A.',
    unlocked: false,
    progress: 0,
    max: 3,
    icon: 'ghost',
    rewardXP: 75,
  },
  {
    id: 'bug-hunter',
    name: 'Bug Hunter',
    description: 'Exorcise 2 lurking curses in the Bug Cemetery.',
    unlocked: false,
    progress: 0,
    max: 2,
    icon: 'bug',
    rewardXP: 100,
  },
  {
    id: 'evidence-collector',
    name: 'Evidence Collector',
    description: 'Inspect verified architectural findings on the Evidence Wall.',
    unlocked: false,
    progress: 0,
    max: 2,
    icon: 'shield',
    rewardXP: 50,
  },
  {
    id: 'revival-ritual',
    name: 'Revival Ritualist',
    description: 'Complete at least 1 phased engineering task in the Revival Plan.',
    unlocked: false,
    progress: 0,
    max: 1,
    icon: 'sparkles',
    rewardXP: 100,
  },
  {
    id: 'repository-explorer',
    name: 'Crypt Explorer',
    description: 'Summon and inspect 2 distinct codebases in the terminal.',
    unlocked: false,
    progress: 0,
    max: 2,
    icon: 'compass',
    rewardXP: 150,
  },
];

const INITIAL_DAILY_HAUNT: DailyHauntState = {
  title: "TODAY'S HAUNT",
  subtitle: 'One small investigation. One step closer to mastering the codebase.',
  claimed: false,
  expiresAt: '23:59:59',
  tasks: [
    {
      id: 'task-1',
      title: 'Summon an Ancient Repository',
      description: 'Awaken a public GitHub codebase to investigate commit echoes and bugs.',
      completed: false,
      xp: 50,
    },
    {
      id: 'task-2',
      title: 'Interrogate the Commit Spirits',
      description: 'Ask 1 question in the Ghost Q&A terminal about architecture or entrypoints.',
      completed: false,
      xp: 40,
    },
    {
      id: 'task-3',
      title: 'Exorcise a Graveyard Curse',
      description: 'Banish an identified bug in the Bug Cemetery to earn purification points.',
      completed: false,
      xp: 60,
    },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [repo, setRepo] = useState<SummonedRepository | null>(null);
  const [isSummoning, setIsSummoning] = useState(false);
  const [summonError, setSummonError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Progression State
  const [userXP, setUserXP] = useState<number>(() => {
    const saved = localStorage.getItem('darkit_xp');
    return saved ? parseInt(saved, 10) : 120;
  });
  const [activeCompanion, setActiveCompanion] = useState<GhostCompanionId>(() => {
    const saved = localStorage.getItem('darkit_companion');
    return (saved as GhostCompanionId) || 'lost-spirit';
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('darkit_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });
  const [dailyHaunt, setDailyHaunt] = useState<DailyHauntState>(() => {
    const saved = localStorage.getItem('darkit_daily');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_HAUNT;
  });

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Visual CRT Scanlines Effect
  const [crtActive, setCrtActive] = useState<boolean>(true);

  // Global Supernatural Soundscape
  const [soundActive, setSoundActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkit_sound');
    return saved === 'true';
  });

  // Floating notification toast for XP awards
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate Level (200 XP per level)
  const userLevel = Math.max(1, Math.floor(userXP / 200) + 1);

  // Save progression
  useEffect(() => {
    localStorage.setItem('darkit_xp', userXP.toString());
  }, [userXP]);

  useEffect(() => {
    localStorage.setItem('darkit_companion', activeCompanion);
  }, [activeCompanion]);

  useEffect(() => {
    localStorage.setItem('darkit_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('darkit_daily', JSON.stringify(dailyHaunt));
  }, [dailyHaunt]);

  // Sync ambient soundscape
  useEffect(() => {
    localStorage.setItem('darkit_sound', soundActive ? 'true' : 'false');
    soundEngine.setAmbience(soundActive);
    if (soundActive) {
      soundEngine.playGhostChime();
    }
  }, [soundActive]);

  // Update companion unlocks based on level
  useEffect(() => {
    if (userLevel >= 2 && activeCompanion === 'lost-spirit') {
      setActiveCompanion('curious-phantom');
    }
  }, [userLevel, activeCompanion]);

  const awardXP = (amount: number, reason: string) => {
    setUserXP((prev) => prev + amount);
    setToastMessage(`+${amount} XP: ${reason}`);
    if (soundActive) soundEngine.playReward();
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateAchievementProgress = (achievementId: string, delta: number = 1) => {
    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id === achievementId && !a.unlocked) {
          const newProgress = Math.min(a.max, a.progress + delta);
          const unlocked = newProgress >= a.max;
          if (unlocked) {
            awardXP(a.rewardXP, `Achievement Unlocked: ${a.name}`);
          }
          return { ...a, progress: newProgress, unlocked };
        }
        return a;
      })
    );
  };

  const handleTabChange = (tab: ActiveTab) => {
    if (soundActive) soundEngine.playClick();
    setActiveTab(tab);
  };

  // Handler for summoning a repository
  const handleSummon = async (repoUrl: string) => {
    setIsSummoning(true);
    setSummonError(null);
    if (soundActive) soundEngine.playSummon();

    try {
      const res = await fetch('/api/summon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'The spirits failed to retrieve repository telemetry.');
      }

      setRepo(data);
      setLastSyncedAt(new Date());
      if (soundActive) soundEngine.playGhostChime();
      awardXP(100, `Summoned ${data.meta.fullName}`);
      updateAchievementProgress('first-summoning', 1);
      updateAchievementProgress('repository-explorer', 1);

      // Complete daily task if applicable
      setDailyHaunt((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === 'task-1' ? { ...t, completed: true } : t)),
      }));

      // Switch to investigation view
      setActiveTab('investigate');
    } catch (err: any) {
      console.error('Summon error:', err);
      setSummonError(err.message || 'The spiritual link was severed.');
    } finally {
      setIsSummoning(false);
    }
  };

  // Handler for background telemetry sync (e.g. 60-second periodic sync)
  const handleRefreshRepo = async (silent: boolean = true) => {
    if (!repo) return;
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/summon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: repo.meta.fullName }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'The spirits could not sync repository telemetry.');
      }

      setRepo(data);
      setLastSyncedAt(new Date());
      if (soundActive) soundEngine.playGhostChime();
    } catch (err: any) {
      console.warn('Background telemetry sync error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handler for sending messages in Ghost Q&A
  const handleSendMessage = async (question: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);
    if (soundActive) soundEngine.playClick();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoContext: repo,
          messages,
          question,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'The spirits went quiet.');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
        ghostMood: data.ghostMood || 'curious',
      };

      setMessages((prev) => [...prev, botMsg]);
      if (soundActive) soundEngine.playGhostChime();
      awardXP(20, 'Interrogated Commit Spirits');
      updateAchievementProgress('ghost-whisperer', 1);

      setDailyHaunt((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === 'task-2' ? { ...t, completed: true } : t)),
      }));
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `*The candle flickers out.* An error occurred: ${err.message}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handler for exorcising a bug
  const handleExorciseBug = (bugId: string) => {
    if (!repo) return;
    if (soundActive) soundEngine.playExorcise();

    setRepo((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        analysis: {
          ...prev.analysis,
          bugs: prev.analysis.bugs.map((b) =>
            b.id === bugId ? { ...b, status: 'exorcised' as const, exorcisedAt: new Date().toISOString() } : b
          ),
        },
      };
    });

    awardXP(25, 'Graveyard Bug Exorcised');
    updateAchievementProgress('bug-hunter', 1);

    setDailyHaunt((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === 'task-3' ? { ...t, completed: true } : t)),
    }));
  };

  // Handler for toggling revival step
  const handleToggleRevivalStep = (stepId: string) => {
    if (!repo) return;
    if (soundActive) soundEngine.playGhostChime();

    setRepo((prev) => {
      if (!prev) return null;
      const willBeCompleted = !prev.analysis.revivalPlan.find((s) => s.id === stepId)?.completed;
      if (willBeCompleted) {
        awardXP(50, 'Revival Ritual Step Performed');
        updateAchievementProgress('revival-ritual', 1);
      }
      return {
        ...prev,
        analysis: {
          ...prev.analysis,
          revivalPlan: prev.analysis.revivalPlan.map((s) =>
            s.id === stepId ? { ...s, completed: !s.completed } : s
          ),
        },
      };
    });
  };

  // Toggle daily task
  const handleToggleDailyTask = (taskId: string) => {
    if (soundActive) soundEngine.playClick();
    setDailyHaunt((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    }));
  };

  // Claim daily haunt bounty
  const handleClaimDailyReward = () => {
    if (dailyHaunt.claimed) return;
    setDailyHaunt((prev) => ({ ...prev, claimed: true }));
    if (soundActive) soundEngine.playReward();
    awardXP(150, 'Daily Haunt Bounty Claimed');
  };

  return (
    <div className="min-h-screen bg-[#0D0B0A] text-[#F4EDE5] flex flex-col relative selection:bg-[#FF7518]/30 selection:text-[#FF9F43]">
      {/* Background Ambient Embers / Fireflies */}
      <AmbientEmbers count={24} />

      {/* CRT Scanline Overlay Texture */}
      {crtActive && (
        <div className="fixed inset-0 crt-overlay z-50 pointer-events-none" />
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        userXP={userXP}
        userLevel={userLevel}
        activeCompanion={activeCompanion}
        crtActive={crtActive}
        setCrtActive={setCrtActive}
        soundActive={soundActive}
        setSoundActive={setSoundActive}
        repoSummoned={!!repo}
      />

      {/* Floating XP Award Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 p-3.5 rounded-xl bg-[#1D1714] border border-[#FF7518] shadow-[0_0_24px_rgba(255,117,24,0.4)] flex items-center gap-3 animate-bounce">
          <JackOLantern expression="victorious" size="xs" />
          <span className="font-mono text-xs font-bold text-[#FF9F43]">
            {toastMessage}
          </span>
        </div>
      )}

      {/* Global Floating Quick-Access to Gemini Chatbot */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => handleTabChange('chat')}
          className="fixed bottom-6 right-6 z-40 bg-[#15110F] hover:bg-[#1D1714] text-[#F4EDE5] border border-[#FF7518]/50 hover:border-[#FF7518] px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(255,117,24,0.35)] flex items-center gap-2.5 transition-all group hover:scale-105 active:scale-95"
          title="Open Gemini Ghost Chatbot"
        >
          <div className="relative">
            <GhostCompanion variant="lantern" size="xs" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF7518] animate-ping" />
          </div>
          <span className="font-display font-bold text-xs tracking-wide text-[#F4EDE5] group-hover:text-[#FF9F43]">
            Ask Gemini Ghost
          </span>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FF7518]/20 text-[#FF9F43] border border-[#FF7518]/40">
            AI
          </span>
        </button>
      )}

      {/* Main Content Router */}
      <main className="flex-1 relative z-10">
        {activeTab === 'landing' && (
          <LandingHero
            onSummon={handleSummon}
            onExploreLab={() => handleTabChange('dashboard')}
            onOpenChat={() => handleTabChange('chat')}
            isSummoning={isSummoning}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardOverview
            repo={repo}
            onSummon={handleSummon}
            isSummoning={isSummoning}
            summonError={summonError}
            setActiveTab={setActiveTab}
            userXP={userXP}
            userLevel={userLevel}
            activeCompanion={activeCompanion}
            onRefreshRepo={handleRefreshRepo}
            isRefreshing={isRefreshing}
            lastSyncedAt={lastSyncedAt}
          />
        )}

        {activeTab === 'investigate' && (
          <InvestigateWorkspace
            repo={repo}
            onReanalyze={() => {
              if (repo) handleSummon(repo.meta.fullName);
            }}
            isReanalyzing={isSummoning}
            onOpenSummon={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'chat' && (
          <GhostChat
            repo={repo}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            onOpenSummon={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'cemetery' && (
          <BugCemetery
            repo={repo}
            onExorciseBug={handleExorciseBug}
            onOpenSummon={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceWall
            repo={repo}
            onOpenSummon={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'revival' && (
          <RevivalPlan
            repo={repo}
            onToggleStep={handleToggleRevivalStep}
            onOpenSummon={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'progression' && (
          <XPProgression
            userXP={userXP}
            userLevel={userLevel}
            activeCompanion={activeCompanion}
            onSelectCompanion={setActiveCompanion}
            achievements={achievements}
          />
        )}

        {activeTab === 'daily' && (
          <DailyHaunt
            dailyHaunt={dailyHaunt}
            onToggleTask={handleToggleDailyTask}
            onClaimDailyReward={handleClaimDailyReward}
            onGoToSummon={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#392820] bg-[#0D0B0A]/90 py-6 px-4 text-center text-xs text-[#776C64] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <JackOLantern expression="mischievous" size="xs" />
            <span className="font-mono text-[#F4EDE5] font-semibold">DARKIT</span>
            <span>·</span>
            <span>The Haunted Git Terminal</span>
          </div>

          <div className="text-[11px] font-mono text-[#B4A69A]">
            "Your code isn't dead. It's just haunted."
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[#776C64]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7518]" />
            <span>AI Ghost Shell Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
