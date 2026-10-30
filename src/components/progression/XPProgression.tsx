import React from 'react';
import { GhostCompanionId, GhostEvolution, Achievement } from '../../types/index.js';
import { GhostCompanion, GhostVariant } from '../illustrations/GhostCompanion.js';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { HangingLantern } from '../illustrations/HangingLantern.js';
import {
  Trophy,
  Sparkles,
  Lock,
  CheckCircle2,
  Check,
  Star,
  Award,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface XPProgressionProps {
  userXP: number;
  userLevel: number;
  activeCompanion: GhostCompanionId;
  onSelectCompanion: (id: GhostCompanionId) => void;
  achievements: Achievement[];
}

const EVOLUTIONS: GhostEvolution[] = [
  {
    id: 'lost-spirit',
    name: 'Lost Spirit',
    title: 'The Wandering Novice',
    minLevel: 1,
    description: 'A shy wisp that just discovered the git log. Observes from the corner of the terminal.',
    badge: 'STAGE I',
    unlocked: true,
  },
  {
    id: 'curious-phantom',
    name: 'Curious Phantom',
    title: 'The Lantern Bearer',
    minLevel: 2,
    description: 'Carries a warm amber lantern to illuminate stale branches and forgotten merge commits.',
    badge: 'STAGE II',
    unlocked: false,
  },
  {
    id: 'code-detective',
    name: 'Code Detective',
    title: 'The Master Sleuth',
    minLevel: 3,
    description: 'Wields a magnifying glass to sniff out memory leaks, circular dependencies, and ghost bugs.',
    badge: 'STAGE III',
    unlocked: false,
  },
  {
    id: 'bug-exorcist',
    name: 'Bug Exorcist',
    title: 'The Graveyard Purifier',
    minLevel: 4,
    description: 'Armed with a spectral bug-catching net. Banishes severe curses and closes zombie issues.',
    badge: 'STAGE IV',
    unlocked: false,
  },
  {
    id: 'repository-guardian',
    name: 'Repository Guardian',
    title: 'The Eternal Sentinel',
    minLevel: 5,
    description: 'An enlightened spirit bonded with a sacred Jack-o’-Lantern. Keeps codebases alive forever.',
    badge: 'STAGE V',
    unlocked: false,
  },
];

const COMPANION_TO_VARIANT: Record<GhostCompanionId, GhostVariant> = {
  'lost-spirit': 'idle',
  'curious-phantom': 'lantern',
  'code-detective': 'detective',
  'bug-exorcist': 'bugnet',
  'repository-guardian': 'excited',
};

export const XPProgression: React.FC<XPProgressionProps> = ({
  userXP,
  userLevel,
  activeCompanion,
  onSelectCompanion,
  achievements,
}) => {
  const currentLevelBaseXP = (userLevel - 1) * 200;
  const nextLevelXP = userLevel * 200;
  const xpNeeded = Math.max(0, nextLevelXP - userXP);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((userXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100))
  );

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#15110F] border border-[#392820] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="animate-ghost-float">
            <GhostCompanion variant={COMPANION_TO_VARIANT[activeCompanion] || 'idle'} size="lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF9F43] bg-[#FF7518]/10 px-2 py-0.5 rounded border border-[#FF7518]/30">
                SPIRITUAL SANCTUARY
              </span>
              <span className="text-xs text-[#776C64]">·</span>
              <span className="text-xs font-mono text-[#776C64]">Level {userLevel} Guardian</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F4EDE5] mt-1">
              GHOST EVOLUTION & ACHIEVEMENTS
            </h1>
            <p className="text-xs sm:text-sm text-[#B4A69A]">
              Turn developer exploration into an immersive journey. Level up and evolve your companion.
            </p>
          </div>
        </div>

        {/* Level Stats Pill */}
        <div className="px-5 py-3 rounded-2xl bg-[#1D1714] border border-[#FF7518]/30 text-center font-mono shrink-0">
          <div className="text-xs text-[#776C64] uppercase">Current Power</div>
          <div className="text-2xl font-extrabold text-[#FF9F43]">LVL {userLevel}</div>
          <div className="text-[11px] text-[#B4A69A]">{userXP} Total XP</div>
        </div>
      </div>

      {/* XP & Energy Meter Card */}
      <div className="p-6 rounded-2xl bg-[#110F0E] border border-[#392820] shadow-[0_12px_36px_rgba(0,0,0,0.5)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF7518]" />
            <h2 className="font-display font-bold text-base text-[#F4EDE5]">
              Spectral Energy Meter
            </h2>
          </div>
          <span className="text-xs font-mono text-[#B4A69A]">
            {xpNeeded > 0 ? `${xpNeeded} XP to Level ${userLevel + 1}` : 'Maximum level achieved!'}
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-[#15110F] overflow-hidden border border-[#392820] p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#FF7518] via-[#FF9F43] to-[#FFC15A] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(255,117,24,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[#776C64]">
          <span>Level {userLevel} ({currentLevelBaseXP} XP)</span>
          <span>Level {userLevel + 1} ({nextLevelXP} XP)</span>
        </div>
      </div>

      {/* Ghost Evolution Tree */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-[#F4EDE5]">
              Companion Evolution Stages
            </h2>
            <p className="text-xs text-[#776C64]">
              Click any unlocked companion to set them as your active terminal mascot
            </p>
          </div>
          <span className="text-xs font-mono text-[#FF9F43]">
            Active: {EVOLUTIONS.find((e) => e.id === activeCompanion)?.name || 'Lost Spirit'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {EVOLUTIONS.map((evo) => {
            const isUnlocked = userLevel >= evo.minLevel;
            const isSelected = activeCompanion === evo.id;
            const variant = COMPANION_TO_VARIANT[evo.id] || 'idle';

            return (
              <div
                key={evo.id}
                onClick={() => {
                  if (isUnlocked) onSelectCompanion(evo.id);
                }}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between text-center relative ${
                  isSelected
                    ? 'bg-[#1D1714] border-[#FF7518] shadow-[0_0_20px_rgba(255,117,24,0.3)] ring-1 ring-[#FF7518]'
                    : isUnlocked
                    ? 'bg-[#15110F] border-[#392820] hover:border-[#FF7518]/50 cursor-pointer hover:bg-[#1A1412]'
                    : 'bg-[#110F0E] border-[#261E1A] opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Stage Badge */}
                <span className="text-[10px] font-mono text-[#776C64] block mb-2">
                  {evo.badge}
                </span>

                {/* Ghost Mascot Artwork */}
                <div className="my-2 h-20 flex items-center justify-center">
                  <GhostCompanion variant={variant} size="md" glow={isUnlocked} />
                </div>

                <div className="space-y-1 mt-2">
                  <h3 className="font-display font-bold text-sm text-[#F4EDE5]">
                    {evo.name}
                  </h3>
                  <div className="text-[10px] font-mono text-[#FF9F43] truncate">
                    {evo.title}
                  </div>
                  <p className="text-[11px] text-[#776C64] leading-relaxed line-clamp-3 mt-1">
                    {evo.description}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 pt-3 border-t border-[#392820]/60">
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#FF9F43] font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Equipped</span>
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[11px] font-mono text-[#B4A69A] hover:text-[#FF7518]">
                      Click to Equip
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#776C64]">
                      <Lock className="w-3 h-3" />
                      <span>Unlocks at LVL {evo.minLevel}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collectible Achievements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#F4EDE5] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FFC15A]" />
            <span>Developer Achievements</span>
          </h2>
          <span className="text-xs font-mono text-[#776C64]">
            {achievements.filter((a) => a.unlocked).length} of {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                ach.unlocked
                  ? 'bg-[#15110F] border-[#FFC15A]/40 shadow-[0_0_16px_rgba(255,193,90,0.1)]'
                  : 'bg-[#110F0E] border-[#2A1F1A] opacity-60'
              }`}
            >
              {/* Badge Icon / Pumpkin */}
              <div className="shrink-0">
                {ach.unlocked ? (
                  <JackOLantern expression="victorious" size="sm" />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-[#1D1714] border border-[#392820] flex items-center justify-center text-[#776C64]">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-sm text-[#F4EDE5]">
                    {ach.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-[#FFC15A]">
                    +{ach.rewardXP} XP
                  </span>
                </div>

                <p className="text-xs text-[#776C64] leading-relaxed">
                  {ach.description}
                </p>

                {/* Progress bar if multi-step */}
                <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-[#B4A69A]">
                  <div className="flex-1 h-1.5 rounded-full bg-[#1D1714] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${ach.unlocked ? 'bg-[#9BD49A]' : 'bg-[#FF7518]'}`}
                      style={{ width: `${Math.min(100, (ach.progress / ach.max) * 100)}%` }}
                    />
                  </div>
                  <span>
                    {ach.progress}/{ach.max}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
