import { useEffect, useState } from "react";
import { getBirthdays } from "../../../utils/auth";
import s from "./UserCabinet.module.scss";

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

const BirthdayCalendar = () => {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setError('');
    getBirthdays().then(result => {
      if (!active) return;
      setData(result);
      setMonth(result.today.slice(0, 7));
    }).catch(error => {
      if (active) setError(error.response?.data?.message || 'Не вдалося завантажити дні народження.');
    });
    return () => { active = false; };
  }, [retry]);

  const moveMonth = offset => {
    const [year, number] = month.split('-').map(Number);
    const date = new Date(Date.UTC(year, number - 1 + offset, 1));
    setMonth(`${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`);
  };

  const [year, number] = month.split('-').map(Number);
  const firstWeekday = month ? (new Date(Date.UTC(year, number - 1, 1)).getUTCDay() + 6) % 7 : 0;
  const dayCount = month ? new Date(Date.UTC(year, number, 0)).getUTCDate() : 0;
  const days = Array.from({ length: firstWeekday + dayCount }, (_, index) => index < firstWeekday ? null : index - firstWeekday + 1);
  while (days.length % 7) days.push(null);
  const title = month ? new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-01T12:00:00Z`)) : '';
  const birthdays = data?.birthdays.filter(person => Number(person.date.slice(0, 2)) === number) || [];
  const birthdayDay = person => Math.min(Number(person.date.slice(3)), dayCount);

  return (
    <section className={s.card} aria-labelledby="birthday-title">
      <div className={s.cardHeading}><div><span className={s.sectionLabel}>03 / КОМАНДА</span><h2 id="birthday-title">Дні народження</h2></div><span className={s.birthdayBadge} aria-hidden="true">🎂</span></div>
      {error ? <p className={s.error} role="alert">{error}<button className={s.retry} onClick={() => setRetry(value => value + 1)}>Повторити</button></p> : !data ? <p className={s.hint} role="status">Завантаження календаря…</p> : <>
        <div className={s.calendarNavigation}><button type="button" onClick={() => moveMonth(-1)} aria-label="Попередній місяць">‹</button><h3 aria-live="polite">{title}</h3><button type="button" onClick={() => moveMonth(1)} aria-label="Наступний місяць">›</button><button type="button" className={s.currentMonth} onClick={() => setMonth(data.today.slice(0, 7))}>Сьогодні</button></div>
        <div className={s.birthdayLayout}>
          <div className={s.calendarScroll}><table className={s.calendar}><caption className={s.srOnly}>Дні народження: {title}</caption><thead><tr>{weekdays.map(day => <th key={day} scope="col">{day}</th>)}</tr></thead><tbody>
            {Array.from({ length: days.length / 7 }, (_, week) => <tr key={week}>{days.slice(week * 7, week * 7 + 7).map((day, index) => {
              const people = birthdays.filter(person => birthdayDay(person) === day);
              const date = `${month}-${String(day).padStart(2, '0')}`;
              return <td key={index} className={`${index >= 5 ? s.calendarWeekend : ''} ${people.length ? s.birthdayDay : ''} ${date === data.today ? s.calendarToday : ''}`} aria-current={date === data.today ? 'date' : undefined}>{day && <><span className={s.dayNumber}>{day}{people.length > 0 && <span aria-hidden="true"> 🎂</span>}</span>{people.map(person => <span className={s.calendarName} key={person.userID}>{person.name}</span>)}</>}</td>;
            })}</tr>)}
          </tbody></table></div>
          <div className={s.birthdayList}><h3>Іменинники місяця</h3>{birthdays.length ? [...birthdays].sort((a, b) => birthdayDay(a) - birthdayDay(b)).map(person => <div className={s.birthdayPerson} key={person.userID}><strong>{String(birthdayDay(person)).padStart(2, '0')}.{String(number).padStart(2, '0')}</strong><span>{person.name}</span></div>) : <p className={s.hint}>Цього місяця днів народження немає.</p>}</div>
        </div>
        {data.isDemo && <p className={s.hint}>Тестові дати днів народження. Реальні дати ще не внесено.</p>}
      </>}
    </section>
  );
};

export default BirthdayCalendar;