import React, { useState, useEffect } from 'react';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { GhostCompanion } from '../illustrations/GhostCompanion.js';
import { HangingLantern } from '../illustrations/HangingLantern.js';
import { SummonedRepository, GhostCompanionId } from '../../types/index.js';
import { ActiveTab } from '../layout/Navbar.js';
import { RepositoryMetrics } from './RepositoryMetrics.js';
import { soundEngine } from '../../utils/soundEffects.js';
import {
  Terminal,
  Search,
  Flame,
  MessageSquare,
  Bug,
  ShieldAlert,
  Sparkles,
  Trophy,
  Calendar,
  ExternalLink,
  GitBranch,
  Star,
  GitFork,
  ArrowRight,
  AlertTriangle,
  RotateCw,
  Radio,
  Clock,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface DashboardOverviewProps {
  repo: SummonedRepository | null;
  onSummon: (repoUrl: string) => void;
  isSummoning: boolean;
  summonError: string | null;
  setActiveTab: (tab: ActiveTab) => void;
  userXP: number;
  userLevel: number;
  activeCompanion: GhostCompanionId;
  onRefreshRepo?: (silent?: boolean) => Promise<void>;
  isRefreshing?: boolean;
  lastSyncedAt?: Date | null;
}

const PRESET_REPOS = [
  'expressjs/express',
  'facebook/react',
  'pallets/flask',
  'octocat/Spoon-Knife',
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  repo,
  onSummon,
  isSummoning,
  summonError,
  setActiveTab,
  userXP,
  userLevel,
  activeCompanion,
  onRefreshRepo,
  isRefreshing = false,
  lastSyncedAt = null,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [autoSync, setAutoSync] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkit_auto_sync');
    return saved !== null ? saved === 'true' : true;
  });
  const [countdown, setCountdown] = useState<number>(60);
  const [justSynced, setJustSynced] = useState<boolean>(false);

  // Auto-sync interval: 60-second countdown for background telemetry refresh
  useEffect(() => {
    if (!autoSync) {
      setCountdown(60);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Time to refresh repository telemetry
          if (repo && onRefreshRepo) {
            onRefreshRepo(true).then(() => {
              setJustSynced(true);
              setTimeout(() => setJustSynced(false), 3000);
            });
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoSync, repo, onRefreshRepo]);

  const handleToggleSync = () => {
    soundEngine.playClick();
    setAutoSync((prev) => {
      const next = !prev;
      localStorage.setItem('darkit_auto_sync', String(next));
      if (next) {
        setCountdown(60);
        if (repo && onRefreshRepo) {
          onRefreshRepo(true).then(() => {
            setJustSynced(true);
            setTimeout(() => setJustSynced(false), 3000);
          });
        }
      }
      return next;
    });
  };

  const handleManualSync = async () => {
    if (!repo || isRefreshing || !onRefreshRepo) return;
    soundEngine.playClick();
    await onRefreshRepo(false);
    setCountdown(60);
    setJustSynced(true);
    setTimeout(() => setJustSynced(false), 3000);
  };

  const handleSummon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onSummon(inputUrl.trim());
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Section Header */}
      <div className="p-6 rounded-2xl bg-[#15110F] border border-[#392820] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient subtle glow */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-[#FF7518]/10 to-transparent pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="animate-ghost-float">
            <GhostCompanion variant="lantern" size="lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF9F43] bg-[#FF7518]/10 px-2 py-0.5 rounded border border-[#FF7518]/20">
                HQ STATION · SECTOR 07
              </span>
              <span className="text-xs text-[#776C64]">·</span>
              <span className="text-xs text-[#776C64] font-mono">OCTOBER 2026</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F4EDE5] mt-1">
              THE HAUNTED GIT TERMINAL
            </h1>
            <p className="text-sm text-[#B4A69A] mt-0.5">
              The graveyard is quiet. Your next repository may not be.
            </p>
          </div>
        </div>

        {/* Level and Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:flex items-center gap-2.5 relative z-10 w-full md:w-auto border-t md:border-t-0 border-[#392820] pt-4 md:pt-0">
          {/* 60s Background Telemetry Auto-Sync Switch */}
          <div
            className={`flex items-center justify-between sm:justify-start gap-2.5 px-3 py-2 rounded-xl border transition-all ${
              autoSync
                ? 'bg-[#1D1714] border-[#FF7518]/50 shadow-[0_0_16px_rgba(255,117,24,0.18)]'
                : 'bg-[#1D1714] border-[#392820]'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <RotateCw
                  className={`w-3.5 h-3.5 ${
                    isRefreshing
                      ? 'animate-spin text-[#FF7518]'
                      : autoSync
                      ? 'text-[#FF9F43]'
                      : 'text-[#776C64]'
                  }`}
                />
                {autoSync && !isRefreshing && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#9BD49A] animate-ping" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#776C64]">Sync</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      autoSync
                        ? 'bg-[#FF7518]/20 text-[#FF9F43] border-[#FF7518]/40'
                        : 'bg-[#261E1A] text-[#776C64] border-[#392820]'
                    }`}
                  >
                    60S
                  </span>
                </div>
                <div className="text-xs font-mono font-semibold flex items-center gap-1.5">
                  {isRefreshing ? (
                    <span className="text-[#FF7518] animate-pulse">Syncing...</span>
                  ) : autoSync ? (
                    <span className="text-[#9BD49A] flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 animate-pulse text-[#9BD49A]" />
                      <span>{countdown}s auto</span>
                    </span>
                  ) : (
                    <span className="text-[#776C64]">Paused</span>
                  )}
                </div>
              </div>
            </div>

            {/* Accessible Sync Switch Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={autoSync}
              aria-label="Toggle 60s background repository telemetry sync"
              onClick={handleToggleSync}
              title={autoSync ? 'Disable 60s background sync' : 'Enable 60s background sync'}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#FF7518] ${
                autoSync ? 'bg-[#FF7518]' : 'bg-[#261E1A] border-[#392820]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0D0B0A] shadow-md ring-0 transition duration-200 ease-in-out ${
                  autoSync ? 'translate-x-4' : 'translate-x-0 bg-[#776C64]'
                }`}
              />
            </button>

            {/* Manual Immediate Sync button if repo exists */}
            {repo && (
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isRefreshing}
                title="Trigger telemetry refresh now"
                className="p-1 rounded-md text-[#776C64] hover:text-[#FF7518] hover:bg-[#261E1A] border border-transparent hover:border-[#392820] transition-colors disabled:opacity-40"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF7518]' : ''}`} />
              </button>
            )}
          </div>

          <button
            onClick={() => setActiveTab('daily')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1D1714] border border-[#392820] hover:border-[#FFC15A]/40 transition-colors text-left"
          >
            <JackOLantern expression="excited" size="xs" />
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#776C64]">Daily Haunt</span>
              <span className="text-xs font-semibold text-[#FFC15A]">Active Challenge</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('progression')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1D1714] border border-[#392820] hover:border-[#FF7518]/40 transition-colors text-left"
          >
            <Trophy className="w-4 h-4 text-[#FF9F43]" />
            <div>
              <span className="block text-[10px] font-mono uppercase text-[#776C64]">Mastery</span>
              <span className="text-xs font-semibold text-[#F4EDE5] font-mono">LVL {userLevel} · {userXP} XP</span>
            </div>
          </button>
        </div>
      </div>

      {/* Repository Summoning Panel */}
      <div className="relative rounded-2xl bg-[#110F0E] border border-[#392820] shadow-[0_12px_36px_rgba(0,0,0,0.6)] p-6 sm:p-8 overflow-hidden">
        {/* Pumpkin in the top right corner */}
        <div className="absolute top-4 right-4 hidden sm:block">
          <JackOLantern expression="suspicious" size="sm" />
        </div>

        {/* Ghost peeking over border */}
        <div className="absolute -top-4 left-10 hidden sm:block animate-ghost-float-alt">
          <GhostCompanion variant="waving" size="xs" />
        </div>

        {/* Hanging lantern illuminating the input area */}
        <div className="absolute top-2 right-20 hidden md:block">
          <HangingLantern size="sm" chainHeight={20} />
        </div>

        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF9F43]">
            <Terminal className="w-4 h-4 text-[#FF7518]" />
            <span className="font-bold tracking-wider uppercase">SUMMON A REPOSITORY</span>
          </div>

          <h2 className="font-display font-bold text-xl text-[#F4EDE5]">
            Call forth any public GitHub repository
          </h2>
          <p className="text-xs text-[#B4A69A]">
            Enter a public GitHub repository URL to begin the investigation. The spirits will trace commits, analyze the file tree, roast the code, and catalog bugs.
          </p>

          <form onSubmit={handleSummon} className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1 flex items-center bg-[#15110F] border border-[#392820] focus-within:border-[#FF7518] rounded-xl px-3 py-2.5 transition-colors">
                <Search className="w-4 h-4 text-[#776C64] mr-2 shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  disabled={isSummoning}
                  className="w-full bg-transparent text-sm font-mono text-[#F4EDE5] placeholder-[#776C64] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSummoning}
                className="px-6 py-3 rounded-xl bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_16px_rgba(255,117,24,0.35)] flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isSummoning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#0D0B0A] border-t-transparent rounded-full animate-spin" />
                    <span>SEANCE IN PROGRESS...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    <span>INITIATE HAUNT</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {summonError && (
              <div className="p-3 rounded-lg bg-[#FF5B57]/10 border border-[#FF5B57]/30 text-xs text-[#FF5B57] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{summonError}</span>
              </div>
            )}

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[#776C64] font-mono text-[11px]">Or summon a classic:</span>
              {PRESET_REPOS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setInputUrl(preset);
                    onSummon(preset);
                  }}
                  className="px-2.5 py-1 rounded-md bg-[#1D1714] hover:bg-[#261E1A] border border-[#392820] hover:border-[#FF7518]/40 text-[#B4A69A] hover:text-[#FF9F43] font-mono text-[11px] transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* Currently Summoned Repository Snapshot Card */}
      {repo && (
        <div className="p-6 rounded-2xl bg-[#15110F] border border-[#FF7518]/30 shadow-[0_0_24px_rgba(255,117,24,0.12)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#392820]/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#1D1714] border border-[#FF7518]/30">
                <JackOLantern expression="victorious" size="sm" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-lg text-[#F4EDE5]">
                    {repo.meta.fullName}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#FF7518]/10 text-[#FF9F43] border border-[#FF7518]/30">
                    {repo.analysis.hauntLevel}
                  </span>
                </div>
                <p className="text-xs text-[#B4A69A] line-clamp-1 mt-0.5 max-w-2xl">
                  {repo.meta.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-center flex-wrap">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isRefreshing}
                title="Sync telemetry now"
                className="px-3 py-1.5 rounded-lg bg-[#1D1714] hover:bg-[#261E1A] text-xs font-mono text-[#B4A69A] hover:text-[#FF7518] border border-[#392820] flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#FF7518]' : 'text-[#776C64]'}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
              </button>
              <a
                href={repo.meta.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#1D1714] hover:bg-[#261E1A] text-xs font-mono text-[#B4A69A] hover:text-[#F4EDE5] border border-[#392820] flex items-center gap-1.5 transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setActiveTab('investigate')}
                className="px-4 py-1.5 rounded-lg bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Open Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div>
              <span className="block text-[11px] text-[#776C64]">Language</span>
              <span className="font-mono text-[#F4EDE5] font-medium">{repo.meta.language}</span>
            </div>
            <div>
              <span className="block text-[11px] text-[#776C64]">Stars / Forks</span>
              <span className="font-mono text-[#F4EDE5] font-medium">
                ★ {repo.meta.stars.toLocaleString()} / ⑂ {repo.meta.forks.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-[#776C64]">Open Issues</span>
              <span className="font-mono text-[#FFC15A] font-medium">{repo.meta.openIssues} tickets</span>
            </div>
            <div>
              <span className="block text-[11px] text-[#776C64]">Haunt Severity</span>
              <span className="font-mono text-[#FF9F43] font-medium">{repo.analysis.hauntScore}/100</span>
            </div>
          </div>

          {/* Live telemetry sync status strip */}
          <div className="mt-4 pt-3 border-t border-[#392820]/60 flex items-center justify-between text-[11px] font-mono text-[#776C64] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${autoSync ? 'bg-[#9BD49A] animate-pulse' : 'bg-[#776C64]'}`} />
              <span className="text-[#B4A69A]">
                {autoSync
                  ? `60s Auto-Sync: Active (next telemetry pull in ${countdown}s)`
                  : '60s Auto-Sync: Paused (toggle switch above to resume)'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {justSynced && (
                <span className="text-[#9BD49A] font-semibold animate-pulse flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Telemetry Synced</span>
                </span>
              )}
              {lastSyncedAt && (
                <span className="text-[#776C64]">
                  Last synced {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Repository Metrics Section (D3 Visualizations) */}
      <RepositoryMetrics
        repo={repo}
        onOpenSummon={() => {
          const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement | null;
          inputEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          inputEl?.focus();
        }}
      />

      {/* 9 Responsive Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#F4EDE5] flex items-center gap-2">
            <span>Investigation Modules</span>
            <span className="text-xs font-mono text-[#776C64] font-normal">(9 Active Sanctums)</span>
          </h2>
          <span className="text-xs text-[#776C64]">Click any card to inspect findings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Repository Status */}
          <div
            onClick={() => setActiveTab('investigate')}
            className="p-5 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 hover:bg-[#1A1412] cursor-pointer transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1D1714] border border-[#392820] flex items-center justify-center text-[#FF9F43] group-hover:border-[#FF7518]">
                <Terminal className="w-4 h-4" />
              </div>
              <JackOLantern expression="mischievous" size="xs" />
            </div>
            <h3 className="font-display font-semibold text-sm text-[#F4EDE5] group-hover:text-[#FF9F43] transition-colors">
              01. Repository Status
            </h3>
            <p className="text-xs text-[#776C64] mt-1 leading-relaxed">
              {repo
                ? `${repo.meta.fullName} · ${repo.meta.language} · ${repo.commits.length} recent commits`
                : 'Inspect repository metadata, file tree structure, commit echoes, and license status.'}
            </p>
            <div className="mt-3 flex items-center text-[11px] font-mono text-[#FF7518]">
              <span>Inspect Workspace</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Gemini Ghost Chatbot */}
          <div
            onClick={() => setActiveTab('chat')}
            className="p-5 rounded-xl bg-[#15110F] border border-[#FF7518]/30 hover:border-[#FF7518] hover:bg-[#1A1412] cursor-pointer transition-all group relative shadow-[0_0_16px_rgba(255,117,24,0.08)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1D1714] border border-[#392820] flex items-center justify-center text-[#FF9F43] group-hover:border-[#FF7518]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF7518]/15 text-[#FF9F43] border border-[#FF7518]/30 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF7518]" />
                  <span>GEMINI AI</span>
                </span>
                <GhostCompanion variant="lantern" size="xs" />
              </div>
            </div>
            <h3 className="font-display font-semibold text-sm text-[#F4EDE5] group-hover:text-[#FF9F43] transition-colors flex items-center gap-2">
              <span>02. Gemini Ghost Chatbot</span>
            </h3>
            <p className="text-xs text-[#B4A69A] mt-1 leading-relaxed">
              Powered by Google Gemini 3.8 Flash. Interrogate the codebase spirits, explain architecture, find entrypoints, and generate bug fixes.
            </p>
            <div className="mt-3 flex items-center text-[11px] font-mono text-[#FF7518] font-semibold">
              <span>Launch Gemini Chatbot</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Codebase Roast */}
          <div
            onClick={() => setActiveTab('investigate')}
            className="p-5 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 hover:bg-[#1A1412] cursor-pointer transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1D1714] border border-[#392820] flex items-center justify-center text-[#FF7518] group-hover:border-[#FF7518]">
                <Flame className="w-4 h-4" />
              </div>
              <JackOLantern expression="excited" size="xs" />
            </div>
            <h3 className="font-display font-semibold text-sm text-[#F4EDE5] group-hover:text-[#FF9F43] transition-colors">
              03. The Roast Chamber
            </h3>
            <p className="text-xs text-[#776C64] mt-1 leading-relaxed">
              {repo
                ? repo.analysis.roast.humor.slice(0, 95) + '...'
                : 'A playful but constructive critique separating witty ghost burns from actionable technical advice.'}
            </p>
            <div className="mt-3 flex items-center text-[11px] font-mono text-[#FF7518]">
              <span>Read Roast</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Daily Haunt */}
          <div
            onClick={() => setActiveTab('daily')}
            className="p-5 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 hover:bg-[#1A1412] cursor-pointer transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1D1714] border border-[#392820] flex items-center justify-center text-[#FFC15A] group-hover:border-[#FF7518]">
                <Calendar className="w-4 h-4" />
              </div>
              <JackOLantern expression="victorious" size="xs" />
            </div>
            <h3 className="font-display font-semibold text-sm text-[#F4EDE5] group-hover:text-[#FF9F43] transition-colors">
              04. Daily Haunt Challenge
            </h3>
            <p className="text-xs text-[#776C64] mt-1 leading-relaxed">
              Complete today's investigation tasks, exorcise bugs, and claim +150 bonus XP before midnight.
            </p>
            <div className="mt-3 flex items-center text-[11px] font-mono text-[#FF7518]">
              <span>View Challenges</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. XP & Ghost Evolution */}
          <div
            onClick={() => setActiveTab('progression')}
            className="p-5 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 hover:bg-[#1A1412] cursor-pointer transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1D1714] border border-[#392820] flex items-center justify-center text-[#FF9F43] group-hover:border-[#FF7518]">
                <Sparkles className="w-4 h-4" />
              </div>
              <GhostCompanion variant="excited" size="xs" />
            </div>
            <h3 className="font-display font-semibold text-sm text-[#F4EDE5] group-hover:text-[#FF9F43] transition-colors">
              05. XP & Ghost Evolution
            </h3>
            <p className="text-xs text-[#776C64] mt-1 leading-relaxed">
              Evolve your companion from Lost Spirit to Repository Guardian as you audit codebases.
            </p>
            <div className="mt-3 flex items-center text-[11px] font-mono text-[#FF7518]">
              <span>Evolution Tree</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Ghost Achievements */}
          <div
            onClick={() => setActiveTab('progression')}
            className="p-5 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 hover:bg-[#1A1412] cursor-pointer transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1D1714] border border-[#392820] flex items-center justify-center text-[#FFC15A] group-hover:border-[#FF7518]">
                <Trophy className="w-4 h-4" />
              </div>
              <JackOLantern expression="possessed" size="xs" />
            </div>
            <h3 className="font-display font-semibold text-sm text-[#F4EDE5] group-hover:text-[#FF9F43] transition-colors">
              06. Ghost Achievements
            </h3>
            <p className="text-xs text-[#776C64] mt-1 leading-relaxed">
              6 collectible developer badges: First Summoning, Bug Hunter, Evidence Collector, and more.
            </p>
            <div className="mt-3 flex items-center text-[11px] font-mono text-[#FF7518]">
              <span>View Badges</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 7. Bug Cemetery */}
          <div
            onClick={() => setActiveTab('cemetery')}
            className="p-5 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 hover:bg-[#1A1412] cursor-pointer transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1D1714] border border-[#392820] flex items-center justify-center text-[#FF5B57] group-hover:border-[#FF7518]">
                <Bug className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FF5B57]/10 text-[#FF5B57] border border-[#FF5B57]/30">
                {repo ? `${repo.analysis.bugs.length} Curses` : 'Tombstones'}
              </span>
            </div>
            <h3 className="font-display font-semibold text-sm text-[#F4EDE5] group-hover:text-[#FF9F43] transition-colors">
              07. The Bug Cemetery
            </h3>
            <p className="text-xs text-[#776C64] mt-1 leading-relaxed">
              Cataloged graveyard of open GitHub tickets and detected code curses. Exorcise them to earn XP.
            </p>
            <div className="mt-3 flex items-center text-[11px] font-mono text-[#FF7518]">
              <span>Enter Cemetery</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 8. Evidence Wall */}
          <div
            onClick={() => setActiveTab('evidence')}
            className="p-5 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 hover:bg-[#1A1412] cursor-pointer transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1D1714] border border-[#392820] flex items-center justify-center text-[#FF9F43] group-hover:border-[#FF7518]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <GhostCompanion variant="detective" size="xs" />
            </div>
            <h3 className="font-display font-semibold text-sm text-[#F4EDE5] group-hover:text-[#FF9F43] transition-colors">
              08. The Evidence Wall
            </h3>
            <p className="text-xs text-[#776C64] mt-1 leading-relaxed">
              {repo
                ? `${repo.analysis.evidence.length} verified code clues with file paths and citations.`
                : 'Detective board pinning code snippets, observation clues, meaning, and concrete fixes.'}
            </p>
            <div className="mt-3 flex items-center text-[11px] font-mono text-[#FF7518]">
              <span>Audit Clues</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 9. Revival Plan */}
          <div
            onClick={() => setActiveTab('revival')}
            className="p-5 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 hover:bg-[#1A1412] cursor-pointer transition-all group relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1D1714] border border-[#392820] flex items-center justify-center text-[#9BD49A] group-hover:border-[#FF7518]">
                <Sparkles className="w-4 h-4" />
              </div>
              <HangingLantern size="sm" withChain={false} />
            </div>
            <h3 className="font-display font-semibold text-sm text-[#F4EDE5] group-hover:text-[#FF9F43] transition-colors">
              09. The Revival Ritual
            </h3>
            <p className="text-xs text-[#776C64] mt-1 leading-relaxed">
              {repo
                ? `${repo.analysis.revivalPlan.length} phased steps to resurrect this abandoned repository.`
                : 'Actionable step-by-step roadmap from darkness to warm lantern light with progress tracking.'}
            </p>
            <div className="mt-3 flex items-center text-[11px] font-mono text-[#FF7518]">
              <span>Follow Ritual</span>
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
