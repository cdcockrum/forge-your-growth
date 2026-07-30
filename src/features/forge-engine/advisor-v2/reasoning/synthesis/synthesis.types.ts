export interface SynthesisResult {
  dominantTheme: string | null;

  priorities: string[];

  opportunities: string[];

  risks: string[];

  summary: string;
}