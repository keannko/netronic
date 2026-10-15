import s from "./ErrorPage.module.scss";

const ErrorPage = () => {
  return (
    <>
      <div className={s.wrapper}>
        <p>Помилка 404</p>
        <p>Сторінку не знайдено</p>
      </div>
    </>
  );
};

export default ErrorPage;
