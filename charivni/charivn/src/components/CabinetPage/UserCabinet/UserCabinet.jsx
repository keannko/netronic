import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getEfficiencyStyle } from "../../../utils/efficiency";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getWorkHours, updateAccount } from "../../../utils/auth";
import s from "./UserCabinet.module.scss";
import BirthdayCalendar from "./BirthdayCalendar";
import WorkdayEntry from "./WorkdayEntry";
import CategoryMedia from "./CategoryMedia";

const categories = ['РПС', 'Жилеты', 'Повязки', 'Halo', 'Прочее'];
const weekdays = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const validationSchema = Yup.object({
  firstName: Yup.string().trim().max(80, 'Максимум 80 символів').required('Введіть ім’я'),
  lastName: Yup.string().trim().max(80, 'Максимум 80 символів').required('Введіть прізвище'),
  phone: Yup.string().test('phone', 'Введіть коректний номер телефону', value => !value || /^\+?[\d\s()-]{7,25}$/.test(value)),
  email: Yup.string().trim().email('Введіть коректну адресу').max(254).required('Введіть логін'),
  currentPassword: Yup.string().required('Введіть поточний пароль'),
  newPassword: Yup.string().min(3, 'Мінімум 3 символи').max(128, 'Максимум 128 символів'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Паролі не збігаються'),
});

const UserCabinet = ({ user, onUpdate }) => {
  const [tab, setTab] = useState('home');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [month, setMonth] = useState(null);
  const [hoursError, setHoursError] = useState('');
  const [retry, setRetry] = useState(0);
  const [message, setMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let active = true;
    setHoursError('');
    getWorkHours().then(data => {
      if (active) setMonth(data);
    }).catch(error => {
      if (active) setHoursError(error.response?.data?.message || 'Не вдалося завантажити години.');
    });
    return () => { active = false; };
  }, [retry]);

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

  const monthLabel = month ? new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month.month}-01T12:00:00Z`)) : '';

  return (
    <div className={s.workspace}>
      <aside className={s.sidebar} aria-label="Меню кабінету">
        <p className={s.menuLabel}>ОСОБИСТИЙ КАБІНЕТ</p>
        <button className={tab === 'home' ? s.activeTab : s.navButton} onClick={() => setTab('home')}>Головна <span>↗</span></button>
        <p className={s.menuLabel}>НАПРЯМКИ</p>
        {categories.map(category => <button key={category} className={tab === category ? s.activeTab : s.navButton} onClick={() => setTab(category)}>{category}</button>)}
        <div className={s.settingsMenu}>
          <button className={s.navButton} aria-expanded={settingsOpen} aria-controls="account-settings-menu" onClick={() => setSettingsOpen(!settingsOpen)}>Налаштування <span>{settingsOpen ? '−' : '+'}</span></button>
          {settingsOpen && <div id="account-settings-menu" className={s.submenu}><button className={tab === 'settings' ? s.activeTab : s.navButton} onClick={() => { setTab('settings'); setMessage(''); setSaveError(''); }}>Особисті дані та вхід</button></div>}
        </div>
      </aside>
      <div className={s.main}>
        {tab === 'home' && <>
          <section className={s.profile} aria-labelledby="employee-title">
            <div><span className={s.sectionLabel}>01 / СПІВРОБІТНИК</span><h2 id="employee-title">{user.lastName} {user.firstName}</h2><p>{user.email}</p></div>
            <div className={s.grade}><span>ГРЕЙД</span><strong>{user.grade}</strong><span>З 3</span></div>
          </section>
          <WorkdayEntry onSaved={() => setRetry(value => value + 1)} />
          <section className={s.card} aria-labelledby="hours-title">
            <div className={s.cardHeading}><div><span className={s.sectionLabel}>02 / ОБЛІК ЧАСУ</span><h2 id="hours-title">Робочі години</h2><p className={s.month}>{monthLabel}</p></div>{month && <div className={s.total}><strong>{month.totalHours} <small>год</small></strong><span>{month.workedDays} днів відпрацьовано</span></div>}</div>
            {hoursError ? <div role="alert" className={s.error}>{hoursError} <button className={s.retry} onClick={() => setRetry(value => value + 1)}>Повторити</button></div> : !month ? <p role="status" className={s.hint}>Завантаження годин…</p> : <>
              <p className={s.legend}><span /> Субота та неділя <span className={s.todayDot} /> Поточний день</p>
              <div className={s.tableWrapper} tabIndex="0" role="region" aria-label="Таблиця робочих годин за поточний місяць">
                <table className={s.hoursTable}>
                  <caption className={s.srOnly}>Відпрацьовані години: {monthLabel}</caption>
                  <thead><tr><th scope="col">День</th>{month.days.map(day => <th scope="col" key={day.date} className={`${day.isWeekend ? s.weekend : ''} ${day.date === month.today ? s.today : ''}`}><span>{day.day}</span><small>{weekdays[new Date(`${day.date}T12:00:00Z`).getUTCDay()]}</small></th>)}</tr></thead>
                  <tbody><tr><th scope="row">Ефективність</th>{month.days.map(day => <td key={day.date} className={`${day.isWeekend ? s.weekend : ''} ${day.date === month.today ? s.today : ''}`}><strong className={s.dayEfficiency} style={getEfficiencyStyle(day.efficiency)}>{day.efficiency == null ? '—' : `${day.efficiency}%`}</strong></td>)}</tr><tr><th scope="row">Години</th>{month.days.map(day => <td key={day.date} className={`${day.isWeekend ? s.weekend : ''} ${day.date === month.today ? s.today : ''}`}><span className={s.userDayHours}>{day.hours === null ? '—' : day.hours}</span></td>)}</tr>{['Тривоги', 'Інше'].map(label => <tr key={label}><th scope="row">{label}</th>{month.days.map(day => <td key={day.date} className={`${day.isWeekend ? s.weekend : ''} ${day.date === month.today ? s.today : ''}`}>—</td>)}</tr>)}</tbody>
                </table>
              </div>
              <p className={s.hint}>Години та ефективність надходять з API. Ефективність розраховується за збереженим звітом; без внесеного звіту — «—». Години відображаються лише після внесення звіту. Дні без запису та майбутні дні позначені «—».</p>
            </>}
          </section>
          <BirthdayCalendar key={user.birthDate} />
        </>}
        {tab === 'settings' && <section className={s.card} aria-labelledby="settings-title">
          <span className={s.sectionLabel}>НАЛАШТУВАННЯ / ОБЛІКОВИЙ ЗАПИС</span><h2 id="settings-title">Особисті дані та вхід</h2><p className={s.hint}>Для збереження змін підтвердьте поточний пароль. Залиште новий пароль порожнім, щоб змінити лише логін.</p>
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
              {saveError && <p className={s.error} role="alert">{saveError}</p>}{message && <p className={s.success} role="status">{message}</p>}
            </Form>}
          </Formik>
        </section>}
        {categories.includes(tab) && <CategoryMedia key={tab} category={tab} />}
      </div>
    </div>
  );
};

UserCabinet.propTypes = {
  user: PropTypes.shape({ email: PropTypes.string.isRequired, firstName: PropTypes.string.isRequired, lastName: PropTypes.string.isRequired, grade: PropTypes.number.isRequired, birthDate: PropTypes.string, phone: PropTypes.string }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UserCabinet;