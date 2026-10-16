import * as services from './services.js';
import { tokenService } from '../services/token-service.js';

const handle = (action, status = 200) => async (req, res) => {
  try {
    return res.status(status).json(await action(req));
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.status ? error.message : 'Внутрішня помилка сервера.' });
  }
};
export const createUserController = handle(req => services.saveUserService(null, req.body), 201);
export const updateUserController = async (req, res) => {
  try {
    const user = await services.saveUserService(req.params.id, req.body);
    if (user.userID !== req.user.userID) return res.json(user);
    const tokens = await tokenService(user);
    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax', path: '/' });
    return res.json({ user, accessToken: tokens.accessToken });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.status ? error.message : 'Внутрішня помилка сервера.' });
  }
};
export const getTimesheetController = handle(() => services.getTimesheetService());
export const saveWorkdayController = handle(req => services.saveUserWorkdayService(req.params.id, req.body));
export const createBirthdayController = handle(req => services.createBirthdayService(req.body), 201);
export const deleteBirthdayController = handle(req => services.deleteBirthdayService(req.params.id));
export const getImagesController = handle(() => services.getCategoryImagesService());
export const uploadImageController = handle(req => services.uploadCategoryImageService(req.body.category, req.file), 201);
export const deleteImageController = handle(req => services.deleteCategoryImageService(req.params.id));