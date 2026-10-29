import React, { useState } from 'react';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { GhostCompanion } from '../illustrations/GhostCompanion.js';
import { HangingLantern } from '../illustrations/HangingLantern.js';
import { Terminal, Search, Ghost, Bug, ShieldAlert, Sparkles, BookOpen, Compass, ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onSummon: (repoUrl: string) => void;
  onExploreLab: () => void;
  onOpenChat: () => void;
  isSummoning: boolean;
}

const PRESET_REPOS = [
  { name: 'expressjs/express', desc: 'Fast Node web framework' },
  { name: 'facebook/react', desc: 'UI component library' },
  { name: 'pallets/flask', desc: 'Python micro-framework' },
  { name: 'octocat/Spoon-Knife', desc: 'Classic abandoned fork' },
];

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSummon,
  onExploreLab,
  onOpenChat,
  isSummoning,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSummon(inputVal.trim());
    }
  };

  return (
    <div className="relative overflow-hidden py-10 lg:py-16">
      {/* Background Decorative Glow */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#FF7518]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FFC15A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Summon Input */}
          <div className="lg:col-span-7 space-y-6">
            {/* Terminal prompt kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1D1714] border border-[#392820] text-xs font-mono text-[#FF9F43]">
              <span className="text-[#FF7518]">$</span>
              <span>./exorcise --repo</span>
              <span className="w-2 h-3.5 bg-[#FF7518] inline-block animate-pulse" />
            </div>

            {/* Eyebrow */}
            <div className="text-xs font-mono tracking-widest text-[#B4A69A] uppercase flex items-center gap-2">
              <span className="text-[#FF7518]">✦</span>
              <span>OPEN-SOURCE AI · REPOSITORY GHOST SHELL</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#F4EDE5] leading-[1.08] text-balance">
              Your code isn't dead.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7518] via-[#FF9F43] to-[#FFC15A]">
                It's just haunted.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-[#B4A69A] max-w-2xl leading-relaxed">
              A command-line séance for forgotten code. Trace the evidence, interrogate the commit ghosts, and bring abandoned repositories back from the dead.
            </p>

            {/* Fast Summoning Input Bar */}
            <form onSubmit={handleSubmit} className="pt-2">
              <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 bg-[#15110F] border border-[#392820] focus-within:border-[#FF7518] rounded-xl shadow-[0_0_24px_rgba(255,117,24,0.12)] transition-all">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="w-4 h-4 text-[#776C64] mr-2 shrink-0" />
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    disabled={isSummoning}
                    className="w-full bg-transparent text-sm font-mono text-[#F4EDE5] placeholder-[#776C64] focus:outline-none"
                  />
                  <div className="absolute right-2 hidden sm:block">
                    <JackOLantern expression="mischievous" size="xs" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSummoning}
                  className="px-6 py-3 rounded-lg bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_16px_rgba(255,117,24,0.35)] flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSummoning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#0D0B0A] border-t-transparent rounded-full animate-spin" />
                      <span>SUMMONING...</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-4 h-4" />
                      <span>SUMMON A REPOSITORY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Quick Summons */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#776C64] font-mono text-[11px]">Quick summon:</span>
                {PRESET_REPOS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setInputVal(preset.name);
                      onSummon(preset.name);
                    }}
                    className="px-2.5 py-1 rounded bg-[#1D1714] hover:bg-[#261D19] border border-[#392820] hover:border-[#FF7518]/50 text-[#B4A69A] hover:text-[#FF9F43] font-mono text-[11px] transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </form>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenChat}
                className="px-5 py-2.5 rounded-lg bg-[#1D1714] hover:bg-[#261E1A] text-[#FF9F43] border border-[#FF7518]/50 hover:border-[#FF7518] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-[0_0_12px_rgba(255,117,24,0.2)]"
              >
                <Sparkles className="w-4 h-4 text-[#FF7518]" />
                <span>INTERROGATE GEMINI GHOST</span>
              </button>

              <button
                onClick={onExploreLab}
                className="px-5 py-2.5 rounded-lg bg-[#15110F] hover:bg-[#1D1714] text-[#F4EDE5] border border-[#392820] hover:border-[#FF7518]/40 font-medium text-xs transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#B4A69A]" />
                <span>EXPLORE THE HAUNTED LAB</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#776C64]" />
              </button>
            </div>
          </div>

          {/* Right Column: Illustrated Haunted Terminal Scene */}
          <div className="lg:col-span-5 relative">
            {/* Hanging Lanterns Top Border */}
            <div className="absolute -top-12 left-6 z-20">
              <HangingLantern size="sm" chainHeight={30} />
            </div>
            <div className="absolute -top-14 right-10 z-20">
              <HangingLantern size="md" chainHeight={40} />
            </div>

            {/* Main Terminal Shell Card */}
            <div className="relative rounded-2xl bg-[#110F0E] border border-[#392820] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Terminal Window Header */}
              <div className="px-4 py-3 bg-[#15110F] border-b border-[#392820] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B57]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFC15A]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9BD49A]/80" />
                  <span className="ml-2 text-[11px] font-mono text-[#776C64]">ghost-shell · tty-seance</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#FF9F43]">
                  <JackOLantern expression="excited" size="xs" />
                  <span>DARKIT-v2</span>
                </div>
              </div>

              {/* Terminal Body Content */}
              <div className="p-5 font-mono text-xs space-y-3 bg-[#0D0B0A]/95 text-[#F4EDE5] min-h-[300px]">
                <div className="text-[#776C64] leading-relaxed">
                  # DARKIT REPOSITORY GHOST SHELL ONLINE
                  <br />
                  # Connecting to spiritual AST indexer...
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[#9BD49A] flex items-center gap-2">
                    <span className="text-[#FF7518]">[INIT]</span>
                    <span>Ghost shell online...</span>
                  </div>
                  <div className="text-[#B4A69A] flex items-center gap-2">
                    <span className="text-[#FF7518]">[SCAN]</span>
                    <span>Repository signature detected.</span>
                  </div>
                  <div className="text-[#FFC15A] flex items-center gap-2">
                    <span className="text-[#FF7518]">[WARN]</span>
                    <span>Unresolved bugs are roaming free.</span>
                  </div>
                  <div className="text-[#FF9F43] flex items-center gap-2">
                    <span className="text-[#FF7518]">[READY]</span>
                    <span>Awaiting repository URL...</span>
                    <span className="inline-block w-2 h-3.5 bg-[#FF9F43] animate-pulse" />
                  </div>
                </div>

                {/* Illustrated Mascots Inside/Around the Terminal */}
                <div className="pt-6 pb-2 flex items-end justify-between border-t border-[#392820]/60 mt-4">
                  {/* Left: Ghost Detective with Magnifying Glass */}
                  <div className="animate-ghost-float text-center">
                    <GhostCompanion variant="detective" size="md" />
                    <span className="block text-[10px] text-[#776C64] mt-1">Investigator</span>
                  </div>

                  {/* Center: Signature Jack-o'-Lantern */}
                  <div className="text-center group">
                    <JackOLantern expression="victorious" size="lg" glowing={true} />
                    <span className="block text-[10px] text-[#FF9F43] mt-1 font-bold">Hearth Core</span>
                  </div>

                  {/* Right: Bug Net Ghost */}
                  <div className="animate-ghost-float-alt text-center">
                    <GhostCompanion variant="bugnet" size="md" />
                    <span className="block text-[10px] text-[#776C64] mt-1">Exorcist</span>
                  </div>
                </div>

                <div className="text-[10px] text-[#776C64] text-center italic pt-1 border-t border-[#392820]/40">
                  Decorative demonstration output · Real scan commences upon summon
                </div>
              </div>
            </div>

            {/* Ghost peeking over the corner */}
            <div className="absolute -bottom-6 -right-4 z-20 animate-ghost-float">
              <GhostCompanion variant="waving" size="sm" />
            </div>
          </div>
        </div>

        {/* Feature Strip Below Hero */}
        <div className="mt-16 pt-8 border-t border-[#392820]/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#FF7518]/10 border border-[#FF7518]/30 flex items-center justify-center text-[#FF9F43] mb-3">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="font-display font-semibold text-sm text-[#F4EDE5] mb-1">
                Repository Intelligence
              </h3>
              <p className="text-xs text-[#776C64] leading-relaxed">
                Live GitHub API inspection of commits, file trees, dependencies, and decay metrics.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#FF7518]/10 border border-[#FF7518]/30 flex items-center justify-center text-[#FF9F43] mb-3">
                <Ghost className="w-4 h-4" />
              </div>
              <h3 className="font-display font-semibold text-sm text-[#F4EDE5] mb-1">
                Ghost Q&A Séance
              </h3>
              <p className="text-xs text-[#776C64] leading-relaxed">
                Interrogate commit specters about architecture, entrypoints, and ancient code quirks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#FF7518]/10 border border-[#FF7518]/30 flex items-center justify-center text-[#FF9F43] mb-3">
                <Bug className="w-4 h-4" />
              </div>
              <h3 className="font-display font-semibold text-sm text-[#F4EDE5] mb-1">
                Bug Cemetery
              </h3>
              <p className="text-xs text-[#776C64] leading-relaxed">
                Graveyard tracking of issues, bitrot, and runtime curses waiting for exorcism.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#FF7518]/10 border border-[#FF7518]/30 flex items-center justify-center text-[#FF9F43] mb-3">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="font-display font-semibold text-sm text-[#F4EDE5] mb-1">
                Evidence Wall
              </h3>
              <p className="text-xs text-[#776C64] leading-relaxed">
                Detective investigation board with code snippets, source clues, and citations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#15110F] border border-[#392820] hover:border-[#FF7518]/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#FF7518]/10 border border-[#FF7518]/30 flex items-center justify-center text-[#FF9F43] mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-display font-semibold text-sm text-[#F4EDE5] mb-1">
                Revival Ritual
              </h3>
              <p className="text-xs text-[#776C64] leading-relaxed">
                Step-by-step phased revival checklist to bring the dead codebase back to light.
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Steps Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-[#15110F]/80 border border-[#392820]">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="font-display font-bold text-lg text-[#F4EDE5]">
              The 4-Step Exorcism Workflow
            </h2>
            <p className="text-xs text-[#776C64]">
              How developers resuscitate abandoned code with DARKIT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#1D1714] border border-[#FF7518]/40 text-[#FF9F43] font-mono text-xs flex items-center justify-center font-bold">
                01
              </div>
              <h4 className="font-display font-semibold text-xs text-[#F4EDE5]">Summon the Repo</h4>
              <p className="text-[11px] text-[#776C64]">
                Enter any public GitHub URL to awaken the spiritual parser.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#1D1714] border border-[#FF7518]/40 text-[#FF9F43] font-mono text-xs flex items-center justify-center font-bold">
                02
              </div>
              <h4 className="font-display font-semibold text-xs text-[#F4EDE5]">Interrogate Ghosts</h4>
              <p className="text-[11px] text-[#776C64]">
                Ask the spirits how the architecture ticks and read the codebase roast.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#1D1714] border border-[#FF7518]/40 text-[#FF9F43] font-mono text-xs flex items-center justify-center font-bold">
                03
              </div>
              <h4 className="font-display font-semibold text-xs text-[#F4EDE5]">Audit the Evidence</h4>
              <p className="text-[11px] text-[#776C64]">
                Trace clues on the Evidence Wall and catalog bugs in the cemetery.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#1D1714] border border-[#FF7518]/40 text-[#FF9F43] font-mono text-xs flex items-center justify-center font-bold">
                04
              </div>
              <h4 className="font-display font-semibold text-xs text-[#F4EDE5]">Execute the Revival</h4>
              <p className="text-[11px] text-[#776C64]">
                Follow the 4-phase ritual, earn XP, and evolve your ghost guardian.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
