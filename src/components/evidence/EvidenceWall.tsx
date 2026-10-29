import React, { useState } from 'react';
import { SummonedRepository, EvidenceItem } from '../../types/index.js';
import { GhostCompanion } from '../illustrations/GhostCompanion.js';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { HangingLantern } from '../illustrations/HangingLantern.js';
import {
  ShieldAlert,
  Copy,
  Check,
  FileText,
  HelpCircle,
  Lightbulb,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface EvidenceWallProps {
  repo: SummonedRepository | null;
  onOpenSummon: () => void;
}

const CATEGORY_COLORS: Record<string, { badge: string }> = {
  Architecture: { badge: 'text-[#FF9F43] bg-[#FF7518]/10 border-[#FF7518]/30' },
  Security: { badge: 'text-[#FF5B57] bg-[#FF5B57]/10 border-[#FF5B57]/30' },
  Decay: { badge: 'text-[#FFC15A] bg-[#FFC15A]/10 border-[#FFC15A]/30' },
  'Test Coverage': { badge: 'text-[#9BD49A] bg-[#9BD49A]/10 border-[#9BD49A]/30' },
  Dependencies: { badge: 'text-[#E8E2DC] bg-[#392820]/40 border-[#392820]' },
};

export const EvidenceWall: React.FC<EvidenceWallProps> = ({
  repo,
  onOpenSummon,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!repo || !repo.analysis.evidence || repo.analysis.evidence.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="inline-block animate-ghost-float">
          <GhostCompanion variant="detective" size="lg" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="font-display font-bold text-2xl text-[#F4EDE5]">
            Every mystery starts with a clue.
          </h2>
          <p className="text-sm text-[#776C64]">
            Investigate a repository to pin source findings, code snippets, and architectural evidence onto your investigation wall.
          </p>
        </div>
        <button
          onClick={onOpenSummon}
          className="px-6 py-3 rounded-xl bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_16px_rgba(255,117,24,0.3)] inline-flex items-center gap-2"
        >
          <JackOLantern expression="suspicious" size="xs" />
          <span>INVESTIGATE A REPOSITORY</span>
        </button>
      </div>
    );
  }

  const evidence = repo.analysis.evidence;
  const filtered = evidence.filter((e) => {
    if (selectedCategory === 'all') return true;
    return e.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleCopyCitation = (item: EvidenceItem) => {
    const citation = `DARKIT EVIDENCE DOSSIER #${item.id}\nRepository: ${repo.meta.fullName}\nClue: ${item.title} (${item.category})\nFile: ${item.file}${item.line ? `:${item.line}` : ''}\nSnippet:\n${item.snippet}\n\nObservation: ${item.observation}\nMeaning: ${item.meaning}\nRecommendation: ${item.recommendation}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Evidence Wall Board Header */}
      <div className="p-6 rounded-2xl bg-[#15110F] border border-[#392820] relative overflow-hidden">
        {/* Hanging lanterns framing the detective room */}
        <div className="absolute top-2 left-6 hidden md:block">
          <HangingLantern size="sm" chainHeight={20} />
        </div>
        <div className="absolute top-2 right-6 hidden md:block">
          <HangingLantern size="sm" chainHeight={20} />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 md:px-12">
          <div className="flex items-center gap-4">
            <div className="animate-ghost-float">
              <GhostCompanion variant="detective" size="lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF9F43] bg-[#FF7518]/10 px-2 py-0.5 rounded border border-[#FF7518]/30">
                  CRIME SCENE DOSSIER
                </span>
                <span className="text-xs text-[#776C64]">·</span>
                <span className="text-xs font-mono text-[#776C64]">{repo.meta.fullName}</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F4EDE5] mt-1">
                THE EVIDENCE WALL
              </h1>
              <p className="text-xs sm:text-sm text-[#B4A69A]">
                No accusations without evidence. Follow every clue from git commits to source files.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <div className="px-3.5 py-2 rounded-xl bg-[#1D1714] border border-[#392820] text-center font-mono">
              <span className="block text-base font-bold text-[#FF9F43]">{evidence.length}</span>
              <span className="text-[10px] text-[#776C64] uppercase">Verified Clues</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#392820]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[#776C64] font-mono mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {['all', 'Architecture', 'Security', 'Decay', 'Test Coverage', 'Dependencies'].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  isActive
                    ? 'bg-[#FF7518] text-[#0D0B0A] font-bold shadow-[0_0_10px_rgba(255,117,24,0.3)]'
                    : 'bg-[#15110F] text-[#B4A69A] hover:text-[#F4EDE5] hover:bg-[#1D1714] border border-[#392820]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-[#776C64] font-mono">
          Showing {filtered.length} clues
        </span>
      </div>

      {/* Evidence Cards on Detective Slate Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((item, idx) => {
          const styleConf = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Architecture;

          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between space-y-4 relative"
            >
              {/* Pushpin at top center */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FF7518] border-2 border-[#110F0E] shadow-[0_0_8px_#FF7518]" />

              <div className="space-y-4 pt-1">
                {/* Header: Title, Category, File */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${styleConf.badge}`}>
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-[#776C64]">
                        Clue #{idx + 1}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-[#F4EDE5]">
                      {item.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopyCitation(item)}
                    className="p-2 rounded-lg bg-[#1D1714] hover:bg-[#261E1A] text-[#776C64] hover:text-[#FF9F43] border border-[#392820] transition-colors shrink-0"
                    title="Copy clue citation"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-[#9BD49A]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* File Reference & Code Snippet */}
                <div className="p-3.5 rounded-xl bg-[#0D0B0A] border border-[#392820] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#FF9F43]">
                    <div className="flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.file}</span>
                      {item.line && <span className="text-[#776C64]">:{item.line}</span>}
                    </div>
                  </div>

                  <pre className="text-xs font-mono text-[#E8E2DC] overflow-x-auto whitespace-pre-wrap bg-[#15110F] p-2 rounded border border-[#392820]/60">
                    <code>{item.snippet}</code>
                  </pre>
                </div>

                {/* 4 Distinct Analysis Pillars */}
                <div className="space-y-2.5 text-xs">
                  {/* 1. What was observed */}
                  <div className="p-3 rounded-xl bg-[#181311] border border-[#392820]/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#FF7518] font-bold block">
                      1. What was observed:
                    </span>
                    <p className="text-[#F4EDE5] leading-relaxed">
                      {item.observation}
                    </p>
                  </div>

                  {/* 2. What this observation means */}
                  <div className="p-3 rounded-xl bg-[#181311] border border-[#392820]/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#FFC15A] font-bold block">
                      2. What this means:
                    </span>
                    <p className="text-[#B4A69A] leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>

                  {/* 3. Recommended action */}
                  <div className="p-3 rounded-xl bg-[#1D1714] border border-[#FF7518]/30 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#9BD49A] font-bold flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-[#9BD49A]" />
                      <span>3. Recommended action:</span>
                    </span>
                    <p className="text-[#F4EDE5] leading-relaxed">
                      {item.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
