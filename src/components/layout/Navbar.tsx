import React, { useState } from 'react';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { GhostCompanion, GhostVariant } from '../illustrations/GhostCompanion.js';
import { Terminal, Tv, Sparkles, Menu, X, Flame, Volume2, VolumeX } from 'lucide-react';
import { GhostCompanionId } from '../../types/index.js';

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'investigate'
  | 'chat'
  | 'cemetery'
  | 'evidence'
  | 'revival'
  | 'progression'
  | 'daily';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userXP: number;
  userLevel: number;
  activeCompanion: GhostCompanionId;
  crtActive: boolean;
  setCrtActive: (val: boolean) => void;
  soundActive: boolean;
  setSoundActive: (val: boolean) => void;
  repoSummoned: boolean;
}

const TAB_CONFIG: Array<{ id: ActiveTab; label: string; isAi?: boolean }> = [
  { id: 'dashboard', label: 'HQ' },
  { id: 'investigate', label: 'Investigate' },
  { id: 'chat', label: 'Gemini Chatbot', isAi: true },
  { id: 'cemetery', label: 'Bug Cemetery' },
  { id: 'evidence', label: 'Evidence Wall' },
  { id: 'revival', label: 'Revival Plan' },
  { id: 'daily', label: 'Daily Haunt' },
];

const COMPANION_TO_VARIANT: Record<GhostCompanionId, GhostVariant> = {
  'lost-spirit': 'idle',
  'curious-phantom': 'lantern',
  'code-detective': 'detective',
  'bug-exorcist': 'bugnet',
  'repository-guardian': 'excited',
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userXP,
  userLevel,
  activeCompanion,
  crtActive,
  setCrtActive,
  soundActive,
  setSoundActive,
  repoSummoned,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Level progress math (each level requires level * 200 XP)
  const currentLevelBaseXP = (userLevel - 1) * 200;
  const nextLevelXP = userLevel * 200;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((userXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100))
  );

  const companionVariant = COMPANION_TO_VARIANT[activeCompanion] || 'idle';

  return (
    <header className="sticky top-0 z-40 bg-[#0D0B0A]/90 backdrop-blur-md border-b border-[#392820] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2 sm:gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7518] rounded-md p-1"
          >
            <div className="relative flex items-center shrink-0">
              <JackOLantern expression="mischievous" size="sm" />
              <div className="absolute -top-1.5 -right-2 transform group-hover:-translate-y-1 transition-transform">
                <GhostCompanion variant="waving" size="xs" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base sm:text-lg tracking-wider text-[#F4EDE5] group-hover:text-[#FF9F43] transition-colors">
                  DARKIT
                </span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-mono text-[#FF7518] bg-[#FF7518]/10 px-1.5 py-0.2 rounded border border-[#FF7518]/30">
                  SHELL
                </span>
              </div>
              <span className="hidden sm:block text-[9px] sm:text-[10px] font-mono tracking-tight text-[#776C64] uppercase -mt-0.5">
                The Haunted Git Terminal
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#FF9F43] bg-[#1D1714] border border-[#FF7518]/40 shadow-[0_0_12px_rgba(255,117,24,0.15)]'
                    : 'text-[#B4A69A] hover:text-[#F4EDE5] hover:bg-[#15110F]'
                }`}
              >
                {tab.isAi && <Sparkles className="w-3 h-3 text-[#FF9F43] animate-pulse" />}
                <span>{tab.label}</span>
                {tab.isAi && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#FF7518]/20 text-[#FF9F43] border border-[#FF7518]/40">
                    AI
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#FF7518] to-transparent rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Zone: XP & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Spooky Ghost Danger Soundscape Toggle */}
          <button
            onClick={() => setSoundActive(!soundActive)}
            title={soundActive ? 'Mute ghost danger soundscape' : 'Enable continuous ghost danger sound'}
            className={`p-2 rounded-lg border text-xs transition-all min-h-[38px] min-w-[38px] flex items-center justify-center ${
              soundActive
                ? 'border-[#FF7518] text-[#FF9F43] bg-[#FF7518]/15 shadow-[0_0_12px_rgba(255,117,24,0.4)] animate-pulse'
                : 'border-[#392820] text-[#776C64] hover:text-[#B4A69A] hover:border-[#776C64]'
            }`}
            aria-label="Toggle sound"
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* CRT Scanline Toggle - hidden on extra small screens to conserve space, available in drawer */}
          <button
            onClick={() => setCrtActive(!crtActive)}
            title={crtActive ? 'Turn off CRT Scanlines' : 'Turn on CRT Scanlines'}
            className={`hidden sm:flex p-2 rounded-lg border text-xs transition-colors min-h-[38px] min-w-[38px] items-center justify-center ${
              crtActive
                ? 'border-[#FF7518] text-[#FF9F43] bg-[#FF7518]/10 shadow-[0_0_8px_rgba(255,117,24,0.3)]'
                : 'border-[#392820] text-[#776C64] hover:text-[#B4A69A] hover:border-[#776C64]'
            }`}
            aria-label="Toggle CRT Scanlines"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* XP & Level Meter */}
          <button
            onClick={() => setActiveTab('progression')}
            title="View XP & Ghost Evolution"
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 transition-all text-left group min-h-[38px]"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0">
              <GhostCompanion variant={companionVariant} size="xs" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center justify-between gap-2 text-[10px] font-mono leading-tight">
                <span className="text-[#FF9F43] font-bold">LVL {userLevel}</span>
                <span className="text-[#776C64] tabular-nums">{userXP} XP</span>
              </div>
              <div className="w-14 sm:w-16 h-1 bg-[#110F0E] rounded-full overflow-hidden mt-0.5 border border-[#392820]/60">
                <div
                  className="h-full bg-gradient-to-r from-[#FF7518] to-[#FFC15A] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="sm:hidden text-[10px] font-mono text-[#FF9F43] font-bold">
              L{userLevel}
            </span>
          </button>

          {/* Summon CTA button in header if not already on dashboard/investigate */}
          {activeTab === 'landing' ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hidden sm:flex px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FF7518] text-[#0D0B0A] hover:bg-[#FF9F43] transition-colors whitespace-nowrap shadow-[0_0_12px_rgba(255,117,24,0.4)] items-center gap-1.5 min-h-[38px]"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Summon Repo</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('landing')}
              className="hidden md:inline-flex px-3 py-1.5 text-xs font-medium rounded-lg text-[#B4A69A] hover:text-[#F4EDE5] hover:bg-[#1D1714] border border-[#392820] transition-colors whitespace-nowrap min-h-[38px] items-center"
            >
              Landing
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-[#392820] text-[#B4A69A] hover:text-[#F4EDE5] min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#15110F] border-b border-[#392820] px-4 py-3 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-xs font-medium rounded-md flex items-center justify-between min-h-[40px] transition-colors ${
                  isActive
                    ? 'text-[#FF9F43] bg-[#1D1714] border border-[#FF7518]/30 font-bold'
                    : 'text-[#B4A69A] hover:text-[#F4EDE5] hover:bg-[#110F0E]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.isAi && <Sparkles className="w-3.5 h-3.5 text-[#FF7518]" />}
                  <span>{tab.label}</span>
                  {tab.isAi && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#FF7518]/20 text-[#FF9F43]">
                      AI
                    </span>
                  )}
                </div>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#FF7518]" />}
              </button>
            );
          })}

          <div className="pt-3 mt-2 border-t border-[#392820]/60 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#776C64] px-1">
              <button
                onClick={() => setSoundActive(!soundActive)}
                className="flex items-center gap-2 text-xs font-mono text-[#B4A69A] hover:text-[#FF9F43] py-1"
              >
                {soundActive ? <Volume2 className="w-4 h-4 text-[#FF9F43]" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundActive ? 'Danger Audio: ON' : 'Danger Audio: MUTED'}</span>
              </button>

              <button
                onClick={() => setCrtActive(!crtActive)}
                className="flex items-center gap-1.5 text-xs font-mono text-[#B4A69A] hover:text-[#FF9F43] py-1"
              >
                <Tv className="w-4 h-4" />
                <span>CRT: {crtActive ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 px-1 text-xs">
              <button
                onClick={() => {
                  setActiveTab('progression');
                  setMobileMenuOpen(false);
                }}
                className="text-[#FF9F43] hover:underline font-mono text-xs flex items-center gap-1"
              >
                <span>Level {userLevel} · {userXP} XP</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 rounded-md bg-[#FF7518] text-[#0D0B0A] font-bold text-[11px] uppercase tracking-wider"
              >
                Summon Repo
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
