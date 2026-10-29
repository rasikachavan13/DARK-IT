import React, { useState } from 'react';
import { SummonedRepository, BugItem } from '../../types/index.js';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { GhostCompanion } from '../illustrations/GhostCompanion.js';
import { HangingLantern } from '../illustrations/HangingLantern.js';
import { Tombstone } from '../illustrations/Tombstone.js';
import { Bug, Sparkles, Filter, CheckCircle2, ShieldCheck, Flame, ArrowRight, ExternalLink } from 'lucide-react';

interface BugCemeteryProps {
  repo: SummonedRepository | null;
  onExorciseBug: (bugId: string) => void;
  onOpenSummon: () => void;
}

const SEVERITY_CONFIG = {
  Curse: { label: 'CURSE', color: 'text-[#FF5B57]', bg: 'bg-[#FF5B57]/10', border: 'border-[#FF5B57]/30' },
  Specter: { label: 'SPECTER', color: 'text-[#FF7518]', bg: 'bg-[#FF7518]/10', border: 'border-[#FF7518]/30' },
  Poltergeist: { label: 'POLTERGEIST', color: 'text-[#FFC15A]', bg: 'bg-[#FFC15A]/10', border: 'border-[#FFC15A]/30' },
  Wisp: { label: 'WISP', color: 'text-[#B4A69A]', bg: 'bg-[#B4A69A]/10', border: 'border-[#B4A69A]/30' },
};

export const BugCemetery: React.FC<BugCemeteryProps> = ({
  repo,
  onExorciseBug,
  onOpenSummon,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [exorcisingId, setExorcisingId] = useState<string | null>(null);

  if (!repo || !repo.analysis.bugs || repo.analysis.bugs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <Tombstone title="EMPTY" subtitle="Quiet Crypt" severity="Wisp" withPumpkin={true} />
          <div className="animate-ghost-float">
            <GhostCompanion variant="idle" size="lg" />
          </div>
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="font-display font-bold text-2xl text-[#F4EDE5]">
            No bugs in this graveyard. Yet.
          </h2>
          <p className="text-sm text-[#776C64]">
            Summon a repository and investigate its codebase to uncover what needs attention.
          </p>
        </div>

        <button
          onClick={onOpenSummon}
          className="px-6 py-3 rounded-xl bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_16px_rgba(255,117,24,0.3)] inline-flex items-center gap-2"
        >
          <JackOLantern expression="mischievous" size="xs" />
          <span>INVESTIGATE A REPOSITORY</span>
        </button>
      </div>
    );
  }

  const bugs = repo.analysis.bugs;
  const filteredBugs = bugs.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'exorcised') return b.status === 'exorcised';
    if (filter === 'active') return b.status === 'active';
    return b.severity.toLowerCase() === filter.toLowerCase();
  });

  const activeCount = bugs.filter((b) => b.status === 'active').length;
  const exorcisedCount = bugs.filter((b) => b.status === 'exorcised').length;

  const handleExorcise = (id: string) => {
    setExorcisingId(id);
    setTimeout(() => {
      onExorciseBug(id);
      setExorcisingId(null);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Cemetery Atmospheric Banner */}
      <div className="p-6 rounded-2xl bg-[#15110F] border border-[#392820] relative overflow-hidden">
        {/* Subtle background mist gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A]/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-2 right-8 hidden md:block">
          <HangingLantern size="sm" chainHeight={25} />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="animate-ghost-float">
              <GhostCompanion variant="bugnet" size="lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF5B57] bg-[#FF5B57]/10 px-2 py-0.5 rounded border border-[#FF5B57]/30">
                  NECROPOLIS WARD
                </span>
                <span className="text-xs text-[#776C64]">·</span>
                <span className="text-xs font-mono text-[#776C64]">{repo.meta.fullName}</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F4EDE5] mt-1">
                THE BUG CEMETERY
              </h1>
              <p className="text-xs sm:text-sm text-[#B4A69A]">
                Every unresolved bug has a story. Give it a proper investigation and exorcise the curse.
              </p>
            </div>
          </div>

          {/* Counts overview */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-[#1D1714] border border-[#392820] text-center">
              <span className="block text-base font-bold font-mono text-[#FF5B57]">{activeCount}</span>
              <span className="text-[10px] font-mono text-[#776C64] uppercase">Haunting</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#1D1714] border border-[#392820] text-center">
              <span className="block text-base font-bold font-mono text-[#9BD49A]">{exorcisedCount}</span>
              <span className="text-[10px] font-mono text-[#776C64] uppercase">Exorcised</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#392820]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[#776C64] font-mono mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {['all', 'active', 'curse', 'specter', 'poltergeist', 'wisp', 'exorcised'].map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[#FF7518] text-[#0D0B0A] font-bold shadow-[0_0_10px_rgba(255,117,24,0.3)]'
                    : 'bg-[#15110F] text-[#B4A69A] hover:text-[#F4EDE5] hover:bg-[#1D1714] border border-[#392820]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-[#776C64] font-mono">
          Showing {filteredBugs.length} of {bugs.length} findings
        </span>
      </div>

      {/* Bug Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBugs.map((bug) => {
          const conf = SEVERITY_CONFIG[bug.severity] || SEVERITY_CONFIG.Specter;
          const isExorcised = bug.status === 'exorcised';
          const isProcessing = exorcisingId === bug.id;

          return (
            <div
              key={bug.id}
              className={`p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isExorcised
                  ? 'bg-[#131713] border-[#9BD49A]/30 opacity-80'
                  : 'bg-[#15110F] border-[#392820] hover:border-[#FF7518]/50 shadow-[0_8px_24px_rgba(0,0,0,0.5)]'
              }`}
            >
              {/* Corner pumpkin accent */}
              <div className="absolute top-4 right-4 opacity-70">
                <JackOLantern expression={isExorcised ? 'victorious' : 'mischievous'} size="xs" />
              </div>

              <div className="space-y-4">
                {/* Header: Severity Badge & Title */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${conf.bg} ${conf.color} border ${conf.border}`}
                    >
                      {conf.label}
                    </span>
                    <span className="text-[11px] font-mono text-[#776C64]">
                      Source: {bug.source}
                    </span>
                    {isExorcised && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#9BD49A]/10 text-[#9BD49A] border border-[#9BD49A]/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Purified (+25 XP)</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-base text-[#F4EDE5] leading-snug">
                    {bug.title}
                  </h3>
                </div>

                <p className="text-xs text-[#B4A69A] leading-relaxed">
                  {bug.description}
                </p>

                {/* Affected File & Evidence */}
                <div className="p-3 rounded-xl bg-[#110F0E] border border-[#392820] space-y-2 text-xs font-mono">
                  {bug.affectedFile && (
                    <div className="flex items-start gap-2">
                      <span className="text-[#776C64] shrink-0">Affected:</span>
                      <span className="text-[#FF9F43] truncate">{bug.affectedFile}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-[11px] text-[#B4A69A]">
                    <span className="text-[#776C64] shrink-0">Evidence:</span>
                    <span className="leading-relaxed">{bug.evidence}</span>
                  </div>
                </div>

                {/* Suggested Exorcism Step */}
                <div className="p-3 rounded-xl bg-[#1A1412] border border-[#392820]/80 text-xs">
                  <div className="text-[10px] font-mono uppercase text-[#FFC15A] flex items-center gap-1 mb-1">
                    <Flame className="w-3 h-3" />
                    <span>Exorcism Ritual</span>
                  </div>
                  <p className="text-[#F4EDE5] text-xs leading-relaxed">
                    {bug.nextStep}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-[#392820]/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#776C64]">
                  {isExorcised ? 'Crypt Sanctified' : 'Awaiting developer ritual'}
                </span>

                {!isExorcised ? (
                  <button
                    onClick={() => handleExorcise(bug.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-lg bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,117,24,0.3)] disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Exorcising...' : 'Exorcise Bug (+25 XP)'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#9BD49A]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Specter Banished</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
