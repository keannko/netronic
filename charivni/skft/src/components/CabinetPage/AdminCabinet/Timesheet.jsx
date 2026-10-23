import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getTimesheet } from "../../../utils/admin";
import { getEfficiencyStyle } from "../../../utils/efficiency";
import s from "../UserCabinet/UserCabinet.module.scss";

const getSummary = item => {
  const entries = new Map(item.entries.map(entry => [entry.date, entry]));
  const worked = item.days.filter(day => Number(entries.get(day.date)?.hoursWorked ?? day.hours) > 0);
  const hours = worked.reduce((sum, day) => sum + Number(entries.get(day.date)?.hoursWorked ?? day.hours), 0);
  const efficiency = worked.reduce((sum, day) => sum + Number(entries.get(day.date)?.efficiency ?? day.efficiency ?? 0), 0);
  return { days: worked.length, hours, efficiency };
};

const formatNumber = value => new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 }).format(value);

const Timesheet = ({ version, onOpenDay }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortDay, setSortDay] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getTimesheet().then(data => { if (active) setUsers(data); })
      .catch(error => { if (active) setError(error.response?.data?.message || 'Не вдалося завантажити табель.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [version, retry]);

  const month = users[0]?.month;
  const title = month ? new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-01T12:00:00Z`)) : '';
  const summaries = users.map(item => ({ user: item.user, ...getSummary(item) }));
  const totals = summaries.reduce((sum, item) => ({ days: sum.days + item.days, hours: sum.hours + item.hours, efficiency: sum.efficiency + item.efficiency }), { days: 0, hours: 0, efficiency: 0 });
  const summaryById = new Map(summaries.map(item => [item.user.userID, item]));
  const selectedDay = sortDay || users[0]?.today;
  const sortValue = item => {
    const summary = summaryById.get(item.user.userID);
    if (sortBy === 'days') return summary.days;
    if (sortBy === 'efficiency') return summary.days ? summary.efficiency / summary.days : null;
    if (sortBy === 'hours') return summary.hours;
    const day = item.days.find(day => day.date === selectedDay);
    const entry = item.entries.find(entry => entry.date === selectedDay);
    const hours = entry?.hoursWorked ?? day?.hours;
    if (sortBy === 'dayHours') return Number(hours) > 0 ? Number(hours) : null;
    if (sortBy === 'dayEfficiency') return Number(hours) > 0 ? Number(entry?.efficiency ?? day?.efficiency ?? 0) : null;
    return item.user.name;
  };
  const sortedUsers = [...users].sort((a, b) => {
    const first = sortValue(a);
    const second = sortValue(b);
    if (first == null) return second == null ? a.user.name.localeCompare(b.user.name, 'uk') : 1;
    if (second == null) return -1;
    const comparison = typeof first === 'string' ? first.localeCompare(second, 'uk') : first - second;
    return (sortDirection === 'asc' ? comparison : -comparison) || a.user.name.localeCompare(b.user.name, 'uk');
  });

  return <section className={s.card}>
    <div className={s.cardHeading}><div><h2>Табель усіх користувачів</h2><p className={s.month}>{title}{!loading && !error ? ` · ${users.length} користувачів` : ''}</p></div><button type="button" className={s.cancelButton} disabled={loading} onClick={() => setRetry(value => value + 1)}>Оновити</button></div>
    <p className={s.hint}>Для заповненого дня: ефективність зверху, відпрацьовані години нижче. Без внесеного часу — «—». Натисніть на день, щоб переглянути або змінити звіт.</p>
    <p className={s.legend}>100% — зелений · менше — до червоного · більше — до синього. Вихідні — жовті.</p>
    {!loading && !error && users.length > 0 && <div className={s.timesheetSort}>
      <label>Сортувати за <select value={sortBy} onChange={event => setSortBy(event.target.value)}><option value="name">Ім’ям</option><option value="days">Відпрацьованими днями</option><option value="efficiency">Середньою ефективністю</option><option value="hours">Сумою годин</option><option value="dayEfficiency">Ефективністю за день</option><option value="dayHours">Годинами за день</option></select></label>
      {(sortBy === 'dayEfficiency' || sortBy === 'dayHours') && <label>День <select value={selectedDay} onChange={event => setSortDay(event.target.value)}>{users[0].days.map(day => <option key={day.date} value={day.date}>{day.day}.{month.slice(5)}</option>)}</select></label>}
      <button type="button" className={s.cancelButton} onClick={() => setSortDirection(value => value === 'asc' ? 'desc' : 'asc')} aria-label={`Порядок сортування: ${sortDirection === 'asc' ? 'за зростанням' : 'за спаданням'}`}>{sortDirection === 'asc' ? '↑ За зростанням' : '↓ За спаданням'}</button>
    </div>}
    {loading ? <p className={s.hint} role="status">Завантаження актуального табеля…</p> : error ? <p className={s.error} role="alert">{error}</p> : <div className={s.tableWrapper} tabIndex="0" role="region" aria-label="Табель робочого часу та ефективності">
      <table className={`${s.hoursTable} ${s.adminTimesheet}`}>
        <caption className={s.srOnly}>Робочий час та ефективність: {title}</caption>
        <thead><tr><th scope="col">Співробітник</th>{users[0]?.days.map(day => <th scope="col" key={day.date} className={day.isWeekend ? s.weekend : ''}><span>{day.day}</span><small>{new Intl.DateTimeFormat('uk-UA', { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${day.date}T12:00:00Z`))}</small></th>)}</tr></thead>
        <tbody>{sortedUsers.map(item => <tr key={item.user.userID}>
          <th scope="row">{item.user.name}<small>{item.user.email}</small></th>
          {item.days.map(day => {
            const entry = item.entries.find(entry => entry.date === day.date);
            const hours = entry?.hoursWorked ?? day.hours;
            const hasTime = hours != null && Number(hours) > 0;
            const efficiency = hasTime ? (entry?.efficiency ?? day.efficiency ?? 0) : null;
            return <td key={day.date} className={day.isWeekend ? s.weekend : ''}>
              <button type="button" className={s.dayButton} style={getEfficiencyStyle(efficiency)} disabled={day.date > item.today} aria-label={`${item.user.name}, ${day.date}: ${hasTime ? `${efficiency}%, ${hours} год` : 'час не внесено'}`} title={hasTime ? `${efficiency}% · ${hours} год` : undefined} onClick={() => onOpenDay(item, day.date)}>
                {hasTime ? <><strong className={s.dayEfficiency}>{Math.round(efficiency)}%</strong><small className={s.dayHours}>{hours}г</small></> : <span className={s.noWorkday}>—</span>}
              </button>
            </td>;
          })}
        </tr>)}</tbody>
      </table>
      {!users.length && <p className={s.hint}>Користувачів поки немає.</p>}
    </div>}
    {!loading && !error && users.length > 0 && <div className={s.timesheetSummary}>
      <h3>Підсумки за відпрацьовані дні</h3>
      <div className={s.tableWrapper}><table className={s.summaryTable}>
        <thead><tr><th scope="col">Співробітник</th><th scope="col">Днів</th><th scope="col">Середня ефективність</th><th scope="col">Відпрацьовано годин</th></tr></thead>
        <tbody>{sortedUsers.map(({ user }) => { const item = summaryById.get(user.userID); return <tr key={user.userID}><th scope="row">{user.name}</th><td>{item.days}</td><td>{item.days ? `${formatNumber(item.efficiency / item.days)}%` : '—'}</td><td>{formatNumber(item.hours)} год</td></tr>; })}</tbody>
        <tfoot><tr><th scope="row">Уся команда</th><td>{totals.days}</td><td>{totals.days ? `${formatNumber(totals.efficiency / totals.days)}%` : '—'}</td><td>{formatNumber(totals.hours)} год</td></tr></tfoot>
      </table></div>
    </div>}
  </section>;
};

Timesheet.propTypes = { version: PropTypes.number.isRequired, onOpenDay: PropTypes.func.isRequired };
export default Timesheet;
