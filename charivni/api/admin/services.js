import bcrypt from 'bcryptjs';
import { getAllUsersDataAccess, getUserDataAccess, createUserDataAccess, updateUserDataAccess, createBirthdayDataAccess, deleteBirthdayDataAccess, getCategoryImagesDataAccess, createCategoryImageDataAccess, deleteCategoryImageDataAccess, getAdminLinksDataAccess, createAdminLinkDataAccess, updateAdminLinkDataAccess, deleteAdminLinkDataAccess } from '../users/dataAccess.js';
import { publicUser, fail, validateProfile, getAllUsersService, getWorkHoursService, getWorkdayEntriesService, createWorkdayEntryService } from '../users/services.js';
import { removeUserTokens } from '../services/token-service.js';

export const getAdminLinksService = userID => getAdminLinksDataAccess(userID);
const validateAdminLink = ({ title, url } = {}) => {
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 100 || typeof url !== 'string' || url.length > 2048) fail('Вкажіть назву та коректне посилання.', 400);
  let parsed;
  try { parsed = new URL(url.trim()); } catch { fail('Вкажіть коректне посилання.', 400); }
  if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) fail('Посилання має починатися з http:// або https://.', 400);
  return { title: title.trim(), url: parsed.href };
};
export const createAdminLinkService = (userID, values) => createAdminLinkDataAccess(userID, validateAdminLink(values));
export const updateAdminLinkService = async (userID, id, values) => {
  const link = await updateAdminLinkDataAccess(userID, id, validateAdminLink(values));
  if (!link) fail('Посилання не знайдено.', 404);
  return link;
};
export const deleteAdminLinkService = async (userID, id) => {
  if (!await deleteAdminLinkDataAccess(userID, id)) fail('Посилання не знайдено.', 404);
  return { message: 'Посилання видалено.' };
};

export const saveUserService = async (id, values = {}) => {
  const current = id ? await getUserDataAccess(id) : null;
  if (id && !current) fail('Користувача не знайдено.', 404);
  const profile = validateProfile(values);
  if (!profile.firstName || !profile.lastName) fail('Вкажіть ім’я та прізвище.', 400);
  if (typeof values.email !== 'string' || values.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) fail('Вкажіть коректний логін.', 400);
  if (!['admin', 'user'].includes(values.role) || !Number.isInteger(values.grade) || values.grade < 0 || values.grade > 3) fail('Перевірте роль і грейд (0–3).', 400);
  if (current?.role === 'admin' && values.role !== 'admin' && (await getAllUsersDataAccess()).filter(user => user.role === 'admin').length === 1) fail('Не можна змінити роль останнього адміністратора.', 400);
  if ((!current || values.password) && (typeof values.password !== 'string' || values.password.length < 3 || values.password.length > 128)) fail('Пароль має містити від 3 до 128 символів.', 400);
  const oldRole = current?.role;
  const changes = { ...profile, name: `${profile.lastName} ${profile.firstName}`, email: values.email.trim().toLowerCase(), role: values.role, grade: values.grade };
  if (!current || values.password) changes.password = await bcrypt.hash(values.password, 10);
  const user = current ? await updateUserDataAccess(id, changes) : await createUserDataAccess(changes);
  if (current && (values.password || oldRole !== values.role)) removeUserTokens(id);
  return publicUser(user);
};

export const getTimesheetService = async () => Promise.all((await getAllUsersService()).map(async user => {
  const entries = await getWorkdayEntriesService(user.userID);
  return { user, ...await getWorkHoursService(user.userID, entries), entries };
}));
export const saveUserWorkdayService = async (id, values) => {
  if (!await getUserDataAccess(id)) fail('Користувача не знайдено.', 404);
  return createWorkdayEntryService(id, values);
};
export const createBirthdayService = async ({ name, date } = {}) => {
  if (typeof name !== 'string' || !name.trim() || name.length > 160 || typeof date !== 'string' || !/^\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(`2000-${date}`)) || new Date(`2000-${date}`).toISOString().slice(5, 10) !== date) fail('Вкажіть ім’я та коректну дату (ММ-ДД).', 400);
  return createBirthdayDataAccess({ name: name.trim(), date });
};
export const deleteBirthdayService = async id => {
  if (!await deleteBirthdayDataAccess(id)) fail('Запис не знайдено.', 404);
  return { message: 'День народження видалено.' };
};
export const categories = ['РПС', 'Жилеты', 'Повязки', 'Halo', 'Інше'];
const normalizeCategory = category => category === 'Прочее' ? 'Інше' : category;
export const getCategoryImagesService = async () => (await getCategoryImagesDataAccess()).map(image => ({ ...image, category: normalizeCategory(image.category) }));
export const uploadCategoryImageService = async (category, file) => {
  const normalizedCategory = normalizeCategory(category);
  if (!categories.includes(normalizedCategory) || !file) fail('Оберіть розділ та зображення.', 400);
  const bytes = file.buffer;
  let mime;
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) mime = 'image/png';
  else if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) mime = 'image/jpeg';
  else if (bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') mime = 'image/webp';
  else if (bytes.length >= 6 && ['GIF87a', 'GIF89a'].includes(bytes.toString('ascii', 0, 6))) mime = 'image/gif';
  else fail('Підтримуються PNG, JPEG, WebP та GIF.', 400);
  return createCategoryImageDataAccess({ category: normalizedCategory, name: file.originalname, source: `data:${mime};base64,${bytes.toString('base64')}` });
};
export const deleteCategoryImageService = async id => {
  if (!await deleteCategoryImageDataAccess(id)) fail('Зображення не знайдено.', 404);
  return { message: 'Зображення видалено.' };
};
