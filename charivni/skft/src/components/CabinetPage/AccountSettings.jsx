import { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateAccount, uploadAvatar, deleteAvatar } from '../../utils/auth';
import Avatar from './Avatar';
import s from './UserCabinet/UserCabinet.module.scss';

const validationSchema = Yup.object({
  firstName: Yup.string().trim().max(80, 'Максимум 80 символів').required('Введіть ім’я'),
  lastName: Yup.string().trim().max(80, 'Максимум 80 символів').required('Введіть прізвище'),
  phone: Yup.string().test('phone', 'Введіть коректний номер телефону', value => !value || /^\+?[\d\s()-]{7,25}$/.test(value)),
  email: Yup.string().trim().email('Введіть коректну адресу').max(254).required('Введіть логін'),
  currentPassword: Yup.string().required('Введіть поточний пароль'),
  newPassword: Yup.string().min(3, 'Мінімум 3 символи').max(128, 'Максимум 128 символів'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Паролі не збігаються'),
});

export default function AccountSettings({ user, onUpdate }) {
  const [message, setMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);

  const changeAvatar = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage('');
    setSaveError('');
    if (file.size > 2 * 1024 * 1024) { setSaveError('Максимальний розмір аватарки — 2 МБ.'); setAvatarVersion(value => value + 1); return; }
    setAvatarBusy(true);
    try {
      onUpdate(await uploadAvatar(file));
      setMessage('Аватарку збережено.');
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Не вдалося завантажити аватарку.');
    } finally {
      setAvatarBusy(false);
      setAvatarVersion(value => value + 1);
    }
  };

  const removeAvatar = async () => {
    setAvatarBusy(true);
    setMessage('');
    setSaveError('');
    try { onUpdate(await deleteAvatar()); setMessage('Аватарку видалено.'); }
    catch (error) { setSaveError(error.response?.data?.message || 'Не вдалося видалити аватарку.'); }
    finally { setAvatarBusy(false); }
  };

  const handleSave = async (values, { resetForm }) => {
    setMessage('');
    setSaveError('');
    try {
      const updatedUser = await updateAccount({ email: values.email, currentPassword: values.currentPassword, newPassword: values.newPassword, firstName: values.firstName, lastName: values.lastName, birthDate: values.birthDate, phone: values.phone });
      onUpdate(updatedUser);
      resetForm({ values: { firstName: updatedUser.firstName, lastName: updatedUser.lastName, birthDate: updatedUser.birthDate, phone: updatedUser.phone, email: updatedUser.email, currentPassword: '', newPassword: '', confirmPassword: '' } });
      setMessage('Зміни збережено. Використовуйте оновлені дані для наступного входу.');
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Не вдалося зберегти зміни. Перевірте з’єднання.');
    }
  };

  return <section className={s.card} aria-labelledby="settings-title">
    <span className={s.sectionLabel}>НАЛАШТУВАННЯ / ОБЛІКОВИЙ ЗАПИС</span>
    <h2 id="settings-title">Особисті дані та вхід</h2>
    <div className={s.avatarSettings}>
      <Avatar user={user} />
      <div><strong>Аватарка</strong><p className={s.hint}>PNG, JPEG, WebP або GIF до 2 МБ</p>
        <div className={s.avatarActions}>
          <label className={s.avatarUpload} htmlFor="account-avatar">{avatarBusy ? 'Завантаження…' : 'Встановити аватарку'}</label>
          <input key={avatarVersion} id="account-avatar" className={s.srOnly} type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={avatarBusy} onChange={changeAvatar} />
          {user.avatar && <button type="button" className={s.cancelButton} disabled={avatarBusy} onClick={removeAvatar}>Видалити</button>}
        </div>
      </div>
    </div>
    <p className={s.hint}>Для зміни особистих даних підтвердьте поточний пароль. Новий пароль можна залишити порожнім.</p>
    <Formik initialValues={{ firstName: user.firstName, lastName: user.lastName, birthDate: user.birthDate || '', phone: user.phone || '', email: user.email, currentPassword: '', newPassword: '', confirmPassword: '' }} validationSchema={validationSchema} onSubmit={handleSave}>
      {({ isSubmitting }) => <Form className={s.settingsForm} onChange={() => { setMessage(''); setSaveError(''); }}>
        {[
          { name: 'lastName', label: 'Прізвище', type: 'text', autoComplete: 'family-name' },
          { name: 'firstName', label: 'Ім’я', type: 'text', autoComplete: 'given-name' },
          { name: 'birthDate', label: 'Дата народження', type: 'date', autoComplete: 'bday' },
          { name: 'phone', label: 'Мобільний телефон', type: 'tel', autoComplete: 'tel' },
          { name: 'email', label: 'Логін (електронна адреса)', type: 'email', autoComplete: 'username' },
          { name: 'currentPassword', label: 'Поточний пароль', type: 'password', autoComplete: 'current-password' },
          { name: 'newPassword', label: 'Новий пароль', type: 'password', autoComplete: 'new-password' },
          { name: 'confirmPassword', label: 'Підтвердіть новий пароль', type: 'password', autoComplete: 'new-password' },
        ].map(field => <div className={s.field} key={field.name}><label htmlFor={`settings-${field.name}`}>{field.label}</label><Field id={`settings-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} aria-describedby={`settings-${field.name}-error`} /><ErrorMessage name={field.name} id={`settings-${field.name}-error`} component="p" className={s.error} /></div>)}
        <button className={s.saveButton} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Збереження…' : 'Зберегти зміни ↗'}</button>
      </Form>}
    </Formik>
    {saveError && <p className={s.error} role="alert">{saveError}</p>}{message && <p className={s.success} role="status">{message}</p>}
  </section>;
}

AccountSettings.propTypes = { user: PropTypes.object.isRequired, onUpdate: PropTypes.func.isRequired };
