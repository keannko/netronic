import jwt from 'jsonwebtoken';
import { randomBytes, randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'production' && !process.env.NODE_TEST_CONTEXT &&
  (!process.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET.length < 32 || !process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32 || process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET)) {
  throw new Error('Set two different JWT_ACCESS_SECRET and JWT_REFRESH_SECRET values of at least 32 characters for production.');
}

const accessSecret = process.env.JWT_ACCESS_SECRET || randomBytes(32).toString('hex');
const refreshSecret = process.env.JWT_REFRESH_SECRET || randomBytes(32).toString('hex');
const sessions = new Map();

export const tokenService = async (user) => {
  const sessionID = randomUUID();
  const data = { userID: user.userID, name: user.name, email: user.email, role: user.role, sessionID };
  const accessToken = jwt.sign(data, accessSecret, { expiresIn: '5h' });
  const refreshToken = jwt.sign(data, refreshSecret, { expiresIn: '30d' });
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (session.expiresAt <= now) sessions.delete(id);
  }
  sessions.set(sessionID, { userID: user.userID, refreshToken, expiresAt: now + 30 * 24 * 60 * 60 * 1000 });
  return { accessToken, refreshToken };
};

const validateToken = (token, secret) => {
  try {
    const data = jwt.verify(token, secret);
    const session = sessions.get(data.sessionID);
    return session && session.expiresAt > Date.now() ? data : null;
  } catch {
    return null;
  }
};

export const validateAccessToken = token => validateToken(token, accessSecret);
export const validateRefreshToken = token => validateToken(token, refreshSecret);

export const removeToken = (refreshToken) => {
  const data = validateRefreshToken(refreshToken);
  if (data) sessions.delete(data.sessionID);
};
export const removeUserTokens = userID => {
  for (const [id, session] of sessions) {
    if (session.userID === userID) sessions.delete(id);
  }
};
