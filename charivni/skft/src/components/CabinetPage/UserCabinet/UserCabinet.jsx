import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { getEfficiencyStyle } from "../../../utils/efficiency";
import { getWorkHours } from "../../../utils/auth";
import AccountSettings from "../AccountSettings";
import Avatar from "../Avatar";
import GradeStars from "../GradeStars";
import s from "./UserCabinet.module.scss";
import BirthdayCalendar from "./BirthdayCalendar";
import WorkdayEntry from "./WorkdayEntry";
import CategoryMedia from "./CategoryMedia";

const categories = ['РПС', 'Жилеты', 'Повязки', 'Halo', 'Інше'];
const weekdays = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const UserCabinet = ({ user, onUpdate }) => {
  const [tab, setTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [month, setMonth] = useState(null);
  const [hoursError, setHoursError] = useState('');
  const [retry, setRetry] = useState(0);
  const hoursTableRef = useRef(null);

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

  useEffect(() => {
    if (tab !== 'home' || !month || !hoursTableRef.current) return;
    const wrapper = hoursTableRef.current;
    const today = wrapper.querySelector('[data-today="true"]');
    if (!today) return;
    const frame = requestAnimationFrame(() => {
      const offset = today.getBoundingClientRect().left - wrapper.getBoundingClientRect().left + wrapper.scrollLeft;
      wrapper.scrollLeft = offset - wrapper.clientWidth / 2 + today.clientWidth / 2;
    });
    return () => cancelAnimationFrame(frame);
  }, [month, tab]);

  const monthLabel = month ? new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month.month}-01T12:00:00Z`)) : '';

  return (
    <div className={s.main}>
      <button type="button" className={s.mobileMenuButton} aria-expanded={menuOpen} aria-controls="user-cabinet-tabs" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? 'Закрити меню' : 'Меню розділів'} <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span></button>
      <nav id="user-cabinet-tabs" className={`${s.adminTabs} ${s.userTabs} ${menuOpen ? s.mobileTabsOpen : ''}`} aria-label="Розділи кабінету">
        {[['home', 'Головна'], ...categories.map(category => [category, category]), ['settings', 'Налаштування']].map(([key, label]) => <button key={key} type="button" className={tab === key ? s.activeTab : s.navButton} aria-current={tab === key ? 'page' : undefined} onClick={() => { setTab(key); setMenuOpen(false); }}>{label}</button>)}
      </nav>
        {tab === 'home' && <>
          <section className={`${s.profile} ${s.mobileHomeProfile}`} aria-labelledby="employee-title">
            <div className={s.profileIdentity}><Avatar user={user} /><div><span className={s.sectionLabel}>01 / СПІВРОБІТНИК</span><h2 id="employee-title">{user.lastName} {user.firstName}<GradeStars grade={user.grade} /></h2><p>{user.email}</p></div></div>
            <div className={s.grade}><span>ГРЕЙД</span><strong>{user.grade}</strong><span>З 3</span></div>
          </section>
          <WorkdayEntry onSaved={() => setRetry(value => value + 1)} />
          <section className={s.card} aria-labelledby="hours-title">
            <div className={s.cardHeading}><div><span className={s.sectionLabel}>02 / ОБЛІК ЧАСУ</span><h2 id="hours-title">Робочі години</h2><p className={s.month}>{monthLabel}</p></div>{month && <div className={s.total}><strong>{month.totalHours} <small>год</small></strong><span>{month.workedDays} днів відпрацьовано</span></div>}</div>
            {hoursError ? <div role="alert" className={s.error}>{hoursError} <button className={s.retry} onClick={() => setRetry(value => value + 1)}>Повторити</button></div> : !month ? <p role="status" className={s.hint}>Завантаження годин…</p> : <>
              <p className={s.legend}><span /> Субота та неділя <span className={s.todayDot} /> Поточний день</p>
              <div ref={hoursTableRef} className={s.tableWrapper} tabIndex="0" role="region" aria-label="Таблиця робочих годин за поточний місяць">
                <table className={s.hoursTable}>
                  <caption className={s.srOnly}>Відпрацьовані години: {monthLabel}</caption>
                  <thead><tr><th scope="col">День</th>{month.days.map(day => <th scope="col" key={day.date} data-today={day.date === month.today} className={`${day.isWeekend ? s.weekend : ''} ${day.date === month.today ? s.today : ''}`}><span>{day.day}</span><small>{weekdays[new Date(`${day.date}T12:00:00Z`).getUTCDay()]}</small></th>)}</tr></thead>
                  <tbody><tr><th scope="row">Ефективність</th>{month.days.map(day => <td key={day.date} className={`${day.isWeekend ? s.weekend : ''} ${day.date === month.today ? s.today : ''}`}><strong className={s.dayEfficiency} style={getEfficiencyStyle(day.efficiency)}>{day.efficiency == null ? '—' : `${day.efficiency}%`}</strong></td>)}</tr><tr><th scope="row">Години</th>{month.days.map(day => <td key={day.date} className={`${day.isWeekend ? s.weekend : ''} ${day.date === month.today ? s.today : ''}`}><span className={s.userDayHours}>{day.hours === null ? '—' : day.hours}</span></td>)}</tr>{['Тривоги', 'Інше'].map(label => <tr key={label}><th scope="row">{label}</th>{month.days.map(day => <td key={day.date} className={`${day.isWeekend ? s.weekend : ''} ${day.date === month.today ? s.today : ''}`}>—</td>)}</tr>)}</tbody>
                </table>
              </div>
              <p className={s.hint}>Години та ефективність надходять з API. Ефективність розраховується за збереженим звітом; без внесеного звіту — «—». Години відображаються лише після внесення звіту. Дні без запису та майбутні дні позначені «—».</p>
            </>}
          </section>
        </>}
        {tab === 'settings' && <AccountSettings user={user} onUpdate={onUpdate} />}
        {categories.includes(tab) && tab !== 'Інше' && <CategoryMedia key={tab} category={tab} />}
        {tab === 'Інше' && <BirthdayCalendar key={user.birthDate} showCalendar={false} />}
    </div>
  );
};

UserCabinet.propTypes = {
  user: PropTypes.shape({ email: PropTypes.string.isRequired, firstName: PropTypes.string.isRequired, lastName: PropTypes.string.isRequired, grade: PropTypes.number.isRequired, birthDate: PropTypes.string, phone: PropTypes.string }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UserCabinet;
