export interface ValidationIssue {
  code: string;

  severity:
    | "warning"
    | "error";

  message: string;
}

export interface ValidationResult {
  valid: boolean;

  issues: ValidationIssue[];
}