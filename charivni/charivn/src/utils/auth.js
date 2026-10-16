import $api from '../http';

const saveSession = data => {
  localStorage.setItem('token', data.accessToken);
  return data.user;
};

export const loginUser = async values => saveSession((await $api.post('/users/login', values)).data);

let refreshRequest;
export const refreshUser = () => {
  if (!refreshRequest) {
    refreshRequest = $api.get('/users/refresh')
      .then(response => saveSession(response.data))
      .finally(() => { refreshRequest = null; });
  }
  return refreshRequest;
};

export const logoutUser = async () => {
  await $api.post('/users/logout');
  localStorage.removeItem('token');
};

export const getAccounts = async () => (await $api.get('/users')).data;
export const getWorkHours = async () => (await $api.get('/users/hours')).data;
export const updateAccount = async values => saveSession((await $api.patch('/users/settings', values)).data);
export const getBirthdays = async () => (await $api.get('/users/birthdays')).data;

export const getWorkdayEntries = async () => (await $api.get('/users/workdays')).data;
export const createWorkdayEntry = async values => (await $api.post('/users/workdays', values)).data;
export const getWorkdayCatalog = async () => (await $api.get('/users/workday-catalog')).data;
