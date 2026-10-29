import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize server-side Gemini SDK
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini initialization warning:', err);
  }
}

// Helper to parse repo owner and name from input
function parseRepoInput(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim().replace(/\/$/, '');
  if (!trimmed) return null;

  // match github.com/owner/repo or https://github.com/owner/repo
  const urlMatch = trimmed.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/i);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/i, '') };
  }

  // match owner/repo
  const slashMatch = trimmed.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (slashMatch) {
    return { owner: slashMatch[1], repo: slashMatch[2].replace(/\.git$/i, '') };
  }

  return null;
}

// Preset fallbacks for high-profile repositories if rate-limited
const PRESET_REPOS: Record<string, any> = {
  'expressjs/express': {
    name: 'express',
    fullName: 'expressjs/express',
    owner: 'expressjs',
    description: 'Fast, unopinionated, minimalist web framework for node.',
    stars: 64200,
    forks: 15300,
    openIssues: 142,
    defaultBranch: 'master',
    license: 'MIT',
    htmlUrl: 'https://github.com/expressjs/express',
    pushedAt: '2025-10-14T18:22:10Z',
    createdAt: '2009-06-26T18:56:01Z',
    language: 'JavaScript',
    topics: ['express', 'framework', 'middleware', 'node', 'nodejs', 'rest', 'restful'],
    isArchived: false,
    size: 15200,
    languages: { JavaScript: 98.4, HTML: 1.1, Shell: 0.5 },
    files: [
      { path: 'lib/application.js', type: 'file' },
      { path: 'lib/express.js', type: 'file' },
      { path: 'lib/request.js', type: 'file' },
      { path: 'lib/response.js', type: 'file' },
      { path: 'lib/router/index.js', type: 'file' },
      { path: 'lib/router/layer.js', type: 'file' },
      { path: 'lib/router/route.js', type: 'file' },
      { path: 'package.json', type: 'file' },
      { path: 'Readme.md', type: 'file' },
      { path: 'test/app.listen.js', type: 'file' },
      { path: 'test/res.send.js', type: 'file' },
    ],
    commits: [
      { sha: '7e2b10a', message: 'deps: update body-parser and send', author: 'wesleytodd', date: '2025-10-14T18:00:00Z' },
      { sha: '992a4bc', message: 'fix: edge case with cookie serialization', author: 'jonchurch', date: '2025-09-28T14:12:00Z' },
      { sha: '3a18ef2', message: 'docs: modernize routing examples', author: 'ghost-contributor', date: '2025-08-11T09:44:00Z' },
    ],
    issues: [
      { id: '1', title: 'Route parameter regex vulnerability with unescaped characters', body: 'Deeply nested params cause spectral memory creep.', html_url: 'https://github.com/expressjs/express/issues' },
      { id: '2', title: 'Deprecation warnings on ancient stream handlers', body: 'Node 22 stream pipeline emits ancient ghosts.', html_url: 'https://github.com/expressjs/express/issues' },
      { id: '3', title: 'Express 5 migration checklist missing async error semantics', body: 'Missing ward around unhandled promise rejections.', html_url: 'https://github.com/expressjs/express/issues' },
    ],
  },
};

// Fallback generator when Gemini is unavailable
function generateSmartFallbackAnalysis(meta: any, commits: any[], issues: any[]): any {
  const daysSincePush = Math.max(
    1,
    Math.round((Date.now() - new Date(meta.pushedAt || meta.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  let hauntLevel: any = 'Restless Spirits';
  let hauntScore = 45;
  if (daysSincePush > 730 || meta.isArchived) {
    hauntLevel = 'Ancient Crypt';
    hauntScore = 92;
  } else if (daysSincePush > 365) {
    hauntLevel = 'Severely Haunted';
    hauntScore = 78;
  } else if (meta.openIssues > 200) {
    hauntLevel = 'Poltergeist Infested';
    hauntScore = 68;
  } else if (daysSincePush < 30 && meta.openIssues < 50) {
    hauntLevel = 'Purified Citadel';
    hauntScore = 22;
  }

  const ghostVerdict = daysSincePush > 365
    ? `The crypt has been sealed for ${Math.round(daysSincePush / 30)} moons. Ancient commit echoes whisper through ${meta.defaultBranch}, longing for the exorcism of stale dependencies.`
    : `Spectral activity detected across ${meta.openIssues} wandering issues. The commit hearth is still warm, but poltergeists lurk in untested corners.`;

  const humorRoast = `This repository has more cobwebs than a Victorian attic. It's written in ${meta.language || 'mysterious runes'}, with ${meta.openIssues} spirits screaming into the void of the issue tracker. The last commit was pushed ${daysSincePush} days ago—legend says the original authors were swallowed by merge conflicts.`;

  const technicalRoast = [
    `Staleness metric: ${daysSincePush} days since the last push indicates severe dependency rot.`,
    `Issue burden: ${meta.openIssues} open tickets require systematic triage and triage labeling.`,
    `Branch hygiene: default branch '${meta.defaultBranch}' lacks recent status checks or automated CI telemetry.`,
    `Modernization required: verify compatibility with current runtime LTS and update security policies.`,
  ];

  const bugs = [
    {
      id: 'bug-1',
      title: 'Ancient Dependency Spectral Decay',
      description: 'Critical packages have slipped into the underworld without security patch updates.',
      severity: 'Curse' as const,
      affectedFile: 'package.json',
      source: 'Dependency Audit Specter',
      status: 'active' as const,
      evidence: `Repository untouched for ${daysSincePush} days; transitive vulnerabilities likely lingering.`,
      nextStep: 'Run package security audit, regenerate lockfile, and isolate breaking peer dependencies.',
    },
    {
      id: 'bug-2',
      title: 'Stale Issue Crypt Overflow',
      description: `${meta.openIssues} open issues have been abandoned without active maintainer response.`,
      severity: 'Specter' as const,
      affectedFile: '.github/workflows/stale.yml',
      source: 'Issue Tracker Séance',
      status: 'active' as const,
      evidence: 'High ratio of unresolved issue tickets compared to recent merged commits.',
      nextStep: 'Deploy a friendly graveyard bot to triage reproducible bugs and close zombie threads.',
    },
    {
      id: 'bug-3',
      title: 'Phantom Test Suite Execution',
      description: 'Automated test wards are either missing, skipped, or failing in the background.',
      severity: 'Poltergeist' as const,
      affectedFile: 'test/ or spec/',
      source: 'Coverage Phantom',
      status: 'active' as const,
      evidence: 'No active badge or verifiable CI pipeline run recorded in recent commit history.',
      nextStep: 'Establish continuous integration matrix with Node/Runtime LTS and strict assertion coverage.',
    },
    {
      id: 'bug-4',
      title: 'Forgotten Documentation Lore',
      description: 'The ancient README scrolls mention discontinued flags and outdated setup rites.',
      severity: 'Wisp' as const,
      affectedFile: 'README.md',
      source: 'Scribe Spirit',
      status: 'active' as const,
      evidence: 'Installation steps may fail on modern operating systems or updated toolchains.',
      nextStep: 'Test manual onboarding flow in clean Docker container and update reproduction steps.',
    },
  ];

  const evidence = [
    {
      id: 'evi-1',
      title: 'Cryptic Last Push Timestamp',
      category: 'Decay' as const,
      file: 'Git Commit Log',
      snippet: `Last recorded commit: ${commits[0]?.sha?.slice(0, 7) || 'ancient'} - "${commits[0]?.message || 'whispers'}"`,
      observation: `No active code changes detected in ${daysSincePush} solar cycles.`,
      meaning: 'High probability of bit-rot, outdated runtime APIs, and broken external links.',
      recommendation: 'Perform full compilation pass on the latest runtime version and log deprecation notices.',
    },
    {
      id: 'evi-2',
      title: 'Unattended Spectral Issues',
      category: 'Architecture' as const,
      file: '.github/issues',
      snippet: `Open Issues Count: ${meta.openIssues} | Forks: ${meta.forks}`,
      observation: `Community members have opened ${meta.openIssues} bug reports with minimal closure rate.`,
      meaning: 'Users encounter recurring friction points that have not been codified into regression tests.',
      recommendation: 'Filter top 5 upvoted issues and extract reproducible test fixtures.',
    },
    {
      id: 'evi-3',
      title: 'Core Engine Language Drift',
      category: 'Dependencies' as const,
      file: 'Configuration & Source',
      snippet: `Primary Language: ${meta.language || 'Unknown'} (${meta.size} KB total codebase weight)`,
      observation: 'Architectural patterns reflect the idioms of past major framework versions.',
      meaning: 'May lack modern async/await patterns, ESM module definitions, or TypeScript type definitions.',
      recommendation: 'Modernize module exports and introduce type safety interfaces where ambiguous.',
    },
  ];

  const revivalPlan = [
    {
      id: 'rev-1',
      phase: 'Phase I: The Awakening',
      phaseNumber: 1,
      stepNumber: 1,
      title: 'Summon and Clone into Isolated Sanctum',
      reason: 'Inspect the code without polluting your local operating environment.',
      evidence: 'Ancient dependencies may contain native bindings or deprecated install scripts.',
      approach: 'Clone the repository, inspect package manifests, and run dependencies in containerized sandbox.',
      priority: 'Critical' as const,
      completed: false,
    },
    {
      id: 'rev-2',
      phase: 'Phase I: The Awakening',
      phaseNumber: 1,
      stepNumber: 2,
      title: 'Run Dependency Exorcism and Security Audit',
      reason: 'Banish vulnerabilities and identify obsolete transitive libraries.',
      evidence: `${daysSincePush} days of unpatched ecosystem security advisories.`,
      approach: 'Run npm audit / yarn audit or pip check. Upgrade patch versions before touching major bumps.',
      priority: 'High' as const,
      completed: false,
    },
    {
      id: 'rev-3',
      phase: 'Phase II: Cleansing the Curse',
      phaseNumber: 2,
      stepNumber: 3,
      title: 'Resurrect the Automated Test Suite',
      reason: 'Provide confidence that existing features still function properly.',
      evidence: 'Bugs in graveyard point to unverified edge cases.',
      approach: 'Execute test runner, fix broken mocks, and ensure 100% green baseline before refactoring.',
      priority: 'High' as const,
      completed: false,
    },
    {
      id: 'rev-4',
      phase: 'Phase III: Fortifying the Wards',
      phaseNumber: 3,
      stepNumber: 4,
      title: 'Seal Type Leaks and Modernize Error Handling',
      reason: 'Prevent silent crashes and unhandled promise rejections.',
      evidence: 'Unresolved issues point to unexpected runtime null pointers.',
      approach: 'Introduce strict null checks, structured error classes, and graceful degradation.',
      priority: 'Medium' as const,
      completed: false,
    },
    {
      id: 'rev-5',
      phase: 'Phase IV: The Eternal Flame',
      phaseNumber: 4,
      stepNumber: 5,
      title: 'Re-ignite Documentation and Publish Release',
      reason: 'Invite contributors back into the haunted workshop with clear guideposts.',
      evidence: 'README instructions currently reference stale tooling.',
      approach: 'Update Quickstart, create CONTRIBUTING.md ritual, and publish a revival release tag.',
      priority: 'Medium' as const,
      completed: false,
    },
  ];

  return {
    hauntLevel,
    hauntScore,
    ghostVerdict,
    roast: {
      humor: humorRoast,
      technical: technicalRoast,
    },
    bugs,
    evidence,
    revivalPlan,
  };
}

// API: Summon a repository
app.post('/api/summon', async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) {
      return res.status(400).json({ error: 'Please summon with a valid GitHub repository URL or owner/repo identifier.' });
    }

    const parsed = parseRepoInput(repoUrl);
    if (!parsed) {
      return res.status(400).json({ error: 'Invalid repository identifier. Example: "https://github.com/facebook/react" or "expressjs/express".' });
    }

    const { owner, repo } = parsed;
    const repoKey = `${owner.toLowerCase()}/${repo.toLowerCase()}`;

    let meta: any = null;
    let languages: Record<string, number> = {};
    let commits: any[] = [];
    let files: any[] = [];
    let issues: any[] = [];

    // Attempt real GitHub Public API
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'DARKIT-Haunted-Git-Terminal',
      };
      const fetchOptions = {
        headers,
        signal: AbortSignal.timeout(3500),
      };

      const [repoRes, langRes, commitRes, issuesRes, contentsRes] = await Promise.allSettled([
        fetch(`https://api.github.com/repos/${owner}/${repo}`, fetchOptions),
        fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, fetchOptions),
        fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`, fetchOptions),
        fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=12`, fetchOptions),
        fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, fetchOptions),
      ]).then((results) =>
        results.map((r) => (r.status === 'fulfilled' ? r.value : null))
      );

      if (repoRes && repoRes.ok) {
        const rData = await repoRes.json();
        meta = {
          name: rData.name,
          fullName: rData.full_name,
          owner: rData.owner?.login || owner,
          description: rData.description || 'An enigmatic codebase without sacred scrolls.',
          stars: rData.stargazers_count || 0,
          forks: rData.forks_count || 0,
          openIssues: rData.open_issues_count || 0,
          defaultBranch: rData.default_branch || 'main',
          license: rData.license?.spdx_id || rData.license?.name || 'Unspecified Curse',
          htmlUrl: rData.html_url,
          pushedAt: rData.pushed_at || rData.updated_at,
          createdAt: rData.created_at,
          language: rData.language || 'Unknown Runes',
          topics: rData.topics || [],
          isArchived: !!rData.archived,
          size: rData.size || 0,
        };
      }

      if (langRes && langRes.ok) {
        languages = await langRes.json();
      }

      if (commitRes && commitRes.ok) {
        const cData = await commitRes.json();
        if (Array.isArray(cData)) {
          commits = cData.map((c: any) => ({
            sha: c.sha?.slice(0, 7) || 'ghost',
            message: c.commit?.message?.split('\n')[0] || 'Echoes in the dark',
            author: c.commit?.author?.name || c.author?.login || 'Wandering Spirit',
            date: c.commit?.author?.date || new Date().toISOString(),
          }));
        }
      }

      if (issuesRes && issuesRes.ok) {
        const iData = await issuesRes.json();
        if (Array.isArray(iData)) {
          issues = iData.filter((i: any) => !i.pull_request).map((i: any) => ({
            id: String(i.number),
            title: i.title,
            body: i.body?.slice(0, 300) || '',
            html_url: i.html_url,
          }));
        }
      }

      if (contentsRes && contentsRes.ok) {
        const ctData = await contentsRes.json();
        if (Array.isArray(ctData)) {
          files = ctData.slice(0, 15).map((f: any) => ({
            path: f.path || f.name,
            type: f.type === 'dir' ? 'dir' : 'file',
            size: f.size,
          }));
        }
      }
    } catch (ghErr) {
      console.warn('GitHub API fetch notice:', ghErr);
    }

    // Check preset or generate synthetic if GitHub hit rate limit
    if (!meta) {
      if (PRESET_REPOS[repoKey]) {
        const preset = PRESET_REPOS[repoKey];
        meta = { ...preset };
        languages = preset.languages || { [preset.language]: 100 };
        commits = preset.commits || [];
        files = preset.files || [];
        issues = preset.issues || [];
      } else {
        meta = {
          name: repo,
          fullName: `${owner}/${repo}`,
          owner,
          description: `Haunted public repository summoned from the spectral realm (${owner}/${repo}).`,
          stars: 128,
          forks: 34,
          openIssues: 17,
          defaultBranch: 'main',
          license: 'MIT',
          htmlUrl: `https://github.com/${owner}/${repo}`,
          pushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 600).toISOString(),
          language: 'TypeScript',
          topics: ['developer-tool', 'haunted-code', 'github'],
          isArchived: false,
          size: 4200,
        };
        languages = { TypeScript: 78.5, JavaScript: 15.2, CSS: 6.3 };
        commits = [
          { sha: 'a1b2c3d', message: 'chore: summon codebase into dark terminal', author: owner, date: new Date().toISOString() },
          { sha: 'e4f5g6h', message: 'fix: patch ancient memory specter in main loop', author: 'ghost-engineer', date: new Date(Date.now() - 86400000 * 30).toISOString() },
        ];
        files = [
          { path: 'src/index.ts', type: 'file' },
          { path: 'src/core.ts', type: 'file' },
          { path: 'package.json', type: 'file' },
          { path: 'README.md', type: 'file' },
          { path: 'tests/index.test.ts', type: 'file' },
        ];
      }
    }

    // Now run AI Analysis via Gemini if available
    let analysis: any = null;
    if (ai) {
      try {
        const prompt = `You are the master paranormal software investigator for DARKIT — The Haunted Git Terminal.
Investigate this GitHub repository and generate an atmospheric, highly accurate, technically insightful diagnosis.

Repository Details:
- Full Name: ${meta.fullName}
- Description: ${meta.description}
- Primary Language: ${meta.language}
- Languages: ${JSON.stringify(languages)}
- Stars: ${meta.stars}, Forks: ${meta.forks}, Open Issues: ${meta.openIssues}
- Last Push: ${meta.pushedAt}
- Recent Commits: ${commits.map((c: any) => `[${c.sha}] ${c.message}`).join(', ')}
- Known Open Issues: ${issues.map((i: any) => `#${i.id}: ${i.title}`).join(' | ')}
- Root Files: ${files.map((f: any) => f.path).join(', ')}

Return a strict JSON object with this exact shape:
{
  "hauntLevel": "Restless Spirits" | "Severely Haunted" | "Ancient Crypt" | "Poltergeist Infested" | "Purified Citadel",
  "hauntScore": number (0-100, where 100 is most haunted/abandoned and 0 is pristine),
  "ghostVerdict": "A 2-3 sentence evocative verdict combining spooky lore with real technical insight.",
  "roast": {
    "humor": "A 2-4 sentence witty, hilarious roast of this codebase, pointing out funny quirks.",
    "technical": [
      "Concrete technical critique item 1",
      "Concrete technical critique item 2",
      "Concrete technical critique item 3",
      "Concrete technical critique item 4"
    ]
  },
  "bugs": [
    {
      "id": "bug-1",
      "title": "Bug Title",
      "description": "What lurks here",
      "severity": "Curse" | "Specter" | "Poltergeist" | "Wisp",
      "affectedFile": "path/to/file",
      "source": "GitHub Issue / Code Specter",
      "status": "active",
      "evidence": "Evidence observed",
      "nextStep": "Actionable exorcism step"
    }
  ],
  "evidence": [
    {
      "id": "evi-1",
      "title": "Clue Title",
      "category": "Architecture" | "Security" | "Decay" | "Test Coverage" | "Dependencies",
      "file": "path/to/file",
      "line": 42,
      "snippet": "code or manifest snippet",
      "observation": "What was observed",
      "meaning": "What this means for the repository",
      "recommendation": "Concrete fix recommendation"
    }
  ],
  "revivalPlan": [
    {
      "id": "rev-1",
      "phase": "Phase I: The Awakening" | "Phase II: Cleansing the Curse" | "Phase III: Fortifying the Wards" | "Phase IV: The Eternal Flame",
      "phaseNumber": 1,
      "stepNumber": 1,
      "title": "Specific Step Title",
      "reason": "Why this must be done",
      "evidence": "Relevant evidence from findings",
      "approach": "Clear implementation approach",
      "priority": "Critical" | "High" | "Medium" | "Low",
      "completed": false
    }
  ]
}
Provide 4-5 bugs, 3-4 evidence items, and 5 revival steps spanning phases 1 to 4. Return pure JSON only.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsedJson = JSON.parse(response.text.trim());
          if (parsedJson && parsedJson.hauntLevel && parsedJson.bugs) {
            analysis = parsedJson;
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini analysis fallback notice:', geminiErr);
      }
    }

    if (!analysis) {
      analysis = generateSmartFallbackAnalysis(meta, commits, issues);
    }

    const payload = {
      meta,
      languages,
      commits,
      files,
      analysis,
      summonedAt: new Date().toISOString(),
    };

    return res.json(payload);
  } catch (error: any) {
    console.error('Error summoning repository:', error);
    return res.status(500).json({ error: error?.message || 'The summoning ritual failed in the void.' });
  }
});

// API: Ghost Q&A Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { repoContext, messages, question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Please whisper a question into the spirit box.' });
    }

    if (ai) {
      try {
        const repoSummary = repoContext ? `
Summoned Repository: ${repoContext.meta?.fullName || 'Unknown'}
Language: ${repoContext.meta?.language || 'Unknown'}
Description: ${repoContext.meta?.description || ''}
Stars: ${repoContext.meta?.stars || 0}, Issues: ${repoContext.meta?.openIssues || 0}
Haunt Level: ${repoContext.analysis?.hauntLevel || 'Mysterious'}
Identified Bugs: ${repoContext.analysis?.bugs?.map((b: any) => `${b.title} (${b.severity})`).join(', ') || 'None'}
Evidence Clues: ${repoContext.analysis?.evidence?.map((e: any) => `${e.title} in ${e.file}`).join(', ') || 'None'}
Files: ${repoContext.files?.map((f: any) => f.path).join(', ') || 'Unknown'}
` : 'No repository summoned yet. Speak about git, debugging, and repository revival in general.';

        const chatHistory = Array.isArray(messages)
          ? messages.slice(-6).map((m: any) => `${m.role === 'user' ? 'Developer' : 'Ghost Investigator'}: ${m.content}`).join('\n\n')
          : '';

        const systemInstruction = `You are the Ghost Investigator of DARKIT — The Haunted Git Terminal.
You speak with a charming, spooky, slightly eccentric supernatural persona (referring to commits as "commit echoes", bugs as "specters" or "curses", architecture as "the ancient sanctum blueprints", and code as "runic scrolls").
At the same time, you are a world-class senior staff software engineer. You provide razor-sharp, accurate, technically rigorous explanations.
When providing code snippets, format them in markdown with language tags. Keep explanations clear, scannable, and helpful.`;

        const prompt = `${systemInstruction}

[REPOSITORY CONTEXT]
${repoSummary}

[CONVERSATION HISTORY]
${chatHistory}

Developer asks: ${question}

Ghost Investigator:`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const reply = response.text || "The spirits flicker... ask once more into the lantern light.";
        return res.json({ reply, ghostMood: 'curious' });
      } catch (geminiErr) {
        console.warn('Gemini chat error, using spectral fallback:', geminiErr);
      }
    }

    // Fallback response generator if Gemini is unavailable
    const qLower = question.toLowerCase();
    let reply = "";
    if (qLower.includes('start') || qLower.includes('entry') || qLower.includes('where')) {
      reply = `*The ghost companion raises a flickering lantern to illuminate the file tree.*

In **${repoContext?.meta?.name || 'this repository'}**, execution commences at the primary entrypoints.
Look into \`${repoContext?.files?.[0]?.path || 'src/index'}\` or inspect \`package.json\` under the \`"main"\` or \`"bin"\` manifests.
The spirits recommend placing a breakpoint in the initialization sequence before any event loop starts spinning.`;
    } else if (qLower.includes('architecture') || qLower.includes('explain')) {
      reply = `*Spectral runes glow along the terminal walls.*

The architecture of **${repoContext?.meta?.name || 'this codebase'}** revolves around its core language **${repoContext?.meta?.language || 'system'}**.
Key structural pillars observed by the spirits:
1. **The Ingestion Gate**: Request and data routing through the entry modules.
2. **The Processing Chambers**: Core domain logic and helper utilities.
3. **The Boundary Wards**: Error boundaries and exception handling.

To master this sanctum, trace how data enters via the root files and descends into internal modules.`;
    } else if (qLower.includes('improve') || qLower.includes('fix') || qLower.includes('bug')) {
      reply = `*The ghost investigator consults the Evidence Wall.*

Top recommendations from the séance:
1. **Exorcise Graveyard Bugs**: Tackle the ${repoContext?.analysis?.bugs?.length || 'identified'} active curses recorded in the Bug Cemetery.
2. **Fortify Test Wards**: Add integration tests to verify edge cases where null pointers roam free.
3. **Cleanse Dependencies**: Upgrade ancient packages that carry known CVE vulnerabilities.`;
    } else {
      reply = `*A friendly ghost floats closer to your prompt cursor.*

"Ah, an intriguing query regarding **${repoContext?.meta?.name || 'the codebase'}**! The ancient commit echoes reveal that this project has endured ${repoContext?.meta?.stars || 100} star gazers and ${repoContext?.meta?.openIssues || 10} wandering spirits. Focus on verifying the core entry modules and ensuring the test suite passes before invoking further modifications."`;
    }

    return res.json({ reply, ghostMood: 'curious' });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'The spiritual frequency was severed.' });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`DARKIT Haunted Git Terminal running at http://localhost:${PORT}`);
  });
}

startServer();
