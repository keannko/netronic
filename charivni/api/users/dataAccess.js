import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Local persistence until MongoDB is connected. Tests use isolated memory by default.
const storagePath = process.env.SKIFTECH_STORAGE_FILE || (process.env.NODE_TEST_CONTEXT ? null : fileURLToPath(new URL('../.local/data.json', import.meta.url)));
const stored = storagePath && fs.existsSync(storagePath) ? JSON.parse(fs.readFileSync(storagePath, 'utf8')) : {};
const production = process.env.NODE_ENV === 'production' && !process.env.NODE_TEST_CONTEXT;
if (production && !process.env.SKIFTECH_STORAGE_FILE) throw new Error('Set SKIFTECH_STORAGE_FILE to a persistent writable path before starting production.');
if (production && !stored.users?.length && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.SKIFTECH_ADMIN_EMAIL || '') || (process.env.SKIFTECH_ADMIN_PASSWORD || '').length < 12)) {
  throw new Error('Set SKIFTECH_ADMIN_EMAIL and a SKIFTECH_ADMIN_PASSWORD of at least 12 characters to create the first admin.');
}
const saveStorage = () => {
  if (!storagePath) return;
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });
  const temporaryPath = storagePath + '.tmp';
  fs.writeFileSync(temporaryPath, JSON.stringify({ users, birthdays, categoryImages, workdayEntries, adminLinks }, null, 2));
  fs.renameSync(temporaryPath, storagePath);
};

// Replace this repository with MongoDB when needed.
const password = bcrypt.hashSync('123', 10);
const seedUsers = production ? (stored.users?.length ? [] : [{ userID: randomUUID(), email: process.env.SKIFTECH_ADMIN_EMAIL.trim().toLowerCase(), name: 'Адміністратор', role: 'admin', grade: 0, password: bcrypt.hashSync(process.env.SKIFTECH_ADMIN_PASSWORD, 12) }]) : [
  { userID: '1', email: 'admin@gmail.com', name: 'Адміністратор', role: 'admin', password },
  { userID: '2', email: 'user1@gmail.com', name: 'Петренко Іван', lastName: 'Петренко', firstName: 'Іван', grade: 0, role: 'user', password },
  { userID: '3', email: 'user2@gmail.com', name: 'Коваленко Олександр', lastName: 'Коваленко', firstName: 'Олександр', grade: 0, role: 'user', password },
];

const users = stored.users?.length ? stored.users : seedUsers;
if (production && users.some(user => /@example\.test$/i.test(user.email) || bcrypt.compareSync('123', user.password))) {
  throw new Error('Replace demo accounts and default passwords in the storage file before starting production.');
}
const adminLinks = stored.adminLinks || [];

export const getAdminLinksDataAccess = async userID => adminLinks.filter(link => link.userID === userID);
export const createAdminLinkDataAccess = async (userID, values) => {
  const link = { id: randomUUID(), userID, ...values };
  adminLinks.push(link);
  saveStorage();
  return link;
};
export const updateAdminLinkDataAccess = async (userID, id, values) => {
  const link = adminLinks.find(item => item.userID === userID && item.id === id);
  if (!link) return null;
  Object.assign(link, values);
  saveStorage();
  return link;
};
export const deleteAdminLinkDataAccess = async (userID, id) => {
  const index = adminLinks.findIndex(link => link.userID === userID && link.id === id);
  if (index < 0) return false;
  adminLinks.splice(index, 1);
  saveStorage();
  return true;
};

export const loginUserDataAccess = async email => users.find(user => user.email === email);
export const getAllUsersDataAccess = async () => users;
export const getUserDataAccess = async id => users.find(user => user.userID === id);
export const updateUserDataAccess = async (id, changes) => {
  const user = users.find(user => user.userID === id);
  if (users.some(account => account.userID !== id && account.email === changes.email)) {
    const error = new Error('Ця електронна адреса вже використовується.');
    error.status = 409;
    throw error;
  }
  Object.assign(user, changes);
  saveStorage();
  return user;
};

// Individual daily values override the standard schedule, including weekends.
// Example: { '2026-10-17': 10 }. Stored separately for every employee.
const workedHours = new Map([
  ['2', {}],
  ['3', {}],
]);

export const getWorkHoursDataAccess = async userID => workedHours.get(userID) || {};
// Demo percentages, independent from worked hours. Daily overrides can exceed 100%.
const efficiency = new Map([
  ['2', {}],
  ['3', {}],
]);
export const getEfficiencyDataAccess = async userID => efficiency.get(userID) || {};

// Manual calendar entries and employee profile birthdays share one calendar.
const birthdays = stored.birthdays || [];
export const getBirthdaysDataAccess = async () => [
  ...users.filter(user => user.birthDate).map(user => ({ userID: user.userID, name: user.name, date: user.birthDate.slice(5), source: 'profile' })),
  ...birthdays,
];
export const createBirthdayDataAccess = async values => {
  const entry = { userID: randomUUID(), ...values, source: 'manual' };
  birthdays.push(entry);
  saveStorage();
  return entry;
};
export const deleteBirthdayDataAccess = async id => {
  const user = users.find(user => user.userID === id && user.birthDate);
  if (user) { user.birthDate = ''; saveStorage(); return true; }
  const index = birthdays.findIndex(entry => entry.userID === id);
  if (index < 0) return false;
  birthdays.splice(index, 1);
  saveStorage();
  return true;
};

export const createUserDataAccess = async values => {
  if (users.some(user => user.email === values.email)) {
    const error = new Error('Ця електронна адреса вже використовується.');
    error.status = 409;
    throw error;
  }
  const user = { ...values, userID: randomUUID() };
  users.push(user);
  saveStorage();
  return user;
};

const categoryImages = stored.categoryImages || [];
export const getCategoryImagesDataAccess = async () => categoryImages;
export const createCategoryImageDataAccess = async values => {
  const image = { id: randomUUID(), ...values };
  categoryImages.push(image);
  saveStorage();
  return image;
};
export const deleteCategoryImageDataAccess = async id => {
  const index = categoryImages.findIndex(image => image.id === id);
  if (index < 0) return false;
  categoryImages.splice(index, 1);
  saveStorage();
  return true;
};
const workdayEntries = stored.workdayEntries || [];
if (production && !stored.users?.length) saveStorage();
export const getWorkdayEntriesDataAccess = async userID => workdayEntries.filter(entry => entry.userID === userID);
export const createWorkdayEntryDataAccess = async (userID, values) => {
  const entry = { id: randomUUID(), userID, ...values, createdAt: new Date().toISOString() };
  const index = workdayEntries.findIndex(item => item.userID === userID && item.date === values.date);
  if (index >= 0) workdayEntries.splice(index, 1);
  workdayEntries.push(entry);
  saveStorage();
  return entry;
};
// Temporary product/process catalog. Norms are minutes per unit.
export const getWorkdayCatalogDataAccess = async () => ({
  products: ['1', '2', '3', '4'].map(id => ({ id, name: id })),
  processes: [15, 30, 45, 60].map((normMinutes, index) => ({ id: String(index + 1), name: String(index + 1), normMinutes })),
});
