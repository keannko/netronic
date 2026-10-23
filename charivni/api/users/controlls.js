import { getAllUsersService, getUserService, loginUserService, logoutUserService, refreshService, updateUserService, updateAvatarService, deleteAvatarService, getWorkHoursService, getBirthdaysService, getWorkdayEntriesService, createWorkdayEntryService, getWorkdayCatalogService } from './services.js';

const cookieOptions = { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax', path: '/' };
const sendSession = (res, data) => {
  res.cookie('refreshToken', data.refreshToken, cookieOptions);
  return res.json({ accessToken: data.accessToken, user: data.user });
};
const sendError = (res, error) => res.status(error.status || 500).json({ message: error.status ? error.message : 'Внутрішня помилка сервера.' });

export const loginUserController = async (req, res) => {
  try {
    return sendSession(res, await loginUserService(req.body));
  } catch (error) {
    return sendError(res, error);
  }
};

export const logoutUserController = async (req, res) => {
  try {
    const data = await logoutUserService(req.cookies.refreshToken);
    res.clearCookie('refreshToken', { path: cookieOptions.path, httpOnly: true, sameSite: 'lax' });
    return res.json(data);
  } catch (error) {
    return sendError(res, error);
  }
};

export const refreshController = async (req, res) => {
  try {
    return sendSession(res, await refreshService(req.cookies.refreshToken));
  } catch (error) {
    return sendError(res, error);
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    return res.json(await getAllUsersService());
  } catch (error) {
    return sendError(res, error);
  }
};

export const getUserController = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.userID !== req.params.id) {
      return res.status(403).json({ message: 'Недостатньо прав доступу.' });
    }
    return res.json(await getUserService(req.params.id));
  } catch (error) {
    return sendError(res, error);
  }
};

export const getUserByTokenController = async (req, res) => {
  try {
    return res.json(await getUserService(req.user.userID));
  } catch (error) {
    return sendError(res, error);
  }
};
export const updateUserController = async (req, res) => {
  try {
    return sendSession(res, await updateUserService(req.user.userID, req.body));
  } catch (error) {
    return sendError(res, error);
  }
};
export const uploadAvatarController = async (req, res) => {
  try { return res.json(await updateAvatarService(req.user.userID, req.file)); }
  catch (error) { return sendError(res, error); }
};
export const deleteAvatarController = async (req, res) => {
  try { return res.json(await deleteAvatarService(req.user.userID)); }
  catch (error) { return sendError(res, error); }
};

export const getWorkHoursController = async (req, res) => {
  try {
    return res.json(await getWorkHoursService(req.user.userID));
  } catch (error) {
    return sendError(res, error);
  }
};
export const getBirthdaysController = async (req, res) => {
  try {
    return res.json(await getBirthdaysService());
  } catch (error) {
    return sendError(res, error);
  }
};
export const getWorkdayEntriesController = async (req, res) => {
  try {
    return res.json(await getWorkdayEntriesService(req.user.userID));
  } catch (error) {
    return sendError(res, error);
  }
};

export const createWorkdayEntryController = async (req, res) => {
  try {
    return res.status(201).json(await createWorkdayEntryService(req.user.userID, req.body));
  } catch (error) {
    return sendError(res, error);
  }
};
export const getWorkdayCatalogController = async (req, res) => {
  try {
    return res.json(await getWorkdayCatalogService());
  } catch (error) {
    return sendError(res, error);
  }
};
