export enum RoleTypeEnum {
  Player = 'Player',
  Coach = 'Coach',
  Manager = 'Manager',
  Admin = 'Admin',
}

export const ROLE_TYPES = ['Player', 'Coach', 'Manager', 'Admin'] as const;
export type RoleType = typeof ROLE_TYPES[number];