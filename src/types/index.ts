export interface RepoMetadata {
  name: string;
  fullName: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  license?: string;
  htmlUrl: string;
  pushedAt: string;
  createdAt: string;
  language: string;
  topics: string[];
  isArchived: boolean;
  size: number;
}

export interface CommitItem {
  sha: string;
  message: string;
  author: string;
  date: string;
  hauntedReason?: string;
}

export interface FileItem {
  path: string;
  type: 'file' | 'dir';
  size?: number;
  hauntTag?: string;
}

export interface BugItem {
  id: string;
  title: string;
  description: string;
  severity: 'Curse' | 'Specter' | 'Poltergeist' | 'Wisp';
  affectedFile?: string;
  source: string;
  status: 'active' | 'exorcised';
  evidence: string;
  nextStep: string;
  exorcisedAt?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  category: 'Architecture' | 'Security' | 'Decay' | 'Test Coverage' | 'Dependencies';
  file: string;
  line?: number;
  snippet: string;
  observation: string;
  meaning: string;
  recommendation: string;
}

export interface RevivalStep {
  id: string;
  phase: string;
  phaseNumber: number;
  stepNumber: number;
  title: string;
  reason: string;
  evidence: string;
  approach: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface HauntAnalysis {
  hauntLevel: 'Restless Spirits' | 'Severely Haunted' | 'Ancient Crypt' | 'Poltergeist Infested' | 'Purified Citadel';
  hauntScore: number; // 0-100 (100 is most haunted / in need of revival)
  ghostVerdict: string;
  roast: {
    humor: string;
    technical: string[];
  };
  bugs: BugItem[];
  evidence: EvidenceItem[];
  revivalPlan: RevivalStep[];
}

export interface SummonedRepository {
  meta: RepoMetadata;
  languages: Record<string, number>;
  commits: CommitItem[];
  files: FileItem[];
  analysis: HauntAnalysis;
  summonedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  ghostMood?: 'sleepy' | 'curious' | 'excited' | 'detective' | 'lantern';
}

export type GhostCompanionId = 'lost-spirit' | 'curious-phantom' | 'code-detective' | 'bug-exorcist' | 'repository-guardian';

export interface GhostEvolution {
  id: GhostCompanionId;
  name: string;
  title: string;
  minLevel: number;
  description: string;
  badge: string;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  max: number;
  icon: string;
  rewardXP: number;
}

export interface DailyHauntTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
}

export interface DailyHauntState {
  title: string;
  subtitle: string;
  tasks: DailyHauntTask[];
  claimed: boolean;
  expiresAt: string;
}
