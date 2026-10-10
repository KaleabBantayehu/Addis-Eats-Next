import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken } from "./session-token";
import { sessionProfiles } from "./session-profiles";

const COOKIE_NAME = "session";

const demoPasswords = {
  usr_1: "admin123",
  usr_2: "ermi123",
  usr_3: "addis@password",
};

const users = sessionProfiles.map((profile) => ({
  ...profile,
  password: demoPasswords[profile.id],
}));

const profilesById = sessionProfiles.map(({ id, name, email, role }) => ({
  id,
  name,
  email,
  role,
}));

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifySessionToken(token, profilesById);
}

export async function createSession(email, password) {
  const cookieStore = await cookies();
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const suppliedPassword = String(password ?? "");
  const user = users.find(
    (candidate) =>
      candidate.email.toLowerCase() === normalizedEmail &&
      candidate.password === suppliedPassword,
  );
  
  if (!user) return null;

  cookieStore.set(COOKIE_NAME, createSessionToken(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}