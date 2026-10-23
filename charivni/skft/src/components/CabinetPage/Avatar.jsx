import PropTypes from 'prop-types';
import s from './UserCabinet/UserCabinet.module.scss';

export default function Avatar({ user, className = '' }) {
  const initials = (user.name || user.email || '?').trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  return <span className={`${s.avatarImage} ${className}`} aria-label={`Аватар: ${user.name || user.email}`}>
    {user.avatar ? <img src={user.avatar} alt="" /> : initials}
  </span>;
}

Avatar.propTypes = { user: PropTypes.shape({ name: PropTypes.string, email: PropTypes.string, avatar: PropTypes.string }).isRequired, className: PropTypes.string };
