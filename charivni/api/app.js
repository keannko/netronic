import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { adminRouter, mediaRouter } from './admin/routes.js';
import { usersRouter } from './users/routes.js';
import authMiddleware from './middlewares/auth-middleware.js';
import { pathToFileURL } from 'url';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/media', mediaRouter);

// These sections will receive their own MongoDB repositories later.
for (const route of ['/products', '/orders', '/blog']) {
  app.get(route, authMiddleware, (req, res) => res.json([]));
  app.use(route, authMiddleware, (req, res) => res.status(501).json({ message: 'Розділ поки не підключено.' }));
}

app.get('/', (req, res) => res.json({ name: 'SKIFTECH API', storage: 'memory' }));
app.use((req, res) => res.status(404).json({ message: 'Маршрут не знайдено.' }));
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ message: error.status === 400 ? 'Некоректний запит.' : 'Внутрішня помилка сервера.' });
});

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
}