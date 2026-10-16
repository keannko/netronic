import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getTimesheet } from "../../../utils/admin";
import { getEfficiencyStyle } from "../../../utils/efficiency";
import s from "../UserCabinet/UserCabinet.module.scss";

const Timesheet = ({ version, onOpenDay }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

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

  return <section className={s.card}>
    <div className={s.cardHeading}><div><h2>Табель усіх користувачів</h2><p className={s.month}>{title}</p></div><button type="button" className={s.cancelButton} disabled={loading} onClick={() => setRetry(value => value + 1)}>Оновити</button></div>
    <p className={s.hint}>Для заповненого дня: ефективність зверху, відпрацьовані години нижче. Без внесеного часу — «—». Натисніть на день, щоб переглянути або змінити звіт.</p>
    <p className={s.legend}>100% — зелений · менше — до червоного · більше — до синього. Вихідні — жовті.</p>
    {loading ? <p className={s.hint} role="status">Завантаження актуального табеля…</p> : error ? <p className={s.error} role="alert">{error}</p> : <div className={s.tableWrapper} tabIndex="0" role="region" aria-label="Табель робочого часу та ефективності">
      <table className={`${s.hoursTable} ${s.adminTimesheet}`}>
        <caption className={s.srOnly}>Робочий час та ефективність: {title}</caption>
        <thead><tr><th scope="col">Співробітник</th>{users[0]?.days.map(day => <th scope="col" key={day.date} className={day.isWeekend ? s.weekend : ''}><span>{day.day}</span><small>{new Intl.DateTimeFormat('uk-UA', { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${day.date}T12:00:00Z`))}</small></th>)}</tr></thead>
        <tbody>{users.map(item => <tr key={item.user.userID}>
          <th scope="row">{item.user.name}<small>{item.user.email}</small></th>
          {item.days.map(day => {
            const entry = item.entries.find(entry => entry.date === day.date);
            const hours = entry?.hoursWorked ?? day.hours;
            const hasTime = hours != null && Number(hours) > 0;
            const efficiency = hasTime ? (entry?.efficiency ?? day.efficiency ?? 0) : null;
            return <td key={day.date} className={day.isWeekend ? s.weekend : ''}>
              <button type="button" className={s.dayButton} style={getEfficiencyStyle(efficiency)} disabled={day.date > item.today} aria-label={`${item.user.name}, ${day.date}: ${hasTime ? `${efficiency}%, ${hours} год` : 'час не внесено'}`} onClick={() => onOpenDay(item, day.date)}>
                {hasTime ? <><strong className={s.dayEfficiency}>{efficiency}%</strong><small className={s.dayHours}>{hours} год</small></> : <span className={s.noWorkday}>—</span>}
              </button>
            </td>;
          })}
        </tr>)}</tbody>
      </table>
      {!users.length && <p className={s.hint}>Користувачів поки немає.</p>}
    </div>}
  </section>;
};

Timesheet.propTypes = { version: PropTypes.number.isRequired, onOpenDay: PropTypes.func.isRequired };
export default Timesheet;