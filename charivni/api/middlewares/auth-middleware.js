import { getUserDataAccess } from '../users/dataAccess.js';
import { validateAccessToken } from '../services/token-service.js';

export default async function (req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  const user = scheme === 'Bearer' ? validateAccessToken(token) : null;
  if (!user) return res.status(401).json({ message: 'Увійдіть до облікового запису.' });
  const current = await getUserDataAccess(user.userID);
  if (!current) return res.status(401).json({ message: 'Увійдіть до облікового запису.' });
  req.user = { ...user, role: current.role };
  next();
}

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Недостатньо прав доступу.' });
  next();
};