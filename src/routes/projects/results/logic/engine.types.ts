import { z } from "zod";

export enum Severity {
  MILD = 'Mild',
  MODERATE = 'Moderate',
  SEVERE = 'Severe'
}

export enum AnalysisLevel {
  LEVEL_1 = 100, // single parameter
  LEVEL_2 = 95, // Dual parameter
  LEVEL_3 = 90 // More complex
}
