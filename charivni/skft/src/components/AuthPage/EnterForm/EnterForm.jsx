import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isAuth } from "../../../redux/slices/userSlice";
import { loginUser } from "../../../utils/auth";
import * as Yup from "yup";
import s from "./EnterForm.module.scss";

const initialValues = {
  email: "admin@gmail.com",
  password: "123",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Введіть коректну електронну адресу").required("Введіть електронну адресу"),
  password: Yup.string().required("Введіть пароль")
});

const EnterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values, { setSubmitting }) => {

    try {
      const user = await loginUser(values);
      if (!user) {
        setMessage("Невірна електронна адреса або пароль.");
        return;
      }
      dispatch(isAuth(true));
      navigate('/cabinet');
    } catch (error) {
      setMessage(error.response?.data?.message || "Сервер недоступний. Перевірте, чи запущено API.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={s.formWrapper}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form className={s.form} onChange={() => setMessage("")}>
            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="email">Електронна адреса</label>
              <Field className={s.form_input_text} type="email" id="email" name="email" autoComplete="username" placeholder="name@company.com" aria-describedby="email-error" />
              <ErrorMessage id="email-error" name="email" component="div" className={s.error} />
            </div>
            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="password">Пароль</label>
              <div className={s.passwordField}>
                <Field className={s.form_input_text} type={showPassword ? "text" : "password"} id="password" name="password" autoComplete="current-password" placeholder="Введіть пароль" aria-describedby="password-error" />
                <button className={s.passwordToggle} type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Приховати пароль" : "Показати пароль"} aria-pressed={showPassword}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {showPassword && <path d="m3 3 18 18" />}
                  </svg>
                </button>
              </div>
              <ErrorMessage id="password-error" name="password" component="div" className={s.error} />
            </div>
            <button className={s.submitButton} type="submit" disabled={isSubmitting}>Увійти <span aria-hidden="true">↗</span></button>
            {message && <p className={s.message} role="status">{message}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EnterForm;