import React from 'react';
import { DailyHauntState } from '../../types/index.js';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { GhostCompanion } from '../illustrations/GhostCompanion.js';
import { HangingLantern } from '../illustrations/HangingLantern.js';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Trophy,
  ArrowRight,
} from 'lucide-react';

interface DailyHauntProps {
  dailyHaunt: DailyHauntState;
  onToggleTask: (taskId: string) => void;
  onClaimDailyReward: () => void;
  onGoToSummon: () => void;
}

export const DailyHaunt: React.FC<DailyHauntProps> = ({
  dailyHaunt,
  onToggleTask,
  onClaimDailyReward,
  onGoToSummon,
}) => {
  const allCompleted = dailyHaunt.tasks.every((t) => t.completed);
  const completedCount = dailyHaunt.tasks.filter((t) => t.completed).length;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Daily Banner */}
      <div className="p-6 rounded-2xl bg-[#15110F] border border-[#392820] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="animate-ghost-float">
            <GhostCompanion variant="detective" size="lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFC15A] bg-[#FFC15A]/10 px-2 py-0.5 rounded border border-[#FFC15A]/30">
                DAILY SÉANCE
              </span>
              <span className="text-xs text-[#776C64]">·</span>
              <span className="text-xs font-mono text-[#776C64]">Resets at Midnight</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F4EDE5] mt-1">
              {dailyHaunt.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#B4A69A]">
              {dailyHaunt.subtitle}
            </p>
          </div>
        </div>

        {/* Emblem & Jack-o'-Lantern */}
        <div className="shrink-0 flex items-center gap-3">
          <JackOLantern expression={allCompleted ? 'victorious' : 'excited'} size="md" />
        </div>
      </div>

      {/* Daily Tasks Card */}
      <div className="p-6 rounded-2xl bg-[#110F0E] border border-[#392820] shadow-[0_12px_36px_rgba(0,0,0,0.5)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#392820]/60">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF9F43]">
            <Clock className="w-4 h-4 text-[#FF7518]" />
            <span>EXPIRES AT MIDNIGHT</span>
          </div>

          <span className="text-xs font-mono text-[#776C64]">
            {completedCount} of {dailyHaunt.tasks.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {dailyHaunt.tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-[#141A14] border-[#9BD49A]/30'
                  : 'bg-[#15110F] border-[#392820] hover:border-[#FF7518]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-[#776C64] hover:text-[#9BD49A] transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#9BD49A]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#392820] hover:text-[#FF7518]" />
                  )}
                </button>

                <div>
                  <h3
                    className={`font-display font-semibold text-sm ${
                      task.completed ? 'text-[#9BD49A] line-through' : 'text-[#F4EDE5]'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-[#776C64]">{task.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold text-[#FFC15A]">
                  +{task.xp} XP
                </span>
                <JackOLantern expression={task.completed ? 'victorious' : 'mischievous'} size="xs" />
              </div>
            </div>
          ))}
        </div>

        {/* Claim Daily Bonus Reward */}
        <div className="pt-4 border-t border-[#392820]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#776C64]">
            Complete all daily tasks to claim the <span className="text-[#FF9F43] font-bold">+150 XP</span> Grand Haunt bounty.
          </div>

          <button
            onClick={onClaimDailyReward}
            disabled={!allCompleted || dailyHaunt.claimed}
            className={`px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              dailyHaunt.claimed
                ? 'bg-[#1D1714] text-[#9BD49A] border border-[#9BD49A]/30 cursor-default'
                : allCompleted
                ? 'bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] shadow-[0_0_16px_rgba(255,117,24,0.4)]'
                : 'bg-[#1D1714] text-[#776C64] border border-[#392820] cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{dailyHaunt.claimed ? 'Reward Claimed!' : 'Claim Daily Haunt Bounty'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
