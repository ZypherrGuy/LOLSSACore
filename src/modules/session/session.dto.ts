export interface SessionDTO {
  id: string;
  playerId: string;
  createdAt: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}