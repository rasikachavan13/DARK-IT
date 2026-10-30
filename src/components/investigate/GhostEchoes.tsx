import React, { useState, useEffect, useRef } from 'react';
import { CommitItem } from '../../types/index.js';
import { GhostCompanion } from '../illustrations/GhostCompanion.js';
import { soundEngine } from '../../utils/soundEffects.js';
import { GitCommit, Sparkles, Copy, Check, Radio, Volume2 } from 'lucide-react';

interface GhostEchoesProps {
  commits: CommitItem[];
  repoName: string;
}

interface FloatingEcho {
  id: string;
  sha: string;
  message: string;
  author: string;
  date: string;
  leftPercent: number;
  durationSeconds: number;
  hueColor: 'green' | 'orange' | 'amber' | 'ember';
  swayDistance: number;
  createdAt: number;
}

const FALLBACK_COMMITS = [
  { sha: '8f12a0d', message: 'fix: exorcise phantom memory leak in listener loop', author: 'ancient-architect', date: '3 moons ago' },
  { sha: 'c4e912b', message: 'refactor: seal unbounded recursive invocation curse', author: 'spectral-dev', date: '12 moons ago' },
  { sha: '1a90c4f', message: 'feat: erect cryptographic wards around core endpoints', author: 'crypt-keeper', date: '6 moons ago' },
  { sha: '7e2b10a', message: 'deps: upgrade ancient dependencies before rot spreads', author: 'ghost-maintainer', date: '18 moons ago' },
  { sha: '3d8a95c', message: 'docs: record forbidden knowledge in ancient scrolls', author: 'scribe-phantom', date: '24 moons ago' },
  { sha: '992a4bc', message: 'fix: resolve race condition in cemetery garbage collector', author: 'wandering-soul', date: '8 moons ago' },
];

export const GhostEchoes: React.FC<GhostEchoesProps> = ({ commits, repoName }) => {
  const [echoes, setEchoes] = useState<FloatingEcho[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pausedId, setPausedId] = useState<string | null>(null);
  const nextSpawnTimerRef = useRef<number | null>(null);

  // Pool of candidate commit lore
  const candidateCommits = commits.length > 0
    ? commits.map((c) => ({
        sha: c.sha || 'ghost',
        message: c.message || 'Echoes in the underworld',
        author: c.author || 'Anonymous Spirit',
        date: new Date(c.date).toLocaleDateString(),
      }))
    : FALLBACK_COMMITS;

  const spawnEcho = () => {
    if (candidateCommits.length === 0) return;
    const randomCommit = candidateCommits[Math.floor(Math.random() * candidateCommits.length)];
    const hues: Array<'green' | 'orange' | 'amber' | 'ember'> = ['green', 'orange', 'amber', 'ember'];
    const chosenHue = hues[Math.floor(Math.random() * hues.length)];

    const newEcho: FloatingEcho = {
      id: `echo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sha: randomCommit.sha,
      message: randomCommit.message,
      author: randomCommit.author,
      date: randomCommit.date,
      // Random horizontal spawn position (safe margin: 4% to 54% so card never overflows screen)
      leftPercent: 4 + Math.random() * 50,
      // Float duration between 9s and 14s
      durationSeconds: 9 + Math.random() * 5,
      hueColor: chosenHue,
      swayDistance: (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 16),
      createdAt: Date.now(),
    };

    setEchoes((prev) => {
      // Keep at most 5 floating particles on screen to keep UI graceful
      const trimmed = prev.slice(-4);
      return [...trimmed, newEcho];
    });
  };

  // Periodic spawning timer
  useEffect(() => {
    if (!isActive) return;

    // Initial spawn shortly after mounting
    const initialTimer = window.setTimeout(() => {
      spawnEcho();
    }, 1200);

    const scheduleNext = () => {
      // Periodic interval between 3500ms and 5500ms
      const delay = 3500 + Math.random() * 2000;
      nextSpawnTimerRef.current = window.setTimeout(() => {
        spawnEcho();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      clearTimeout(initialTimer);
      if (nextSpawnTimerRef.current) {
        clearTimeout(nextSpawnTimerRef.current);
      }
    };
  }, [isActive, commits]);

  // Clean up completed echoes
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setEchoes((prev) =>
        prev.filter((echo) => now - echo.createdAt < (echo.durationSeconds + 1) * 1000)
      );
    }, 2000);

    return () => clearInterval(cleanupInterval);
  }, []);

  const handleCopyEcho = (echo: FloatingEcho, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`[${echo.sha}] ${echo.message} - ${echo.author}`);
    soundEngine.playEchoCatch();
    setCopiedId(echo.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getHueStyles = (hue: FloatingEcho['hueColor']) => {
    switch (hue) {
      case 'green':
        return {
          border: 'border-[#9BD49A]/40',
          bg: 'bg-[#0D1812]/90',
          glow: 'shadow-[0_0_20px_rgba(155,212,154,0.25)]',
          badge: 'bg-[#9BD49A]/15 text-[#9BD49A] border-[#9BD49A]/30',
          text: 'text-[#9BD49A]',
        };
      case 'amber':
        return {
          border: 'border-[#FFC15A]/40',
          bg: 'bg-[#1C160B]/90',
          glow: 'shadow-[0_0_20px_rgba(255,193,90,0.25)]',
          badge: 'bg-[#FFC15A]/15 text-[#FFC15A] border-[#FFC15A]/30',
          text: 'text-[#FFC15A]',
        };
      case 'ember':
        return {
          border: 'border-[#FF5B57]/40',
          bg: 'bg-[#1A0D0D]/90',
          glow: 'shadow-[0_0_20px_rgba(255,91,87,0.25)]',
          badge: 'bg-[#FF5B57]/15 text-[#FF5B57] border-[#FF5B57]/30',
          text: 'text-[#FF5B57]',
        };
      case 'orange':
      default:
        return {
          border: 'border-[#FF7518]/40',
          bg: 'bg-[#1A120E]/90',
          glow: 'shadow-[0_0_20px_rgba(255,117,24,0.25)]',
          badge: 'bg-[#FF7518]/15 text-[#FF9F43] border-[#FF7518]/30',
          text: 'text-[#FF9F43]',
        };
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#110F0E] border border-[#392820] overflow-hidden my-6">
      {/* Ghost Echoes Atmospheric Controller Banner */}
      <div className="px-5 py-3.5 bg-[#15110F]/90 border-b border-[#392820] flex flex-wrap items-center justify-between gap-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <Radio className={`w-4 h-4 ${isActive ? 'text-[#9BD49A] animate-pulse' : 'text-[#776C64]'}`} />
            {isActive && (
              <span className="absolute -inset-1 rounded-full bg-[#9BD49A]/20 animate-ping pointer-events-none" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-[#F4EDE5] tracking-wide flex items-center gap-1.5">
                <span>Ghost Echoes</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#9BD49A]/10 text-[#9BD49A] border border-[#9BD49A]/30">
                  Historical Telemetry
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-[#776C64]">
              Periodic spectral commit particles hovering from <span className="text-[#B4A69A]">{repoName}</span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={spawnEcho}
            className="px-2.5 py-1.5 rounded-lg bg-[#1D1714] hover:bg-[#261E1A] text-xs font-mono text-[#F4EDE5] border border-[#392820] hover:border-[#FF7518]/50 flex items-center gap-1.5 transition-colors"
            title="Immediately summon a random historical commit ghost"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFC15A]" />
            <span>Summon Echo</span>
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
              isActive
                ? 'bg-[#9BD49A]/15 text-[#9BD49A] border-[#9BD49A]/40 hover:bg-[#9BD49A]/25'
                : 'bg-[#1D1714] text-[#776C64] border-[#392820] hover:text-[#B4A69A]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#9BD49A] animate-pulse' : 'bg-[#776C64]'}`} />
            <span>{isActive ? 'Echoes Active' : 'Echoes Dormant'}</span>
          </button>
        </div>
      </div>

      {/* Floating Canvas Area */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-radial from-[#15110F] to-[#0D0B0A] select-none">
        {/* Subtle background pentagram / grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, #FF7518 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient background hint when few or no echoes are on screen */}
        {echoes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-[#776C64] pointer-events-none p-4">
            <div className="opacity-40 animate-ghost-float">
              <GhostCompanion variant="lantern" size="sm" />
            </div>
            <p className="text-xs font-mono italic">
              Listening for ancient commit whispers in the void...
            </p>
          </div>
        )}

        {/* Active Floating Echo Particles */}
        {echoes.map((echo) => {
          const style = getHueStyles(echo.hueColor);
          const isPaused = pausedId === echo.id;
          const isCopied = copiedId === echo.id;

          return (
            <div
              key={echo.id}
              onMouseEnter={() => setPausedId(echo.id)}
              onMouseLeave={() => setPausedId(null)}
              onClick={(e) => handleCopyEcho(echo, e)}
              style={{
                left: `${echo.leftPercent}%`,
                animationDuration: `${echo.durationSeconds}s`,
                animationPlayState: isPaused ? 'paused' : 'running',
                transform: isPaused ? 'scale(1.05)' : undefined,
              }}
              className={`absolute bottom-0 z-10 cursor-pointer pointer-events-auto rounded-xl p-2.5 sm:p-3 border backdrop-blur-md transition-all duration-300 ${style.border} ${style.bg} ${style.glow} hover:border-[#FF7518] hover:scale-105 max-w-[calc(100%-24px)] sm:max-w-[340px] shadow-lg animate-ghost-echo-rise`}
            >
              {/* Header: SHA + Author + Date */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <GitCommit className={`w-3.5 h-3.5 ${style.text}`} />
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${style.badge}`}>
                    {echo.sha}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#776C64] font-mono">
                  <span>{echo.author}</span>
                  <span>·</span>
                  <span>{echo.date}</span>
                </div>
              </div>

              {/* Commit Message */}
              <p className="text-xs font-mono text-[#F4EDE5] line-clamp-2 leading-relaxed italic">
                "{echo.message}"
              </p>

              {/* Footer hint */}
              <div className="mt-2 pt-1.5 border-t border-[#392820]/60 flex items-center justify-between text-[10px] font-mono text-[#776C64]">
                <span className="flex items-center gap-1 text-[#B4A69A]">
                  <Sparkles className="w-2.5 h-2.5 text-[#FFC15A]" />
                  <span>Spectral Commit Echo</span>
                </span>
                <span className="text-[#FF9F43] hover:underline flex items-center gap-1">
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-[#9BD49A]" />
                      <span className="text-[#9BD49A]">Captured!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Click to Capture</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
