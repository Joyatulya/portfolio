/**
 *
 * References
 * - https://pmc.ncbi.nlm.nih.gov/articles/instance/3453844/pdf/12291_2008_Article_BF02867409.pdf
 *
 */

type Range = [number, number]

export const DEFAULT_WEIGHT = 60
export const DEFAULT_HEIGHT = 160
export const DEFAULT_AGE = 50

export const MALE_HB_RANGE: Range = [12.4, 1634]
export const FEMALE_HB_RANGE: Range = [11, 15.1]
export const MCV_RANGE: Range = [80, 100]
export const PLT_RANGE: Range = [1_50_000, 4_00_000]
export const WBC_RANGE: Range = [4, 10]
