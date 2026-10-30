import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { SummonedRepository } from '../../types/index.js';
import { JackOLantern } from '../illustrations/JackOLantern.js';
import { GhostCompanion } from '../illustrations/GhostCompanion.js';
import { HangingLantern } from '../illustrations/HangingLantern.js';
import {
  Star,
  GitFork,
  FileCode,
  AlertCircle,
  Activity,
  BarChart3,
  PieChart as PieIcon,
  Sparkles,
  Info,
} from 'lucide-react';

interface RepositoryMetricsProps {
  repo: SummonedRepository | null;
  onOpenSummon?: () => void;
}

// Sample fallback preview when no repository is summoned yet
const DEMO_METRICS = {
  meta: {
    fullName: 'expressjs/express',
    stars: 64200,
    forks: 15300,
    openIssues: 142,
    language: 'JavaScript',
    size: 15200,
  },
  languages: {
    JavaScript: 852000,
    TypeScript: 84000,
    HTML: 24000,
    Shell: 12000,
  },
  commits: [
    { date: '2026-10-01', count: 4 },
    { date: '2026-10-06', count: 8 },
    { date: '2026-10-09', count: 12 },
    { date: '2026-10-14', count: 7 },
    { date: '2026-10-18', count: 15 },
    { date: '2026-10-24', count: 9 },
    { date: '2026-10-29', count: 14 },
  ],
  hauntScore: 68,
};

const PUMPKIN_PALETTE = [
  '#FF7518', // Primary pumpkin orange
  '#FF9F43', // Bright accent orange
  '#FFC15A', // Lantern amber
  '#A94C19', // Burnt orange
  '#E8E2DC', // Spectral ivory
  '#9BD49A', // Purified green
  '#776C64', // Muted stone
];

export const RepositoryMetrics: React.FC<RepositoryMetricsProps> = ({
  repo,
  onOpenSummon,
}) => {
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<'languages' | 'comparisons' | 'commits'>('languages');

  const isDemo = !repo;
  const currentMeta = repo?.meta || DEMO_METRICS.meta;
  const rawLanguages = repo?.languages && Object.keys(repo.languages).length > 0
    ? repo.languages
    : DEMO_METRICS.languages;

  // Process Language Data for D3 Donut Chart
  const languageData = useMemo(() => {
    const totalBytes = Object.values(rawLanguages).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(rawLanguages)
      .sort((a, b) => b[1] - a[1])
      .map(([name, bytes], i) => ({
        name,
        bytes,
        percentage: Math.round((bytes / totalBytes) * 1000) / 10,
        color: PUMPKIN_PALETTE[i % PUMPKIN_PALETTE.length],
      }));
  }, [rawLanguages]);

  // Primary language calculation
  const primaryLang = languageData[0] || { name: currentMeta.language || 'Code', percentage: 100, color: '#FF7518' };

  // D3 Pie & Arc Calculations
  const donutWidth = 240;
  const donutHeight = 240;
  const radius = Math.min(donutWidth, donutHeight) / 2;
  const innerRadius = radius * 0.62;

  const pieGenerator = useMemo(() => {
    return d3.pie<{ name: string; bytes: number; percentage: number; color: string }>()
      .value((d) => d.bytes)
      .sort(null)
      .padAngle(0.03);
  }, []);

  const arcGenerator = useMemo(() => {
    return d3.arc<d3.PieArcDatum<{ name: string; bytes: number; percentage: number; color: string }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 6)
      .cornerRadius(4);
  }, [innerRadius, radius]);

  const hoverArcGenerator = useMemo(() => {
    return d3.arc<d3.PieArcDatum<{ name: string; bytes: number; percentage: number; color: string }>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius)
      .cornerRadius(6);
  }, [innerRadius, radius]);

  const pieArcs = useMemo(() => {
    return pieGenerator(languageData);
  }, [pieGenerator, languageData]);

  // D3 Metrics Bar Chart Data (Comparison of Key stats)
  const metricBars = useMemo(() => {
    const stars = currentMeta.stars || 0;
    const forks = currentMeta.forks || 0;
    const issues = currentMeta.openIssues || 0;
    const haunt = repo?.analysis?.hauntScore || DEMO_METRICS.hauntScore;

    // Normalizing with d3.scaleLog or max for visual representation
    return [
      { label: 'Stars (★)', value: stars, display: stars.toLocaleString(), color: '#FF7518', maxRel: Math.max(stars, forks, 100) },
      { label: 'Forks (⑂)', value: forks, display: forks.toLocaleString(), color: '#FF9F43', maxRel: Math.max(stars, forks, 100) },
      { label: 'Open Issues', value: issues, display: issues.toLocaleString(), color: '#FFC15A', maxRel: Math.max(stars, forks, 100) },
      { label: 'Haunt Severity', value: haunt, display: `${haunt} / 100`, color: '#FF5B57', maxRel: 100, isScore: true },
    ];
  }, [currentMeta, repo]);

  // D3 Commit Sparkline Calculations
  const sparklineData = useMemo(() => {
    if (repo?.commits && repo.commits.length > 0) {
      // Map commits to relative index points
      return repo.commits.slice(0, 10).reverse().map((c, i) => ({
        x: i,
        label: c.sha.slice(0, 7),
        val: 3 + (c.sha.charCodeAt(0) % 8) + (i % 3) * 2,
        date: new Date(c.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      }));
    }
    return DEMO_METRICS.commits.map((c, i) => ({
      x: i,
      label: c.date,
      val: c.count,
      date: c.date,
    }));
  }, [repo]);

  const sparkWidth = 460;
  const sparkHeight = 130;
  const sparkMargin = { top: 15, right: 20, bottom: 25, left: 20 };

  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, Math.max(1, sparklineData.length - 1)])
      .range([sparkMargin.left, sparkWidth - sparkMargin.right]);
  }, [sparklineData, sparkWidth, sparkMargin]);

  const yScale = useMemo(() => {
    const maxVal = d3.max(sparklineData, (d) => d.val) || 10;
    return d3.scaleLinear()
      .domain([0, maxVal * 1.25])
      .range([sparkHeight - sparkMargin.bottom, sparkMargin.top]);
  }, [sparklineData, sparkHeight, sparkMargin]);

  const sparkLinePath = useMemo(() => {
    const lineGen = d3.line<{ x: number; val: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.val))
      .curve(d3.curveMonotoneX);
    return lineGen(sparklineData) || '';
  }, [sparklineData, xScale, yScale]);

  const sparkAreaPath = useMemo(() => {
    const areaGen = d3.area<{ x: number; val: number }>()
      .x((d) => xScale(d.x))
      .y0(sparkHeight - sparkMargin.bottom)
      .y1((d) => yScale(d.val))
      .curve(d3.curveMonotoneX);
    return areaGen(sparklineData) || '';
  }, [sparklineData, xScale, yScale, sparkHeight, sparkMargin]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-[#15110F] border border-[#392820] shadow-[0_12px_36px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-6">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7518]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#1D1714] border border-[#FF7518]/30 shrink-0">
            <BarChart3 className="w-5 h-5 text-[#FF7518]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF9F43] bg-[#FF7518]/15 px-2 py-0.5 rounded border border-[#FF7518]/30 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF7518]" />
                <span>D3 TELEMETRY ENGINE</span>
              </span>
              {isDemo ? (
                <span className="text-xs font-mono text-[#FFC15A] bg-[#FFC15A]/10 px-2 py-0.5 rounded border border-[#FFC15A]/20">
                  Preview Mode
                </span>
              ) : (
                <span className="text-xs font-mono text-[#9BD49A]">
                  Live Repository AST
                </span>
              )}
            </div>
            <h2 className="font-display font-extrabold text-lg sm:text-xl md:text-2xl text-[#F4EDE5] mt-1">
              REPOSITORY METRICS & CODEBASE VITALS
            </h2>
            <p className="text-xs text-[#B4A69A]">
              D3 spectral visualizations parsing adoption, language composition, and commit cadence.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#110F0E] rounded-xl border border-[#392820] text-xs font-mono w-full sm:w-auto justify-center sm:justify-start">
          <button
            onClick={() => setActiveMetricTab('languages')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeMetricTab === 'languages'
                ? 'bg-[#1D1714] text-[#FF9F43] border border-[#FF7518]/30 font-bold'
                : 'text-[#776C64] hover:text-[#B4A69A]'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Languages</span>
          </button>
          <button
            onClick={() => setActiveMetricTab('comparisons')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeMetricTab === 'comparisons'
                ? 'bg-[#1D1714] text-[#FF9F43] border border-[#FF7518]/30 font-bold'
                : 'text-[#776C64] hover:text-[#B4A69A]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Stats</span>
          </button>
          <button
            onClick={() => setActiveMetricTab('commits')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeMetricTab === 'commits'
                ? 'bg-[#1D1714] text-[#FF9F43] border border-[#FF7518]/30 font-bold'
                : 'text-[#776C64] hover:text-[#B4A69A]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Cadence</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Star Count */}
        <div className="p-4 rounded-xl bg-[#110F0E] border border-[#392820] hover:border-[#FF7518]/50 transition-colors space-y-1">
          <div className="flex items-center justify-between text-[#776C64]">
            <span className="text-[11px] font-mono uppercase">Stargazers</span>
            <Star className="w-4 h-4 text-[#FF7518]" />
          </div>
          <div className="font-display font-extrabold text-2xl text-[#F4EDE5] tabular-nums">
            ★ {currentMeta.stars.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[#B4A69A] flex items-center gap-1">
            <span className="text-[#9BD49A]">Adoption Tier:</span>
            <span>{currentMeta.stars > 10000 ? 'High Sanctuary' : currentMeta.stars > 1000 ? 'Active Crypt' : 'Awakening'}</span>
          </div>
        </div>

        {/* 2. Fork Count */}
        <div className="p-4 rounded-xl bg-[#110F0E] border border-[#392820] hover:border-[#FF9F43]/50 transition-colors space-y-1">
          <div className="flex items-center justify-between text-[#776C64]">
            <span className="text-[11px] font-mono uppercase">Network Forks</span>
            <GitFork className="w-4 h-4 text-[#FF9F43]" />
          </div>
          <div className="font-display font-extrabold text-2xl text-[#F4EDE5] tabular-nums">
            ⑂ {currentMeta.forks.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[#B4A69A]">
            Ratio:{' '}
            <span className="text-[#FF9F43] font-semibold">
              {currentMeta.stars > 0 ? ((currentMeta.forks / currentMeta.stars) * 100).toFixed(1) : 0}% of stars
            </span>
          </div>
        </div>

        {/* 3. Primary Language */}
        <div className="p-4 rounded-xl bg-[#110F0E] border border-[#392820] hover:border-[#FFC15A]/50 transition-colors space-y-1">
          <div className="flex items-center justify-between text-[#776C64]">
            <span className="text-[11px] font-mono uppercase">Dominant Dialect</span>
            <FileCode className="w-4 h-4 text-[#FFC15A]" />
          </div>
          <div className="font-display font-extrabold text-xl text-[#F4EDE5] truncate">
            {primaryLang.name}
          </div>
          <div className="text-[10px] font-mono text-[#B4A69A] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryLang.color }} />
            <span>{primaryLang.percentage}% of codebase</span>
          </div>
        </div>

        {/* 4. Open Issues / Haunt Pressure */}
        <div className="p-4 rounded-xl bg-[#110F0E] border border-[#392820] hover:border-[#FF5B57]/50 transition-colors space-y-1">
          <div className="flex items-center justify-between text-[#776C64]">
            <span className="text-[11px] font-mono uppercase">Graveyard Issues</span>
            <AlertCircle className="w-4 h-4 text-[#FF5B57]" />
          </div>
          <div className="font-display font-extrabold text-2xl text-[#F4EDE5] tabular-nums">
            {currentMeta.openIssues.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[#B4A69A]">
            Curse Burden:{' '}
            <span className={currentMeta.openIssues > 100 ? 'text-[#FF5B57] font-bold' : 'text-[#9BD49A]'}>
              {currentMeta.openIssues > 200 ? 'Critical Specters' : currentMeta.openIssues > 50 ? 'Moderate' : 'Low Mist'}
            </span>
          </div>
        </div>
      </div>

      {/* D3 Visualizations Display Box */}
      <div className="p-6 rounded-2xl bg-[#110F0E] border border-[#392820]">
        {/* VIEW 1: D3 LANGUAGES DONUT CHART */}
        {activeMetricTab === 'languages' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* D3 Donut SVG */}
            <div className="md:col-span-5 flex justify-center items-center relative py-2">
              <svg viewBox={`0 0 ${donutWidth} ${donutHeight}`} className="w-48 h-48 sm:w-60 sm:h-60 max-w-full overflow-visible drop-shadow-[0_0_16px_rgba(255,117,24,0.18)]">
                <g transform={`translate(${donutWidth / 2}, ${donutHeight / 2})`}>
                  {pieArcs.map((arc, i) => {
                    const isHovered = hoveredLanguage === arc.data.name;
                    const path = isHovered ? hoverArcGenerator(arc) : arcGenerator(arc);

                    return (
                      <path
                        key={arc.data.name}
                        d={path || ''}
                        fill={arc.data.color}
                        stroke="#110F0E"
                        strokeWidth={2}
                        onMouseEnter={() => setHoveredLanguage(arc.data.name)}
                        onMouseLeave={() => setHoveredLanguage(null)}
                        className="cursor-pointer transition-all duration-200 hover:brightness-125"
                      />
                    );
                  })}
                </g>
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-mono uppercase text-[#776C64]">
                  {hoveredLanguage ? 'Selected Dialect' : 'Primary'}
                </span>
                <span className="font-display font-bold text-base text-[#F4EDE5] truncate max-w-[120px]">
                  {hoveredLanguage
                    ? hoveredLanguage
                    : primaryLang.name}
                </span>
                <span className="text-xs font-mono font-bold text-[#FF9F43]">
                  {hoveredLanguage
                    ? `${languageData.find((l) => l.name === hoveredLanguage)?.percentage}%`
                    : `${primaryLang.percentage}%`}
                </span>
              </div>
            </div>

            {/* Language Breakdown Table / Legend */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#392820]/60">
                <span className="text-xs font-mono uppercase text-[#776C64]">Language Breakdown</span>
                <span className="text-xs font-mono text-[#776C64]">D3 Arc Ratio</span>
              </div>

              <div className="space-y-2">
                {languageData.map((lang) => {
                  const isHovered = hoveredLanguage === lang.name;
                  return (
                    <div
                      key={lang.name}
                      onMouseEnter={() => setHoveredLanguage(lang.name)}
                      onMouseLeave={() => setHoveredLanguage(null)}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isHovered
                          ? 'bg-[#1D1714] border-[#FF7518] shadow-[0_0_12px_rgba(255,117,24,0.2)]'
                          : 'bg-[#15110F] border-[#392820] hover:border-[#FF7518]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                        <span className="text-xs font-mono font-medium text-[#F4EDE5]">{lang.name}</span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-[#776C64] text-[11px] hidden sm:inline">
                          {(lang.bytes / 1024).toFixed(0)} KB
                        </span>
                        <span className="text-[#FF9F43] font-bold tabular-nums">
                          {lang.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: D3 KEY STATS COMPARISON BAR CHART */}
        {activeMetricTab === 'comparisons' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#392820]/60">
              <span className="text-xs font-mono uppercase text-[#776C64]">Metric Dimension</span>
              <span className="text-xs font-mono text-[#776C64]">Scaled Value</span>
            </div>

            <div className="space-y-3.5">
              {metricBars.map((item) => {
                // Calculate normalized percentage bar width
                const maxVal = Math.max(...metricBars.map((m) => m.value), 100);
                const barPercent = Math.min(100, Math.max(12, Math.round((item.value / maxVal) * 100)));

                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#B4A69A] font-medium">{item.label}</span>
                      <span className="text-[#F4EDE5] font-bold tabular-nums">{item.display}</span>
                    </div>

                    <div className="h-3 w-full rounded-full bg-[#15110F] overflow-hidden border border-[#392820] p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(255,117,24,0.3)]"
                        style={{
                          width: `${barPercent}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: D3 COMMIT ACTIVITY SPARKLINE */}
        {activeMetricTab === 'commits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#392820]/60">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF7518]" />
                <span className="text-xs font-display font-semibold text-[#F4EDE5]">
                  Commit Volatility Curve
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#776C64]">
                D3 Monotone Interpolation
              </span>
            </div>

            <div className="w-full overflow-x-auto flex justify-center py-2 px-1">
              <svg viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} className="w-full max-w-[480px] h-auto overflow-visible">
                <defs>
                  <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7518" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF7518" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Shaded Area under Curve */}
                <path d={sparkAreaPath} fill="url(#sparkGradient)" />

                {/* Main Curved Line */}
                <path
                  d={sparkLinePath}
                  fill="none"
                  stroke="#FF7518"
                  strokeWidth={2.5}
                  className="drop-shadow-[0_0_6px_rgba(255,117,24,0.6)]"
                />

                {/* Data Points */}
                {sparklineData.map((d) => (
                  <g key={d.x} className="group cursor-pointer">
                    <circle
                      cx={xScale(d.x)}
                      cy={yScale(d.val)}
                      r={4}
                      fill="#FFC15A"
                      stroke="#110F0E"
                      strokeWidth={2}
                      className="transition-transform group-hover:scale-150"
                    />
                    <text
                      x={xScale(d.x)}
                      y={sparkHeight - 4}
                      textAnchor="middle"
                      fill="#776C64"
                      fontSize={9}
                      fontFamily="monospace"
                    >
                      {d.date}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="text-[11px] text-[#776C64] font-mono text-center">
              *Visualizes commit bursts and maintenance cadence across recorded commits
            </div>
          </div>
        )}
      </div>

      {/* Guidance Note if in Demo Mode */}
      {isDemo && (
        <div className="p-3.5 rounded-xl bg-[#1D1714] border border-[#FF7518]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#B4A69A]">
            <Info className="w-4 h-4 text-[#FF9F43] shrink-0" />
            <span>Currently previewing standard expressjs telemetry. Summon any repository to parse its live AST and D3 metrics.</span>
          </div>
          {onOpenSummon && (
            <button
              onClick={onOpenSummon}
              className="px-3 py-1.5 rounded-lg bg-[#FF7518] hover:bg-[#FF9F43] text-[#0D0B0A] font-bold text-[11px] uppercase tracking-wider shrink-0 transition-colors"
            >
              Summon Repo
            </button>
          )}
        </div>
      )}
    </div>
  );
};
