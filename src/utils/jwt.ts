import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";

export interface TokenPayload {
  userId: string;
  role: string;
}

export interface JwtPayload {
  jti: string;
  exp: number;
  iat: number;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-token-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret";

// Generate Access Token (15m)
export const generateAccessToken = (payload: TokenPayload): string => {
  const accessTokenJti = crypto.randomUUID();

  const options:SignOptions=
  {
    expiresIn: "15m",
    jwtid: accessTokenJti
  }
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
};

// Generate Refresh Token (7d)
export const generateRefreshToken = (payload: TokenPayload): string => {
  const refreshTokenJti = crypto.randomUUID();

  const options:SignOptions=
  {
    expiresIn: "7d",
    jwtid: refreshTokenJti
  }
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};

// Verify Refresh Token (Uses REFRESH_TOKEN_SECRET)
export const verifyRefreshToken = (token: string): TokenPayload => {
  const cleanToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
  return jwt.verify(cleanToken, REFRESH_TOKEN_SECRET) as TokenPayload;
};

// Verify Access Token (Uses ACCESS_TOKEN_SECRET)
export const verifyAccessToken = (token: string): TokenPayload => {
  const cleanToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
  return jwt.verify(cleanToken, ACCESS_TOKEN_SECRET) as TokenPayload;
};

// SHA-256 Hash Helper
export const hashed = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};