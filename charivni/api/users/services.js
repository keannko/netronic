import { createNewUserDataAccess, getAllUsersDataAccess, getUserByTokenDataAccess, getUserDataAccess, loginUserDataAccess, logoutUserDataAccess, refreshDataAccess, refreshDataAccess2 } from "./dataAccess.js";
import jwt from 'jsonwebtoken';
import { validateRefreshToken } from "../services/token-service.js";

export const createNewUserService = async (userData) => {
  try {
    const result = await createNewUserDataAccess(userData);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUserService = async (userData) => {
  try {
    const result = await loginUserDataAccess(userData);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUserService = async (refreshToken) => {
  try {
    const result = await logoutUserDataAccess(refreshToken);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const refreshService = async (refreshToken) => {

const tokenFromDb = await refreshDataAccess(refreshToken);
const userData = validateRefreshToken(refreshToken)

if(!refreshToken) {
  throw new Error('Refresh Token отсутствует');
}

if(!tokenFromDb || !userData) {
  throw new Error('Unauthorized Error');
}
const tokens = refreshDataAccess2(refreshToken)
return tokens
};

export const getAllUsersService = async () => {
  try {
    const result = await getAllUsersDataAccess();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserService = async (id) => {
  try {
    const result = await getUserDataAccess(id);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserByTokenService = async (token) => {
  try {
    const result = await getUserByTokenDataAccess(token);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};





