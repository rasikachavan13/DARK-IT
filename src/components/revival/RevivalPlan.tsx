import React, { useState } from 'react';
import { SummonedRepository, RevivalStep } from '../../types/index.js';
import { GhostCompanion } from '../illustrations/GhostCompanion.js';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { HangingLantern } from '../illustrations/HangingLantern.js';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Flame,
  ArrowRight,
  Shield,
  Layers,
  FileCode,
  Download,
} from 'lucide-react';

interface RevivalPlanProps {
  repo: SummonedRepository | null;
  onToggleStep: (stepId: string) => void;
  onOpenSummon: () => void;
}

const PRIORITY_BADGES = {
  Critical: 'text-[#FF5B57] bg-[#FF5B57]/10 border-[#FF5B57]/30',
  High: 'text-[#FF7518] bg-[#FF7518]/10 border-[#FF7518]/30',
  Medium: 'text-[#FFC15A] bg-[#FFC15A]/10 border-[#FFC15A]/30',
  Low: 'text-[#B4A69A] bg-[#B4A69A]/10 border-[#B4A69A]/30',
};

export const RevivalPlan: React.FC<RevivalPlanProps> = ({
  repo,
  onToggleStep,
  onOpenSummon,
}) => {
  const [copiedPlan, setCopiedPlan] = useState(false);

  if (!repo || !repo.analysis.revivalPlan || repo.analysis.revivalPlan.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="inline-block animate-ghost-float">
          <GhostCompanion variant="wrench" size="lg" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="font-display font-bold text-2xl text-[#F4EDE5]">
            No Revival Ritual Scheduled
          </h2>
          <p className="text-sm text-[#776C64]">
            Summon an abandoned repository to generate an automated, phased engineering roadmap from darkness to warm lantern light.
          </p>
        </div>
        <button
          onClick={onOpenSummon}
          className="px-6 py-3 rounded-xl bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_16px_rgba(255,117,24,0.3)] inline-flex items-center gap-2"
        >
          <JackOLantern expression="excited" size="xs" />
          <span>SUMMON A REPOSITORY</span>
        </button>
      </div>
    );
  }

  const steps = repo.analysis.revivalPlan;
  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  // Group steps by Phase
  const phases = Array.from(new Set(steps.map((s) => s.phase)));

  const handleExportMarkdown = () => {
    let md = `# DARKIT REVIVAL PLAN — ${repo.meta.fullName}\n`;
    md += `Target: ${repo.meta.htmlUrl}\n`;
    md += `Status: ${repo.analysis.hauntLevel} (Haunt Score: ${repo.analysis.hauntScore}/100)\n\n`;
    md += `## Progress: ${completedCount}/${steps.length} Steps Completed (${progressPercent}%)\n\n`;

    phases.forEach((phase) => {
      md += `### ${phase}\n\n`;
      const phaseSteps = steps.filter((s) => s.phase === phase);
      phaseSteps.forEach((s) => {
        md += `- [${s.completed ? 'x' : ' '}] **${s.title}** (${s.priority} Priority)\n`;
        md += `  - Reason: ${s.reason}\n`;
        md += `  - Evidence: ${s.evidence}\n`;
        md += `  - Approach: ${s.approach}\n\n`;
      });
    });

    navigator.clipboard.writeText(md);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Ritual Header Banner */}
      <div className="p-6 rounded-2xl bg-[#15110F] border border-[#392820] relative overflow-hidden">
        <div className="absolute top-2 right-6 hidden md:block">
          <HangingLantern size="sm" chainHeight={20} />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="animate-ghost-float">
              <GhostCompanion variant="wrench" size="lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9BD49A] bg-[#9BD49A]/10 px-2 py-0.5 rounded border border-[#9BD49A]/30">
                  SANCTUM RESURRECTION
                </span>
                <span className="text-xs text-[#776C64]">·</span>
                <span className="text-xs font-mono text-[#776C64]">{repo.meta.fullName}</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F4EDE5] mt-1">
                THE REVIVAL RITUAL
              </h1>
              <p className="text-xs sm:text-sm text-[#B4A69A]">
                Bring abandoned code back to life. One deliberate fix at a time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            <button
              onClick={handleExportMarkdown}
              className="px-4 py-2 rounded-xl bg-[#1D1714] hover:bg-[#261E1A] text-xs font-mono text-[#F4EDE5] border border-[#392820] hover:border-[#FF7518]/50 flex items-center gap-2 transition-colors shadow-sm"
            >
              {copiedPlan ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#9BD49A]" />
                  <span className="text-[#9BD49A]">Copied Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#FF9F43]" />
                  <span>Export Ritual (Markdown)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ritual Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#392820]/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#B4A69A]">
              Ritual Sanctification: {completedCount} of {steps.length} Steps Complete
            </span>
            <span className="text-[#FF9F43] font-bold">{progressPercent}% Purified</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#110F0E] overflow-hidden border border-[#392820]">
            <div
              className="h-full bg-gradient-to-r from-[#FF7518] via-[#FF9F43] to-[#9BD49A] rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phased Vertical Timeline */}
      <div className="space-y-8">
        {phases.map((phaseName, phaseIndex) => {
          const phaseSteps = steps.filter((s) => s.phase === phaseName);
          const phaseDone = phaseSteps.every((s) => s.completed);

          return (
            <div key={phaseName} className="space-y-4">
              {/* Phase Header */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#1D1714] border border-[#FF7518]/40 flex items-center justify-center font-mono text-xs font-bold text-[#FF9F43]">
                  0{phaseIndex + 1}
                </div>
                <h2 className="font-display font-bold text-lg text-[#F4EDE5] flex items-center gap-2">
                  <span>{phaseName}</span>
                  {phaseDone && (
                    <span className="text-xs font-mono text-[#9BD49A] flex items-center gap-1 font-normal">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Phase Complete</span>
                    </span>
                  )}
                </h2>
              </div>

              {/* Steps Cards */}
              <div className="space-y-3 pl-2 sm:pl-10 border-l border-[#392820] ml-3.5">
                {phaseSteps.map((step) => {
                  const badgeStyle = PRIORITY_BADGES[step.priority] || PRIORITY_BADGES.Medium;

                  return (
                    <div
                      key={step.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        step.completed
                          ? 'bg-[#121612] border-[#9BD49A]/30'
                          : 'bg-[#15110F] border-[#392820] hover:border-[#FF7518]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => onToggleStep(step.id)}
                            className="mt-1 text-[#776C64] hover:text-[#9BD49A] transition-colors shrink-0"
                            title={step.completed ? 'Mark as pending' : 'Mark as completed (+50 XP)'}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-[#9BD49A]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#392820] hover:text-[#FF7518]" />
                            )}
                          </button>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${badgeStyle}`}>
                                {step.priority} Priority
                              </span>
                              <h3
                                className={`font-display font-bold text-sm sm:text-base ${
                                  step.completed ? 'text-[#9BD49A] line-through' : 'text-[#F4EDE5]'
                                }`}
                              >
                                {step.title}
                              </h3>
                            </div>

                            <p className="text-xs text-[#B4A69A] leading-relaxed">
                              {step.reason}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                              <div className="p-2.5 rounded-lg bg-[#110F0E] border border-[#392820] space-y-1">
                                <span className="text-[10px] font-mono uppercase text-[#776C64] block">
                                  Underlying Finding:
                                </span>
                                <span className="text-[#F4EDE5] text-[11px] font-mono">{step.evidence}</span>
                              </div>

                              <div className="p-2.5 rounded-lg bg-[#110F0E] border border-[#392820] space-y-1">
                                <span className="text-[10px] font-mono uppercase text-[#FF9F43] block">
                                  Prescribed Approach:
                                </span>
                                <span className="text-[#F4EDE5] text-[11px] leading-relaxed">{step.approach}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <JackOLantern expression={step.completed ? 'victorious' : 'mischievous'} size="xs" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Lantern at the End of the Timeline */}
        <div className="pt-6 flex flex-col items-center justify-center text-center space-y-3">
          <HangingLantern size="lg" withChain={false} />
          <div className="space-y-1 max-w-sm">
            <h4 className="font-display font-bold text-base text-[#FFC15A]">
              The Eternal Lantern
            </h4>
            <p className="text-xs text-[#776C64]">
              Completing all ritual steps banishes the final specters, returning the codebase to active maintainership.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
