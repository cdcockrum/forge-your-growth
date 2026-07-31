import {
  useAdvisorAnalysis,
} from "@/features/advisor/hooks";

import {
  ReasoningInspector,
} from "../components";

export function ReasoningInspectorPage() {
  const advisor =
    useAdvisorAnalysis();

  return (
    <main className="container mx-auto px-4 py-8">
      <ReasoningInspector
        reasoning={advisor.reasoning}
      />
    </main>
  );
}