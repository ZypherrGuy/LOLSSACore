export enum GenderTypeEnum {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export const GENDER_TYPES = ['Male', 'Female', 'Other'] as const;
export type GenderType = typeof GENDER_TYPES[number];