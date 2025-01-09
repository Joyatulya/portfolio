export enum SexTypes{
  MALE = 'M',
  FEMALE = 'F'
}

export enum AgeGroupTypes {
  CHILD = 'C',
  ADULT = 'A',
  ELDERLY = 'E'
}

export interface IBasicPatient{
  age : AgeGroupTypes
  sex: SexTypes
  weight: number
  height?: number
}

export interface ISodiumPatient extends IBasicPatient {
  insensible_losses: any;
  other_losses: number;
  urinary_losses: number;
  curr_sodium : number;
  target_sodium: number;
  correction_rate: number;
  correction_fluid_na: number;
}