import PropTypes from 'prop-types';
import s from './UserCabinet/UserCabinet.module.scss';

export default function GradeStars({ grade }) {
  const count = Math.min(3, Math.max(0, Number(grade) || 0));
  if (!count) return null;
  return <span className={s.gradeStars} aria-label={`Грейд ${count} з 3`} title={`Грейд ${count} з 3`}>{'★'.repeat(count)}</span>;
}

GradeStars.propTypes = { grade: PropTypes.number };
