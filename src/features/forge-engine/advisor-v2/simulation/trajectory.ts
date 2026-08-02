import type {
  Trajectory,
} from "./simulation.types";

export function determineTrajectory(
  confidence: number,
): Trajectory {
  if (confidence >= 0.85) {
    return "accelerating";
  }

  if (confidence >= 0.65) {
    return "steady";
  }

  if (confidence >= 0.45) {
    return "plateau";
  }

  if (confidence > 0) {
    return "declining";
  }

  return "uncertain";
}