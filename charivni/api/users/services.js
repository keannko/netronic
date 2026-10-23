import bcrypt from 'bcryptjs';
import { getAllUsersDataAccess, getUserDataAccess, loginUserDataAccess, updateUserDataAccess, getWorkHoursDataAccess, getEfficiencyDataAccess, getBirthdaysDataAccess, getWorkdayEntriesDataAccess, createWorkdayEntryDataAccess, getWorkdayCatalogDataAccess } from './dataAccess.js';
import { tokenService, validateRefreshToken, removeToken, removeUserTokens } from '../services/token-service.js';

export const publicUser = user => ({ userID: user.userID, email: user.email, name: user.name, role: user.role, firstName: user.firstName || "", lastName: user.lastName || "", grade: user.grade ?? 0, birthDate: user.birthDate || "", phone: user.phone || "", avatar: user.avatar || "" });
export const fail = (message, status) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

export const loginUserService = async ({ email, password } = {}) => {
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    fail('Введіть електронну адресу та пароль.', 400);
  }
  const user = await loginUserDataAccess(email.trim().toLowerCase());
  if (!user || !await bcrypt.compare(password, user.password)) {
    fail('Невірна електронна адреса або пароль.', 401);
  }
  return { ...await tokenService(publicUser(user)), user: publicUser(user) };
};

export const logoutUserService = async refreshToken => {
  removeToken(refreshToken);
  return { message: 'Вихід виконано.' };
};

export const refreshService = async refreshToken => {
  const session = validateRefreshToken(refreshToken);
  if (!session) fail('Увійдіть до облікового запису.', 401);
  const user = await getUserDataAccess(session.userID);
  if (!user) fail('Користувача не знайдено.', 401);
  removeToken(refreshToken);
  return { ...await tokenService(publicUser(user)), user: publicUser(user) };
};

export const getAllUsersService = async () => (await getAllUsersDataAccess()).map(publicUser);

export const getUserService = async id => {
  const user = await getUserDataAccess(id);
  if (!user) fail('Користувача не знайдено.', 404);
  return publicUser(user);
};
export const updateUserService = async (userID, { email, currentPassword, newPassword, firstName, lastName, birthDate, phone } = {}) => {
  const user = await getUserDataAccess(userID);
  if (!user) fail('Користувача не знайдено.', 404);
  if (typeof currentPassword !== 'string' || !await bcrypt.compare(currentPassword, user.password)) {
    fail('Поточний пароль невірний.', 400);
  }
  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    fail('Введіть коректну електронну адресу.', 400);
  }
  if (newPassword !== undefined && (typeof newPassword !== 'string' || newPassword.length > 128 || (newPassword.length > 0 && newPassword.length < 3))) {
    fail('Новий пароль має містити від 3 до 128 символів.', 400);
  }
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await loginUserDataAccess(normalizedEmail);
  if (existingUser && existingUser.userID !== userID) fail('Ця електронна адреса вже використовується.', 409);
  // Hash before the final uniqueness check, so concurrent requests cannot create duplicates.
  const password = newPassword ? await bcrypt.hash(newPassword, 10) : user.password;
  const duplicate = await loginUserDataAccess(normalizedEmail);
  if (duplicate && duplicate.userID !== userID) fail('Ця електронна адреса вже використовується.', 409);
  const profile = validateProfile({ firstName: firstName ?? user.firstName ?? '', lastName: lastName ?? user.lastName ?? '', birthDate: birthDate ?? user.birthDate ?? '', phone: phone ?? user.phone ?? '' });
  const updated = await updateUserDataAccess(userID, { email: normalizedEmail, password, ...profile, name: `${profile.lastName} ${profile.firstName}`.trim() || user.name });
  removeUserTokens(userID);
  return { ...await tokenService(publicUser(updated)), user: publicUser(updated) };
};

export const updateAvatarService = async (userID, file) => {
  if (!file) fail('Оберіть зображення.', 400);
  const bytes = file.buffer;
  let mime;
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) mime = 'image/png';
  else if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) mime = 'image/jpeg';
  else if (bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') mime = 'image/webp';
  else if (bytes.length >= 6 && ['GIF87a', 'GIF89a'].includes(bytes.toString('ascii', 0, 6))) mime = 'image/gif';
  else fail('Підтримуються PNG, JPEG, WebP та GIF.', 400);
  const user = await getUserDataAccess(userID);
  if (!user) fail('Користувача не знайдено.', 404);
  return publicUser(await updateUserDataAccess(userID, { avatar: `data:${mime};base64,${bytes.toString('base64')}` }));
};

export const deleteAvatarService = async userID => {
  const user = await getUserDataAccess(userID);
  if (!user) fail('Користувача не знайдено.', 404);
  return publicUser(await updateUserDataAccess(userID, { avatar: '' }));
};

export const getCurrentDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Kyiv', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());

export const buildWorkMonth = (month, today, overrides = {}, efficiencyOverrides = {}) => {
  const [year, monthNumber] = month.split('-').map(Number);
  const count = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const days = Array.from({ length: count }, (_, index) => {
    const day = index + 1;
    const date = `${month}-${String(day).padStart(2, '0')}`;
    const weekday = new Date(Date.UTC(year, monthNumber - 1, day)).getUTCDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const customHours = overrides[date];
    const hours = date > today ? null : (customHours ?? null);
    const efficiency = hours > 0 ? (efficiencyOverrides[date] ?? null) : null;
    return { date, day, isWeekend, hours, efficiency };
  });
  return {
    month, today, days,
    totalHours: days.reduce((sum, day) => sum + (day.hours || 0), 0),
    workedDays: days.filter(day => day.hours > 0).length,
  };
};

export const getWorkHoursService = async (userID, savedEntries) => {
  const today = getCurrentDate();
  const hours = { ...await getWorkHoursDataAccess(userID) };
  const efficiency = { ...await getEfficiencyDataAccess(userID) };
  const entries = savedEntries ?? await getWorkdayEntriesService(userID);
  const catalog = await getWorkdayCatalogDataAccess();
  const products = catalog.products.map(product => ({ ...product, monthQuantity: 0, dayQuantity: 0 }));
  for (const entry of entries) {
    hours[entry.date] = entry.hoursWorked;
    efficiency[entry.date] = entry.efficiency;
    if (entry.date.slice(0, 7) !== today.slice(0, 7) || entry.date > today) continue;
    for (const row of entry.rows) {
      const product = products.find(item => item.id === row.product);
      if (!product) continue;
      product.monthQuantity += row.quantity;
      if (entry.date === today) product.dayQuantity += row.quantity;
    }
  }
  return { ...buildWorkMonth(today.slice(0, 7), today, hours, efficiency), products };
};
export const getBirthdaysService = async () => ({
  today: getCurrentDate(),
  isDemo: false,
  birthdays: await getBirthdaysDataAccess(),
});
export const getWorkdayEntriesService = async userID => {
  const catalog = await getWorkdayCatalogDataAccess();
  return (await getWorkdayEntriesDataAccess(userID)).map(entry => {
    // Calculate on read too: the table must not depend on opening or resaving a day.
    const totalNormMinutes = entry.rows.reduce((sum, row) => {
      const norm = catalog.processes.find(process => process.id === row.process)?.normMinutes ?? row.normMinutes ?? 0;
      return sum + norm * Number(row.quantity);
    }, 0);
    const productiveMinutes = Number(entry.hoursWorked) * 60;
    const efficiency = productiveMinutes > 0 ? Math.round(totalNormMinutes / productiveMinutes * 10000) / 100 : null;
    return { ...entry, totalNormMinutes, productiveMinutes, efficiency };
  }).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
};

export const getWorkdayCatalogService = async () => getWorkdayCatalogDataAccess();

export const createWorkdayEntryService = async (userID, { date, hoursWorked, rows } = {}) => {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date > getCurrentDate()) {
    fail('Оберіть коректну дату не пізніше сьогодні.', 400);
  }
  if (typeof hoursWorked !== 'number' || !Number.isFinite(hoursWorked) || hoursWorked <= 0 || hoursWorked > 24) {
    fail('Вкажіть відпрацьовані години: більше 0 та не більше 24.', 400);
  }
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > 100) fail('Додайте від 1 до 100 процесів.', 400);
  const catalog = await getWorkdayCatalogDataAccess();
  const calculatedRows = rows.map(row => {
    const process = catalog.processes.find(item => item.id === row?.process);
    if (!catalog.products.some(item => item.id === row?.product) || !process || !Number.isInteger(row.quantity) || row.quantity <= 0 || row.quantity > 100000) {
      fail('Перевірте продукт, процес і кількість у кожному рядку.', 400);
    }
    return { product: row.product, process: row.process, quantity: row.quantity, normMinutes: process.normMinutes, totalMinutes: row.quantity * process.normMinutes };
  });
  const totalNormMinutes = calculatedRows.reduce((sum, row) => sum + row.totalMinutes, 0);
  const productiveMinutes = hoursWorked * 60;
  const efficiency = Math.round(totalNormMinutes / productiveMinutes * 10000) / 100;
  return createWorkdayEntryDataAccess(userID, { date, hoursWorked, rows: calculatedRows, productiveMinutes, totalNormMinutes, efficiency });
};
export const validateProfile = ({ firstName = '', lastName = '', birthDate = '', phone = '' } = {}) => {
  if (![firstName, lastName].every(value => typeof value === 'string' && value.length <= 80)) fail('Ім’я та прізвище: до 80 символів.', 400);
  if (typeof phone !== 'string' || (phone && !/^\+?[\d\s()-]{7,25}$/.test(phone))) fail('Вкажіть коректний номер телефону.', 400);
  if (typeof birthDate !== 'string' || (birthDate && (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || !Number.isFinite(Date.parse(birthDate)) || new Date(birthDate).toISOString().slice(0, 10) !== birthDate || birthDate > getCurrentDate()))) fail('Вкажіть коректну дату народження.', 400);
  return { firstName: firstName.trim(), lastName: lastName.trim(), birthDate, phone: phone.trim() };
};
