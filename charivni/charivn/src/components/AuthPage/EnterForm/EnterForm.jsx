import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import $api from "../../../http";
import { isAuth } from "../../../redux/slices/userSlice";
import s from "./EnterForm.module.scss";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().required("Обов'язкове поле"),
  password: Yup.string()
    .required("Обов'язкове поле")
});

const EnterForm = () => {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const onSubmit = async (values, { resetForm }) => {
    try {
      setEmailError('');
      setPasswordError('');
      const resp = await $api.post('users/login', values)
      if (resp.data.message === "email not found in DB") {
        setEmailError('Користувача з таким логіном не існує');
      }
      if (resp.data.message === "incorrect password") {
        setPasswordError('Пароль не вірний');
      }
      if(resp.data.accessToken && resp.data.refreshToken) {
        localStorage.setItem('token',resp.data.accessToken)
        dispatch(isAuth(true))
        navigate('/cabinet')
      }
    resetForm();
    } catch (error) {
      throw new Error
    }
  };

  return (
    <>
      <div className={s.formWrapper}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className={s.form}>
            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="email">
                Логін(Електронна адреса)
              </label>
              <Field
                className={s.form_input_text}
                type="text"
                id="email"
                name="email"
                placeholder="Введіть логін..."
              />
              <ErrorMessage name="email" component="div" className={s.error} />
              {emailError && <div className={s.error}>{emailError}</div>}
            </div>

            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="password">
                Пароль
              </label>
              <Field
                className={s.form_input_text}
                type="password"
                id="password"
                name="password"
                placeholder="Введіть пароль..."
              />
              <ErrorMessage
                name="password"
                component="div"
                className={s.error}
              />
              {passwordError && <div className={s.error}>{passwordError}</div>}
            </div>

            <div className={s.buttonsBlock}>
              <button className={s.buttonsBlock_button1} type="submit">
                Увійти
              </button>
              <button
                className={s.buttonsBlock_button2}
                type="reset"
              >
                Очистити форму
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default EnterForm;
