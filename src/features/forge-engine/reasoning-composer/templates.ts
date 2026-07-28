export function openingSentence(
  belief: string,
): string {
  return `Forge currently believes ${belief}.`;
}

export function contradictionSentence(
  contradiction?: string,
): string {
  if (!contradiction) {
    return "";
  }

  return `However, Forge has detected ${contradiction}.`;
}

export function predictionSentence(
  prediction?: string,
): string {
  if (!prediction) {
    return "";
  }

  return `If current trends continue, ${prediction}.`;
}