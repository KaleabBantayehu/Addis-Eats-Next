import { createHmac, timingSafeEqual } from "node:crypto";

const DEVELOPMENT_SECRET = "addis-eats-local-development-session-secret";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production.");
  }

  return DEVELOPMENT_SECRET;
}

function sign(payload) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(userId) {
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token, users) {
  if (typeof token !== "string") return null;

  const separator = token.indexOf(".");
  if (separator < 1 || separator !== token.lastIndexOf(".")) return null;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const user = users.find((candidate) => candidate.id === claims.sub);

    if (!user || !Number.isInteger(claims.exp) || claims.exp <= Date.now() / 1000) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch {
    return null;
  }
}
