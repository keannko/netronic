import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Timesheet from "./Timesheet";
import { getTimesheet, saveAccount, saveWorkday, addBirthday, deleteBirthday, uploadImage } from "../../../utils/admin";
import { getBirthdays, getWorkdayCatalog } from "../../../utils/auth";
import CabinetDialog from "../UserCabinet/CabinetDialog";
import SectionImages from "../UserCabinet/SectionImages";
import BirthdayCalendar from "../UserCabinet/BirthdayCalendar";
import s from "../UserCabinet/UserCabinet.module.scss";

const categories = ['РПС', 'Жилеты', 'Повязки', 'Halo', 'Прочее'];
const emptyRow = () => ({ product: '1', process: '1', quantity: 1 });
const blankUser = { firstName: '', lastName: '', email: '', password: '', role: 'user', grade: 0, birthDate: '', phone: '' };
const AdminCabinet = ({ currentUser, onUpdate }) => {
  const [tab, setTab] = useState('users');
  const [data, setData] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [catalog, setCatalog] = useState(null);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [modalError, setModalError] = useState('');
  const [account, setAccount] = useState(null);
  const [day, setDay] = useState(null);
  const [birthday, setBirthday] = useState({ name: '', date: '' });
  const [category, setCategory] = useState('РПС');
  const [file, setFile] = useState(null);
  const [fileVersion, setFileVersion] = useState(0);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([getTimesheet(), getBirthdays(), getWorkdayCatalog()]).then(([users, calendar, options]) => {
      if (active) { setData(users); setBirthdays(calendar.birthdays); setCatalog(options); }
    }).catch(error => { if (active) setError(error.response?.data?.message || 'Не вдалося завантажити дані.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [version]);

  const perform = async (action, close) => {
    setBusy(true); setModalError(''); setError(''); setNotice('');
    try { await action(); if (close) close(); setVersion(value => value + 1); setNotice('Зміни збережено.'); }
    catch (error) { const message = error.response?.data?.message || 'Не вдалося зберегти зміни.'; if (close) setModalError(message); else setError(message); }
    finally { setBusy(false); }
  };
  const openDay = (item, date) => {
    const entry = item.entries.find(entry => entry.date === date);
    setModalError('');
    setDay({ userID: item.user.userID, name: item.user.name, date, hoursWorked: entry?.hoursWorked ?? 8, rows: entry?.rows.map(row => ({ product: row.product, process: row.process, quantity: row.quantity })) || [emptyRow()] });
  };
  const updateRow = (index, key, value) => setDay(previous => ({ ...previous, rows: previous.rows.map((row, i) => i === index ? { ...row, [key]: value } : row) }));
  const totalNorm = day?.rows.reduce((sum, row) => sum + (catalog?.processes.find(process => process.id === row.process)?.normMinutes || 0) * Number(row.quantity), 0) || 0;
  const efficiency = day?.hoursWorked > 0 ? Math.round(totalNorm / (day.hoursWorked * 60) * 10000) / 100 : 0;
  const noEnter = event => { if (event.key === 'Enter' && event.target.tagName === 'INPUT') event.preventDefault(); };

  return <div className={s.main}>
    <nav className={s.adminTabs} aria-label="Адміністрування">{[['users', 'Користувачі'], ['timesheet', 'Табель'], ['birthdays', 'Дні народження'], ['images', 'Зображення']].map(([key, label]) => <button key={key} className={tab === key ? s.activeTab : s.navButton} onClick={() => setTab(key)}>{label}</button>)}</nav>
    {notice && <p className={s.adminNotice} role="status">{notice}</p>}
    {error && <p className={s.adminError} role="alert">{error}<button className={s.retry} onClick={() => setVersion(value => value + 1)}>Повторити</button></p>}
    {loading && <p className={s.description} role="status">Завантаження…</p>}
    {tab === 'users' && <section className={s.card}><div className={s.cardHeading}><h2>Користувачі</h2><button className={s.saveButton} disabled={busy} onClick={() => { setAccount({ ...blankUser }); setModalError(''); }}>Створити користувача +</button></div><div className={s.tableWrapper}><table className={s.entriesTable}><thead><tr>{['ПІБ', 'Логін', 'Роль', 'Грейд', 'Дата народження', 'Телефон', 'Дії'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{data.map(({ user }) => <tr key={user.userID}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.grade}</td><td>{user.birthDate || '—'}</td><td>{user.phone || '—'}</td><td><button className={s.retry} onClick={() => { setAccount({ ...user, password: '' }); setModalError(''); }}>Редагувати</button></td></tr>)}</tbody></table></div></section>}
    {tab === 'timesheet' && <Timesheet version={version} onOpenDay={openDay} />}
    {tab === 'birthdays' && <><BirthdayCalendar key={version} /><section className={s.card}><h2>Керування днями народження</h2><form className={s.adminInlineForm} onSubmit={event => { event.preventDefault(); perform(() => addBirthday({ name: birthday.name, date: birthday.date.slice(5) }), () => setBirthday({ name: '', date: '' })); }}><div className={s.field}><label htmlFor="birthday-name">Прізвище та ім’я</label><input id="birthday-name" required maxLength="160" value={birthday.name} onChange={event => setBirthday({ ...birthday, name: event.target.value })} /></div><div className={s.field}><label htmlFor="birthday-date">Дата народження</label><input id="birthday-date" type="date" required value={birthday.date} onChange={event => setBirthday({ ...birthday, date: event.target.value })} /></div><button className={s.saveButton} disabled={busy}>Додати</button></form>{modalError && <p className={s.error} role="alert">{modalError}</p>}<p className={s.hint}>Дати з профілів з’являються автоматично. Видалення такого запису очищає дату народження у профілі.</p>{birthdays.map(person => <div className={s.adminListRow} key={person.userID}><span>{person.name} · {person.date.split('-').reverse().join('.')}</span><button className={s.cancelButton} disabled={busy} onClick={() => perform(() => deleteBirthday(person.userID))}>Видалити</button></div>)}</section></>}
    {tab === 'images' && <section className={s.card}><h2>Зображення розділів</h2><form className={s.adminInlineForm} onSubmit={event => { event.preventDefault(); if (file) perform(async () => { await uploadImage(category, file); setFile(null); setFileVersion(value => value + 1); }); }}><div className={s.field}><label htmlFor="image-category">Розділ</label><select id="image-category" value={category} onChange={event => setCategory(event.target.value)}>{categories.map(name => <option key={name}>{name}</option>)}</select></div><div className={s.field}><label htmlFor="image-file">Зображення (до 5 МБ)</label><input key={fileVersion} id="image-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" required onChange={event => setFile(event.target.files[0] || null)} /></div><button className={s.saveButton} disabled={busy || !file}>Завантажити</button></form><SectionImages category={category} version={version} editable /></section>}
    {account && <CabinetDialog title={account.userID ? 'Редагувати користувача' : 'Створити користувача'} busy={busy} onClose={() => setAccount(null)}><form className={s.workdayForm} onKeyDown={noEnter} onSubmit={event => { event.preventDefault(); perform(async () => { const saved = await saveAccount(account.userID, { ...account, grade: Number(account.grade) }); if (saved.userID === currentUser.userID) onUpdate(saved); }, () => setAccount(null)); }}><div className={s.adminFields}>{[{ key: 'lastName', label: 'Прізвище', type: 'text', required: true }, { key: 'firstName', label: 'Ім’я', type: 'text', required: true }, { key: 'email', label: 'Логін', type: 'email', required: true }, { key: 'password', label: account.userID ? 'Новий пароль (необов’язково)' : 'Пароль', type: 'password', required: !account.userID }, { key: 'birthDate', label: 'Дата народження', type: 'date' }, { key: 'phone', label: 'Мобільний телефон', type: 'tel' }].map(field => <div className={s.field} key={field.key}><label htmlFor={`admin-${field.key}`}>{field.label}</label><input id={`admin-${field.key}`} type={field.type} required={field.required} minLength={field.key === 'password' ? 3 : undefined} value={account[field.key] || ''} onChange={event => setAccount({ ...account, [field.key]: event.target.value })} /></div>)}<div className={s.field}><label htmlFor="admin-role">Роль</label><select id="admin-role" value={account.role} onChange={event => setAccount({ ...account, role: event.target.value })}><option value="user">user</option><option value="admin">admin</option></select></div><div className={s.field}><label htmlFor="admin-grade">Грейд</label><select id="admin-grade" value={account.grade} onChange={event => setAccount({ ...account, grade: Number(event.target.value) })}>{[0, 1, 2, 3].map(value => <option key={value}>{value}</option>)}</select></div></div>{modalError && <p className={s.error} role="alert">{modalError}</p>}<div className={s.workdayActions}><button className={s.saveButton} disabled={busy}>Зберегти</button><button type="button" className={s.cancelButton} disabled={busy} onClick={() => setAccount(null)}>Скасувати</button></div></form></CabinetDialog>}
    {day && <CabinetDialog title={`${day.name} · ${day.date}`} busy={busy} onClose={() => setDay(null)}><form className={s.workdayForm} onKeyDown={noEnter} onSubmit={event => { event.preventDefault(); perform(() => saveWorkday(day.userID, { date: day.date, hoursWorked: Number(day.hoursWorked), rows: day.rows.map(row => ({ ...row, quantity: Number(row.quantity) })) }), () => setDay(null)); }}><div className={s.workdayTop}><div className={s.field}><label htmlFor="admin-hours">Відпрацьовано годин</label><input id="admin-hours" type="number" min="0.01" max="24" step="0.01" required value={day.hoursWorked} onChange={event => setDay({ ...day, hoursWorked: event.target.value })} /></div><div className={s.efficiencyPreview}><span>Ефективність</span><strong>{efficiency}%</strong><small>{totalNorm} нормативних хв</small></div></div><div className={s.processRows}><div className={s.processHeader}><span>Продукт</span><span>Процес</span><span>Кількість</span><span>Норма, хв</span><span>Загалом, хв</span></div>{day.rows.map((row, index) => { const norm = catalog.processes.find(process => process.id === row.process)?.normMinutes || 0; return <div className={s.processRow} key={index}><div className={s.field}><select aria-label={`Продукт ${index + 1}`} value={row.product} onChange={event => updateRow(index, 'product', event.target.value)}>{catalog.products.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className={s.field}><select aria-label={`Процес ${index + 1}`} value={row.process} onChange={event => updateRow(index, 'process', event.target.value)}>{catalog.processes.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className={s.field}><input aria-label={`Кількість ${index + 1}`} type="number" min="1" max="100000" step="1" required value={row.quantity} onChange={event => updateRow(index, 'quantity', event.target.value)} /></div><output className={s.normValue}>{norm}</output><output className={s.normValue}>{norm * Number(row.quantity)}</output><button type="button" className={s.removeRow} disabled={day.rows.length === 1 || busy} aria-label={`Видалити рядок ${index + 1}`} onClick={() => setDay({ ...day, rows: day.rows.filter((_, i) => i !== index) })}>✕</button></div>; })}</div><button type="button" className={s.cancelButton} disabled={busy || day.rows.length >= 100} onClick={() => setDay({ ...day, rows: [...day.rows, emptyRow()] })}>Додати процес +</button>{modalError && <p className={s.error} role="alert">{modalError}</p>}<div className={s.workdayActions}><button className={s.saveButton} disabled={busy}>Підтвердити</button><button type="button" className={s.cancelButton} disabled={busy} onClick={() => setDay(null)}>Скасувати</button></div></form></CabinetDialog>}
  </div>;
};
AdminCabinet.propTypes = { currentUser: PropTypes.shape({ userID: PropTypes.string.isRequired }).isRequired, onUpdate: PropTypes.func.isRequired };
export default AdminCabinet;