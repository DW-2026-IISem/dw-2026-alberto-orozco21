import { randomUUID } from "node:crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors/app-error";

const ALGORITHM = "HS256";

export const TOKEN_ISSUER = "enlace-express";
export const TOKEN_AUDIENCE = "enlace-express-api";

function readAccessTokenTtl(): number {
  const raw = process.env.JWT_ACCESS_TTL ?? "900";
  const ttl = Number(raw);
  if (!Number.isSafeInteger(ttl) || ttl < 1) {
    throw new AppError(500, "JWT_ACCESS_TTL must be a positive integer");
  }
  return ttl;
}

export const ACCESS_TOKEN_TTL_SECONDS = readAccessTokenTtl();

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  username: string;
  jti: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new AppError(500, "JWT_SECRET is not configured or is shorter than 32 characters");
  }
  return secret;
}

export function signAccessToken(user: { id: number; username: string }): {
  token: string;
  expiresIn: number;
} {
  if (!Number.isSafeInteger(user.id) || user.id < 1 || !user.username.trim()) {
    throw new AppError(500, "Cannot issue an access token for an invalid user");
  }

  const token = jwt.sign(
    { username: user.username },
    getSecret(),
    {
      algorithm: ALGORITHM,
      subject: String(user.id),
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      jwtid: randomUUID(),
    }
  );
  return { token, expiresIn: ACCESS_TOKEN_TTL_SECONDS };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const secret = getSecret();
  let payload: JwtPayload;

  try {
    const verified = jwt.verify(token, secret, {
      algorithms: [ALGORITHM],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
      clockTolerance: 5,
    });

    if (typeof verified !== "object" || verified === null) {
      throw new AppError(401, "Invalid or expired access token");
    }
    payload = verified;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(401, "Invalid or expired access token");
  }

  if (
    typeof payload.sub !== "string" ||
    !/^[1-9]\d*$/.test(payload.sub) ||
    typeof payload.jti !== "string" ||
    payload.jti.length === 0 ||
    typeof payload.exp !== "number" ||
    typeof payload.username !== "string" ||
    payload.username.length === 0
  ) {
    throw new AppError(401, "Invalid or expired access token");
  }

  return payload as AccessTokenPayload;
}

export function extractBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const match = /^Bearer ([^\s]+)$/i.exec(header);
  return match?.[1] ?? null;
}
