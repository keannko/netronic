import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isAuth } from "../../redux/slices/userSlice";
import { refreshUser, logoutUser } from "../../utils/auth";
import s from "./CabinetPage.module.scss";
import AdminCabinet from "../../components/CabinetPage/AdminCabinet/AdminCabinet";
import UserCabinet from "../../components/CabinetPage/UserCabinet/UserCabinet";
import Avatar from "../../components/CabinetPage/Avatar";
import GradeStars from "../../components/CabinetPage/GradeStars";

const CabinetPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadVersion, setLoadVersion] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [homeVersion, setHomeVersion] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const loadCabinet = async () => {
      try {
        const currentUser = await refreshUser();
        if (!active) return;
        setUser(currentUser);
        dispatch(isAuth(true));

      } catch (error) {
        if (!active) return;
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          dispatch(isAuth(false));
        } else {
          setError(error.response?.data?.message || 'Сервер недоступний. Перевірте, чи запущено API.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCabinet();
    return () => { active = false; };
  }, [dispatch, loadVersion]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      dispatch(isAuth(false));
      navigate('/auth', { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || 'Не вдалося вийти. Перевірте з’єднання із сервером.');
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading || error) return (
    <div className={s.wrapper}>
      <main className={s.content}>
        <img src="/images/skiftech-logo.svg" alt="SKIFTECH" className={s.logo} />
        <p className={s.description} role="status">{loading ? 'Завантаження кабінету…' : error}</p>
        {!loading && <button className={s.logout} onClick={() => setLoadVersion(value => value + 1)}>Спробувати ще раз</button>}
      </main>
    </div>
  );

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className={s.wrapper}>
      <header className={s.header}>
        <Link to="/cabinet" className={s.logoLink} onClick={() => setHomeVersion(value => value + 1)} aria-label="На головний екран кабінету"><img src="/images/skiftech-logo.svg" alt="SKIFTECH" className={s.logo} /></Link>
        <div className={s.headerActions}><Avatar user={user} className={s.headerAvatar} /><span>{user.email}</span><button onClick={handleLogout} disabled={loggingOut} className={s.logout}>Вийти ↗</button></div>
      </header>
      <main className={s.content}>
        <div className={s.breadcrumb}>SKIFTECH / ОСОБИСТИЙ КАБІНЕТ</div>
        <div className={s.heading}>
          <div><p className={s.eyebrow}>ВАШ ПРОСТІР SKIFTECH</p><h1>Вітаємо, <span>{user.name}</span><GradeStars grade={user.grade} /></h1><p className={s.description}>Усе необхідне для роботи — в одному місці.</p></div>
        </div>
        {user.role === 'user' ? <UserCabinet key={homeVersion} user={user} onUpdate={setUser} /> : <AdminCabinet key={homeVersion} currentUser={user} onUpdate={setUser} />}
      </main>
      <footer className={s.footer}>© {new Date().getFullYear()} SKIFTECH <span>ТЕХНОЛОГІЇ, ЩО ГОТУЮТЬ ДО РЕАЛЬНОСТІ</span></footer>
    </div>
  );
};

export default CabinetPage;
