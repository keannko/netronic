import { Router } from 'express';
import multer from 'multer';
import authMiddleware, { adminMiddleware } from '../middlewares/auth-middleware.js';
import { getAllUsersController, getUserByTokenController, getUserController, loginUserController, logoutUserController, refreshController, updateUserController, uploadAvatarController, deleteAvatarController, getWorkHoursController, getBirthdaysController, getWorkdayEntriesController, createWorkdayEntryController, getWorkdayCatalogController } from './controlls.js';

export const usersRouter = Router();

usersRouter.post('/registration', (req, res) => res.status(501).json({ message: 'Реєстрацію поки не підключено.' }));
usersRouter.post('/login', loginUserController);
usersRouter.post('/logout', logoutUserController);
usersRouter.get('/refresh', refreshController);
usersRouter.get('/bytoken', authMiddleware, getUserByTokenController);
usersRouter.patch('/settings', authMiddleware, updateUserController);
const uploadAvatar = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024, files: 1 } });
usersRouter.post('/avatar', authMiddleware, uploadAvatar.single('file'), uploadAvatarController);
usersRouter.delete('/avatar', authMiddleware, deleteAvatarController);
usersRouter.use((error, req, res, next) => res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'Максимальний розмір аватарки — 2 МБ.' : 'Не вдалося завантажити аватарку.' }));
usersRouter.get('/hours', authMiddleware, getWorkHoursController);
usersRouter.get('/birthdays', authMiddleware, getBirthdaysController);
usersRouter.get('/workday-catalog', authMiddleware, getWorkdayCatalogController);
usersRouter.get('/workdays', authMiddleware, getWorkdayEntriesController);
usersRouter.post('/workdays', authMiddleware, createWorkdayEntryController);
usersRouter.get('/:id', authMiddleware, getUserController);
usersRouter.get('/', authMiddleware, adminMiddleware, getAllUsersController);
