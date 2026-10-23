import EnterForm from "../../components/AuthPage/EnterForm/EnterForm";
import s from "./AuthPage.module.scss";

const AuthPage = () => {
  return (
    <div className={s.wrapper}>
      <header className={s.header}>
        <a href="/" aria-label="SKIFTECH — головна">
          <img className={s.logo} src="/images/skiftech-logo.svg" alt="SKIFTECH" />
        </a>
        <span className={s.headerLabel}>ОСОБИСТИЙ КАБІНЕТ</span>
      </header>
      <main className={s.content}>
        <section className={s.intro}>
          <p className={s.eyebrow}><span /> SKIFTECH / PERSONAL ACCOUNT</p>
          <h1>Технології.<br />Підготовка.<br /><span>Перевага.</span></h1>
          <p className={s.description}>Ваш простір у системі SKIFTECH.<br />Увійдіть, щоб продовжити роботу.</p>
          <div className={s.brandLine}><span /> ГОТОВНІСТЬ ПОЧИНАЄТЬСЯ З ПІДГОТОВКИ</div>
        </section>
        <section className={s.loginPanel} aria-labelledby="login-title">
          <span className={s.panelLabel}>01 / АВТОРИЗАЦІЯ</span>
          <h2 id="login-title">Вхід у кабінет</h2>
          <p className={s.panelDescription}>Введіть дані вашого облікового запису.</p>
          <EnterForm />
          <p className={s.support}>Немає доступу? Зверніться до адміністратора.</p>
        </section>
      </main>
      <footer className={s.footer}><span>© {new Date().getFullYear()} SKIFTECH</span><span>ТЕХНОЛОГІЇ, ЩО ГОТУЮТЬ ДО РЕАЛЬНОСТІ</span></footer>
    </div>
  );
};

export default AuthPage;