export interface LoginResponse {
  email: string;
  fullName: string;
  token: string;
  expirationToken: Date;
  refreshToken: string;
  refreshTokenExpiration: Date;
}
