import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getBirthdays } from '../../../utils/auth';
import s from './UserCabinet.module.scss';

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const dateLabel = date => `${date.slice(3, 5)}.${date.slice(0, 2)}`;

const BirthdayCalendar = ({ employees = [], showCalendar = true }) => {
  const [data, setData] = useState(null);
  const [year, setYear] = useState(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setError('');
    getBirthdays().then(result => {
      if (!active) return;
      setData(result);
      setYear(Number(result.today.slice(0, 4)));
    }).catch(error => {
      if (active) setError(error.response?.data?.message || 'Не вдалося завантажити дні народження.');
    });
    return () => { active = false; };
  }, [retry]);

  const birthdays = [...(data?.birthdays || [])].sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
  const employeeBirthdays = employees.length ? [...employees].sort((a, b) => (a.birthDate ? a.birthDate.slice(5) : '99-99').localeCompare(b.birthDate ? b.birthDate.slice(5) : '99-99') || a.name.localeCompare(b.name)) : [];

  return <section className={s.card} aria-labelledby="birthday-title">
    <div className={s.cardHeading}><div><span className={s.sectionLabel}>03 / КОМАНДА</span><h2 id="birthday-title">Дні народження</h2></div><span className={s.birthdayBadge} aria-hidden="true">🎂</span></div>
    {error ? <p className={s.error} role="alert">{error}<button className={s.retry} onClick={() => setRetry(value => value + 1)}>Повторити</button></p> : !data ? <p className={s.hint} role="status">Завантаження календаря…</p> : <>
      {showCalendar && <><div className={s.calendarNavigation}><button type="button" onClick={() => setYear(value => value - 1)} aria-label="Попередній рік">‹</button><h3 aria-live="polite">{year} рік</h3><button type="button" onClick={() => setYear(value => value + 1)} aria-label="Наступний рік">›</button><button type="button" className={s.currentMonth} onClick={() => setYear(Number(data.today.slice(0, 4)))}>Поточний рік</button></div>
      <div className={s.yearCalendar}>{Array.from({ length: 12 }, (_, index) => {
        const monthNumber = index + 1;
        const month = String(monthNumber).padStart(2, '0');
        const monthName = new Intl.DateTimeFormat('uk-UA', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(year, index, 1)));
        const dayCount = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
        const firstWeekday = (new Date(Date.UTC(year, index, 1)).getUTCDay() + 6) % 7;
        const days = Array.from({ length: Math.ceil((firstWeekday + dayCount) / 7) * 7 }, (_, offset) => offset < firstWeekday || offset >= firstWeekday + dayCount ? null : offset - firstWeekday + 1);
        const monthly = birthdays.filter(person => person.date.slice(0, 2) === month);
        return <div className={s.yearMonth} key={month}><h3>{monthName}</h3><table className={s.miniCalendar}><caption className={s.srOnly}>{monthName} {year}</caption><thead><tr>{weekdays.map(day => <th scope="col" key={day}>{day}</th>)}</tr></thead><tbody>
          {Array.from({ length: days.length / 7 }, (_, week) => <tr key={week}>{days.slice(week * 7, week * 7 + 7).map((day, weekday) => {
            const people = day ? monthly.filter(person => Math.min(Number(person.date.slice(3)), dayCount) === day) : [];
            const today = `${year}-${month}-${String(day).padStart(2, '0')}` === data.today;
            return <td key={weekday} className={`${weekday >= 5 ? s.calendarWeekend : ''} ${people.length ? s.birthdayDay : ''} ${today ? s.calendarToday : ''}`} title={people.length ? people.map(person => person.name).join(', ') : undefined} aria-label={day ? `${day} ${monthName}${people.length ? `: ${people.map(person => person.name).join(', ')}` : ''}` : undefined} aria-current={today ? 'date' : undefined}>{day || ''}{people.length > 0 && <span className={s.birthdayMarker} aria-hidden="true">•</span>}</td>;
          })}</tr>)}
        </tbody></table></div>;
      })}</div></>}
      <div className={s.birthdayFullList}><h3>Повний список співробітників і дат</h3>
        {employeeBirthdays.length ? employeeBirthdays.map(person => <div className={s.birthdayListRow} key={person.userID}><span>{person.name}</span><strong>{person.birthDate ? `${person.birthDate.slice(8, 10)}.${person.birthDate.slice(5, 7)}.${person.birthDate.slice(0, 4)}` : 'Дату не вказано'}</strong></div>) : birthdays.filter(person => person.source === 'profile').map(person => <div className={s.birthdayListRow} key={person.userID}><span>{person.name}</span><strong>{dateLabel(person.date)}</strong></div>)}
        {!employeeBirthdays.length && !birthdays.some(person => person.source === 'profile') && <p className={s.hint}>Дати народження співробітників ще не внесено.</p>}
        {birthdays.some(person => person.source === 'manual') && <><h4>Додані окремо</h4>{birthdays.filter(person => person.source === 'manual').map(person => <div className={s.birthdayListRow} key={person.userID}><span>{person.name}</span><strong>{dateLabel(person.date)}</strong></div>)}</>}
      </div>
    </>}
  </section>;
};

BirthdayCalendar.propTypes = { employees: PropTypes.arrayOf(PropTypes.shape({ userID: PropTypes.string.isRequired, name: PropTypes.string.isRequired, birthDate: PropTypes.string })), showCalendar: PropTypes.bool };
export default BirthdayCalendar;
