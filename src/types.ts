export type LogType = "action_positive" | "action_negative" | "roadblock" | "feeling";

export interface LogEntry {
  id: string;
  type: LogType;
  tags: string[];
  context: string[];
  content: string;
  intensity: number; // 1 to 5 (e.g., how strong was the feeling, how big was the roadblock)
  timestamp: number;
}

export interface Correlation {
  factorA: string;
  factorB: string;
  insight: string;
}

export interface CognitiveInsights {
  summary: string;
  correlations: Correlation[];
  preemptiveGuidance: string[];
}

export interface ScreenTimeLog {
  id: string;
  date: string;
  totalMinutes: number;
  socialMinutes: number;
  timestamp: number;
}
