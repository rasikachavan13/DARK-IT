import React, { useState, useRef, useEffect } from 'react';
import { SummonedRepository, ChatMessage } from '../../types/index.js';
import { GhostCompanion, GhostVariant } from '../illustrations/GhostCompanion.js';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { HangingLantern } from '../illustrations/HangingLantern.js';
import { Send, Terminal, Sparkles, Copy, Check, MessageSquare, Flame } from 'lucide-react';

interface GhostChatProps {
  repo: SummonedRepository | null;
  messages: ChatMessage[];
  onSendMessage: (question: string) => Promise<void>;
  isLoading: boolean;
  onOpenSummon: () => void;
}

const STARTER_QUESTIONS = [
  'Where does the application start?',
  'Explain the main architecture.',
  'Which files should I inspect first?',
  'What could be improved in this repository?',
  'Help me understand the build & test pipeline.',
];

export const GhostChat: React.FC<GhostChatProps> = ({
  repo,
  messages,
  onSendMessage,
  isLoading,
  onOpenSummon,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      const q = inputVal.trim();
      setInputVal('');
      onSendMessage(q);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Determine ghost mascot mood
  let ghostMood: GhostVariant = 'waving';
  if (isLoading) ghostMood = 'lantern';
  else if (messages.length > 0) ghostMood = 'detective';
  else ghostMood = 'idle';

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#15110F] border border-[#392820] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="animate-ghost-float">
            <GhostCompanion variant={ghostMood} size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-[#FF9F43] uppercase tracking-wider bg-[#FF7518]/15 px-2 py-0.5 rounded border border-[#FF7518]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF7518]" />
                <span>GEMINI 3.8 FLASH</span>
              </span>
              <span className="text-xs text-[#776C64]">·</span>
              <span className="text-xs text-[#9BD49A] font-mono">
                Multi-Turn AI Chatbot
              </span>
              {repo && (
                <>
                  <span className="text-xs text-[#776C64]">·</span>
                  <span className="text-xs text-[#776C64] font-mono">
                    Context: {repo.meta.fullName}
                  </span>
                </>
              )}
            </div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[#F4EDE5] mt-1 flex items-center gap-2">
              <span>GEMINI GHOST CHATBOT</span>
            </h1>
            <p className="text-xs text-[#B4A69A]">
              Interrogate the repository spirits powered by Gemini. Ask about architecture, bugs, dependencies, and code exorcisms.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#1D1714] border border-[#392820] text-[11px] font-mono text-[#FFC15A] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#9BD49A] animate-pulse" />
            <span>gemini-3.8-flash active</span>
          </div>
          <JackOLantern expression="mischievous" size="sm" />
        </div>
      </div>

      {/* Main Terminal Chat Container */}
      <div className="rounded-2xl bg-[#110F0E] border border-[#392820] shadow-[0_16px_40px_rgba(0,0,0,0.7)] flex flex-col h-[600px] overflow-hidden">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-[#15110F] border-b border-[#392820] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B57]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC15A]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#9BD49A]/80" />
            <span className="ml-2 text-[11px] font-mono text-[#776C64]">
              {repo ? `${repo.meta.name} ~ ghost-session` : 'darkit-terminal ~ idle'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#FF9F43]">
            {isLoading ? (
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-[#FF9F43] animate-ping" />
                <span>Interrogating spirits...</span>
              </span>
            ) : (
              <span className="text-[11px] text-[#776C64]">Ready for queries</span>
            )}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="animate-ghost-float">
                <GhostCompanion variant="waving" size="lg" />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="font-display font-bold text-base text-[#F4EDE5]">
                  The Spirit Box is Silent
                </h3>
                <p className="text-xs text-[#776C64]">
                  {repo
                    ? `Whisper a question about ${repo.meta.fullName} or pick a starter inquiry below.`
                    : 'Summon a repository or ask general questions about code exorcism and architecture.'}
                </p>
              </div>

              {/* Starter Questions Chips */}
              <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-xl">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => onSendMessage(q)}
                    className="px-3 py-1.5 rounded-lg bg-[#1D1714] hover:bg-[#261E1A] border border-[#392820] hover:border-[#FF7518]/40 text-xs font-mono text-[#B4A69A] hover:text-[#FF9F43] transition-colors text-left"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="shrink-0 mt-1">
                        <GhostCompanion variant="lantern" size="sm" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#FF7518]/15 border border-[#FF7518]/40 text-[#F4EDE5] rounded-tr-sm'
                          : 'bg-[#181311] border border-[#392820] text-[#E8E2DC] rounded-tl-sm relative group'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[#392820]/40 text-[10px] font-mono text-[#776C64]">
                        <span>{isUser ? '$ developer --query' : 'Ghost Investigator'}</span>
                        <div className="flex items-center gap-2">
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {!isUser && (
                            <button
                              onClick={() => handleCopy(m.content, m.id)}
                              className="text-[#776C64] hover:text-[#FF9F43] transition-colors"
                              title="Copy response"
                            >
                              {copiedId === m.id ? (
                                <Check className="w-3 h-3 text-[#9BD49A]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content with pre/code rendering */}
                      <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed space-y-2">
                        {m.content.split('\n\n').map((paragraph, pIdx) => {
                          if (paragraph.startsWith('```') || paragraph.includes('```')) {
                            // Extract code
                            const codeMatch = paragraph.match(/```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```/);
                            if (codeMatch) {
                              return (
                                <div key={pIdx} className="my-2 p-3 rounded-lg bg-[#0D0B0A] border border-[#392820] font-mono text-xs overflow-x-auto text-[#FF9F43]">
                                  <pre><code>{codeMatch[1]}</code></pre>
                                </div>
                              );
                            }
                          }
                          return <p key={pIdx}>{paragraph}</p>;
                        })}
                      </div>
                    </div>

                    {isUser && (
                      <div className="shrink-0 mt-1">
                        <div className="w-7 h-7 rounded-lg bg-[#1D1714] border border-[#392820] flex items-center justify-center font-mono text-xs font-bold text-[#FF9F43]">
                          $
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading Indicator inside stream */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1 animate-ghost-float">
                    <GhostCompanion variant="lantern" size="sm" />
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-sm bg-[#181311] border border-[#392820] text-xs font-mono text-[#B4A69A] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF7518] animate-ping" />
                    <span>The ghost investigator is deciphering commit echoes...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#15110F] border-t border-[#392820]">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center bg-[#0D0B0A] border border-[#392820] focus-within:border-[#FF7518] rounded-xl px-3 py-2 transition-colors">
              <span className="text-[#FF7518] font-mono font-bold mr-2 text-sm">$</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={repo ? `Ask spirits about ${repo.meta.name}...` : 'Whisper to the ghost investigator...'}
                disabled={isLoading}
                className="w-full bg-transparent text-xs sm:text-sm font-mono text-[#F4EDE5] placeholder-[#776C64] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40 flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(255,117,24,0.3)]"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
