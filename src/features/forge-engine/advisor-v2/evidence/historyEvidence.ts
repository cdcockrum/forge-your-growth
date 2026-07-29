import type {
  HistoryEvent,
  HistoryResult,
} from "../../history";

import type {
  AdvisorEvidence,
} from "../advisor.types";

function normalizeImportance(
  importance: number,
): number {
  return Math.max(
    0,
    Math.min(1, importance),
  );
}

function buildHistoryEvidenceItem(
  event: HistoryEvent,
  highlightIds: Set<string>,
): AdvisorEvidence {
  const confidence = normalizeImportance(
    event.importance,
  );

  return {
    id: `history-${event.id}`,
    category: "history",
    source: event.type,
    statement: `${event.title}: ${event.description}`,
    confidence,
    impact: confidence,
    polarity: "positive",
    tags: [
      "history",
      event.type,
      ...(highlightIds.has(event.id)
        ? ["highlight"]
        : []),
    ],
  };
}

export function buildHistoryEvidence(
  history: HistoryResult,
): AdvisorEvidence[] {
  const highlightIds = new Set(
    history.highlights.map(
      (event) => event.id,
    ),
  );

  return history.events.map(
    (event) =>
      buildHistoryEvidenceItem(
        event,
        highlightIds,
      ),
  );
}