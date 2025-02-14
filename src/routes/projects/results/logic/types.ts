import { z } from "zod";

export const zUser = z.object({
  weight: z.coerce.number().min(0).max(500).default(60),
  age: z.coerce.number().min(0).max(120).default(50),
  isMale: z.coerce.boolean().default(true),
});

export const zFBC = z.object({
  hb: z.coerce.number().min(0).max(250).optional(),
  plt: z.coerce.number().min(0).max(10_00_000).optional(),
  wbc: z.coerce.number().min(0).max(500).optional(),
  neut: z.coerce.number().min(0).max(500).optional(),
  mcv: z.coerce.number().min(50).max(150).optional(),
});

export const zKFT = z.object({
  na: z.coerce.number().positive().max(200).optional(),
  k: z.coerce.number().positive().max(11).optional(),
  creatinine: z.coerce.number().optional(),
  urea: z.coerce.number().positive().optional(),
});

export const zInferenceValues = zUser.merge(zFBC).merge(zKFT);

export type InferenceValues = z.infer<typeof zInferenceValues>;

