import { JwtPayload } from "jsonwebtoken";

export interface IJwtService {
  createAccessToken(userId: string): Promise<{ accessToken: string }>;
  createRefreshToken(userId: string, deviceId: string): Promise<string>;
  getUserIdByAccessToken(token: string): Promise<string | null>;
  validateRefreshToken(refreshToken: string): Promise<JwtPayload>;
}
