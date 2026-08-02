export type WisdomInsight = {
  id: string;

  title: string;

  explanation: string;

  confidence: number;

  evidenceIds: string[];
};

export type Wisdom = {
  narrative: string;

  insights: WisdomInsight[];

  longTermThemes: string[];

  emergingIdentity: string[];

  cautions: string[];

  opportunities: string[];

  confidence: number;
};