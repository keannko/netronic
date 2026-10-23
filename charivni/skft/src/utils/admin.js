import $api from '../http';
export const getTimesheet = async () => (await $api.get('/admin/timesheet')).data;
export const getAdminLinks = async () => (await $api.get('/admin/links')).data;
export const createAdminLink = async values => (await $api.post('/admin/links', values)).data;
export const updateAdminLink = async (id, values) => (await $api.patch(`/admin/links/${id}`, values)).data;
export const deleteAdminLink = async id => (await $api.delete(`/admin/links/${id}`)).data;
export const saveAccount = async (id, values) => {
  const { data } = await (id ? $api.patch(`/admin/users/${id}`, values) : $api.post('/admin/users', values));
  if (data.accessToken) localStorage.setItem('token', data.accessToken);
  return data.user || data;
};
export const saveWorkday = async (id, values) => (await $api.put(`/admin/users/${id}/workday`, values)).data;
export const addBirthday = async values => (await $api.post('/admin/birthdays', values)).data;
export const deleteBirthday = async id => (await $api.delete(`/admin/birthdays/${id}`)).data;
export const getImages = async () => (await $api.get('/media')).data;
export const uploadImage = async (category, file) => {
  const form = new FormData();
  form.append('category', category);
  form.append('file', file);
  return (await $api.post('/admin/images', form)).data;
};
export const deleteImage = async id => (await $api.delete(`/admin/images/${id}`)).data;
