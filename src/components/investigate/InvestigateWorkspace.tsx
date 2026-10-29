import React, { useState } from 'react';
import { SummonedRepository, FileItem } from '../../types/index.js';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { GhostCompanion } from '../illustrations/GhostCompanion.js';
import { HangingLantern } from '../illustrations/HangingLantern.js';
import {
  ExternalLink,
  GitBranch,
  Star,
  GitFork,
  AlertCircle,
  FileCode,
  Folder,
  Flame,
  Copy,
  Check,
  RefreshCw,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface InvestigateWorkspaceProps {
  repo: SummonedRepository | null;
  onReanalyze: () => void;
  isReanalyzing: boolean;
  onOpenSummon: () => void;
}

export const InvestigateWorkspace: React.FC<InvestigateWorkspaceProps> = ({
  repo,
  onReanalyze,
  isReanalyzing,
  onOpenSummon,
}) => {
  const [copiedRoast, setCopiedRoast] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  if (!repo) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="inline-block animate-ghost-float">
          <GhostCompanion variant="detective" size="lg" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl text-[#F4EDE5]">
            No Repository Summoned to the Sanctum
          </h2>
          <p className="text-sm text-[#776C64] max-w-md mx-auto">
            Summon a public GitHub repository to examine its file tree, commit echoes, languages, and unlock the Roast Chamber.
          </p>
        </div>
        <button
          onClick={onOpenSummon}
          className="px-6 py-3 rounded-xl bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_16px_rgba(255,117,24,0.3)] inline-flex items-center gap-2"
        >
          <JackOLantern expression="mischievous" size="xs" />
          <span>Summon a Repository</span>
        </button>
      </div>
    );
  }

  const { meta, languages, commits, files, analysis } = repo;

  // Language percentage calculations
  const totalLangBytes = Object.values(languages).reduce((a, b) => a + b, 0) || 1;
  const langList = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / totalLangBytes) * 100 * 10) / 10,
    }));

  const handleCopyRoast = () => {
    const textToCopy = `DARKIT CODEBASE ROAST — ${meta.fullName}\n\n${analysis.roast.humor}\n\nTechnical Observations:\n${analysis.roast.technical.map((t) => `- ${t}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedRoast(true);
    setTimeout(() => setCopiedRoast(false), 2500);
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Repository Header Identity Panel */}
      <div className="p-6 rounded-2xl bg-[#15110F] border border-[#392820] relative overflow-hidden">
        {/* Subtle lantern hanging on right */}
        <div className="absolute top-3 right-6 hidden md:block">
          <HangingLantern size="sm" chainHeight={20} />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="animate-ghost-float hidden sm:block">
              <GhostCompanion variant="detective" size="md" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F4EDE5]">
                  {meta.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#FF7518]/10 text-[#FF9F43] border border-[#FF7518]/30">
                  {analysis.hauntLevel}
                </span>
                {meta.isArchived && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#FF5B57]/10 text-[#FF5B57] border border-[#FF5B57]/30">
                    Archived Crypt
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#B4A69A] max-w-3xl leading-relaxed">
                {meta.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-[#776C64]">
                <span className="flex items-center gap-1 text-[#F4EDE5]">
                  <GitBranch className="w-3.5 h-3.5 text-[#FF7518]" />
                  <span>{meta.defaultBranch}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#FFC15A]" />
                  <span className="text-[#F4EDE5]">{meta.stars.toLocaleString()}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 text-[#B4A69A]" />
                  <span className="text-[#F4EDE5]">{meta.forks.toLocaleString()}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-[#FFC15A]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{meta.openIssues} issues</span>
                </span>
                <span>·</span>
                <span>License: {meta.license || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
            <button
              onClick={onReanalyze}
              disabled={isReanalyzing}
              className="px-3.5 py-2 rounded-lg bg-[#1D1714] hover:bg-[#261E1A] text-xs font-mono text-[#F4EDE5] border border-[#392820] hover:border-[#FF7518]/40 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FF9F43] ${isReanalyzing ? 'animate-spin' : ''}`} />
              <span>{isReanalyzing ? 'Rescanning...' : 'Re-examine'}</span>
            </button>

            <a
              href={meta.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-[0_0_12px_rgba(255,117,24,0.3)]"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Overview & Languages & Roast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Roast Chamber & Commit Echoes */}
        <div className="lg:col-span-8 space-y-6">
          {/* THE ROAST CHAMBER */}
          <div className="p-6 rounded-2xl bg-[#110F0E] border border-[#FF7518]/40 shadow-[0_0_30px_rgba(255,117,24,0.1)] relative overflow-hidden">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#1D1714] border border-[#FF7518]/30">
                  <Flame className="w-5 h-5 text-[#FF7518]" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-[#F4EDE5]">
                    THE ROAST CHAMBER
                  </h2>
                  <p className="text-xs text-[#776C64]">
                    Every codebase has secrets. Let's see what yours is hiding.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyRoast}
                className="px-3 py-1.5 rounded-lg bg-[#1D1714] hover:bg-[#261E1A] text-xs font-mono text-[#B4A69A] hover:text-[#F4EDE5] border border-[#392820] flex items-center gap-1.5 transition-colors"
              >
                {copiedRoast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#9BD49A]" />
                    <span className="text-[#9BD49A]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Share Roast</span>
                  </>
                )}
              </button>
            </div>

            {/* Ghost Humorous Quote */}
            <div className="p-4 rounded-xl bg-[#181311] border-l-2 border-[#FF7518] text-sm text-[#F4EDE5] italic leading-relaxed relative">
              <span className="text-2xl text-[#FF7518] font-serif leading-none block -mb-2">“</span>
              {analysis.roast.humor}
              <span className="text-2xl text-[#FF7518] font-serif leading-none text-right block -mt-2">”</span>
            </div>

            {/* Technical Observations */}
            <div className="mt-5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF9F43] block">
                Constructive Technical Observations
              </span>
              <div className="space-y-2">
                {analysis.roast.technical.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#15110F] border border-[#392820] flex items-start gap-2.5 text-xs text-[#B4A69A]"
                  >
                    <span className="text-[#FF7518] font-mono font-bold mt-0.5">0{idx + 1}.</span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Commit Echoes (Recent Git Activity) */}
          <div className="p-6 rounded-2xl bg-[#15110F] border border-[#392820] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFC15A]" />
                <h3 className="font-display font-bold text-base text-[#F4EDE5]">
                  Recent Commit Echoes
                </h3>
              </div>
              <span className="text-xs text-[#776C64] font-mono">
                {commits.length} recorded commits
              </span>
            </div>

            <div className="space-y-2.5">
              {commits.map((c, i) => (
                <div
                  key={c.sha + i}
                  className="p-3 rounded-xl bg-[#1D1714] border border-[#392820] flex items-start justify-between gap-3 hover:border-[#FF7518]/30 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-[#F4EDE5] font-medium leading-relaxed">
                      {c.message}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#776C64]">
                      <span className="text-[#B4A69A]">{c.author}</span>
                      <span>·</span>
                      <span>{new Date(c.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-[#110F0E] border border-[#392820] text-[10px] font-mono text-[#FF9F43] shrink-0">
                    {c.sha}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Languages, File Tree Explorer, Health */}
        <div className="lg:col-span-4 space-y-6">
          {/* Repository Health / Haunt Verdict */}
          <div className="p-5 rounded-2xl bg-[#15110F] border border-[#392820] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#FF9F43] uppercase tracking-wider">
                Spiritual Diagnostic
              </span>
              <JackOLantern expression="suspicious" size="xs" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-3xl text-[#FF7518]">
                {analysis.hauntScore}
              </span>
              <span className="text-xs text-[#776C64] font-mono">/ 100 Haunt Score</span>
            </div>

            <p className="text-xs text-[#B4A69A] leading-relaxed">
              {analysis.ghostVerdict}
            </p>
          </div>

          {/* Languages Breakdown */}
          <div className="p-5 rounded-2xl bg-[#15110F] border border-[#392820] space-y-3">
            <h3 className="font-display font-bold text-sm text-[#F4EDE5]">
              Languages Detected
            </h3>

            {/* Language Segmented Bar */}
            <div className="h-2 w-full rounded-full bg-[#110F0E] overflow-hidden flex border border-[#392820]">
              {langList.map((lang, idx) => {
                const colors = ['#FF7518', '#FF9F43', '#FFC15A', '#A94C19', '#776C64'];
                return (
                  <div
                    key={lang.name}
                    title={`${lang.name}: ${lang.percentage}%`}
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: colors[idx % colors.length],
                    }}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 pt-1">
              {langList.map((lang, idx) => {
                const colors = ['bg-[#FF7518]', 'bg-[#FF9F43]', 'bg-[#FFC15A]', 'bg-[#A94C19]', 'bg-[#776C64]'];
                return (
                  <div key={lang.name} className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                      <span className="text-[#B4A69A]">{lang.name}</span>
                    </div>
                    <span className="text-[#F4EDE5]">{lang.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Root File Tree Explorer */}
          <div className="p-5 rounded-2xl bg-[#15110F] border border-[#392820] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-[#F4EDE5]">
                Sanctum File Tree
              </h3>
              <span className="text-[10px] font-mono text-[#776C64]">{files.length} items</span>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {files.map((file) => (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
                    selectedFile?.path === file.path
                      ? 'bg-[#FF7518]/15 text-[#FF9F43] border border-[#FF7518]/30'
                      : 'hover:bg-[#1D1714] text-[#B4A69A]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {file.type === 'dir' ? (
                      <Folder className="w-3.5 h-3.5 text-[#FFC15A] shrink-0" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-[#776C64] shrink-0" />
                    )}
                    <span className="truncate">{file.path}</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedFile && (
              <div className="mt-3 p-3 rounded-lg bg-[#110F0E] border border-[#392820] text-xs space-y-1">
                <div className="text-[10px] font-mono text-[#776C64] uppercase">Selected Artifact</div>
                <div className="font-mono text-[#FF9F43] truncate">{selectedFile.path}</div>
                <div className="text-[11px] text-[#B4A69A]">
                  Type: {selectedFile.type} {selectedFile.size ? `· ${selectedFile.size} bytes` : ''}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
