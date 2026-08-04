export type Evidence = {

    id: string;

    type:
        | "practice"
        | "reflection"
        | "achievement"
        | "identity"
        | "memory";

    strength: number;

    confidence: number;

    description: string;
};

export type Pattern = {

    id: string;

    description: string;

    evidence: Evidence[];

    confidence: number;
};

export type Conclusion = {

    id: string;

    summary: string;

    reasoning: string;

    confidence: number;

    supportingPatterns: Pattern[];
};

export type Recommendation = {

    id: string;

    title: string;

    explanation: string;

    priority:
        | "low"
        | "medium"
        | "high";
};