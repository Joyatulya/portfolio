/**
 *
 * References
 * - https://pmc.ncbi.nlm.nih.gov/articles/instance/3453844/pdf/12291_2008_Article_BF02867409.pdf
 *
 */

type Range = [number, number]


export const DEFAULTS: Record<string, Range> = {
  MALE_HB_RANGE: [13.5, 17.5], // g/dL
  FEMALE_HB_RANGE: [12.0, 15.5], // g/dL
  WBC_RANGE: [4.0, 11.0], // x 10^9/L
  NEUTROPHIL_RANGE: [2.0, 7.5], // x 10^9/L
  LYMPHOCYTE_RANGE: [1.0, 4.0], // x 10^9/L
  PLATELET_RANGE: [150, 450], // x 10^9/L
  RBC_RANGE_MALE: [4.5, 5.5], // x 10^12/L
  RBC_RANGE_FEMALE: [4.0, 5.0], // x 10^12/L
  MCV_RANGE: [80, 100], // fL
  MCH_RANGE: [27, 33], // pg
  RDW_RANGE: [11.5, 14.5], // %

  //KFT
  MALE_CREATININE_RANGE: [0.7, 1.2], // g/dL
  FEMALE_CREATININE_RANGE: [0.5, 1], // g/dL
} as const
