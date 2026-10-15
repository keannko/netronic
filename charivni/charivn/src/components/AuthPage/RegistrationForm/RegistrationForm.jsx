import { Formik, Field, Form, ErrorMessage } from "formik";
import { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import $api from "../../../http";
import { isModal } from "../../../redux/slices/modalSlice";
import Modal from "../../Modal/Modal";
import s from "./RegistrationForm.module.scss";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Обов'язкове поле"),
  email: Yup.string()
    .email("Невірний формат email")
    .required("Обов'язкове поле"),
  phone: Yup.string()
    .required("Введіть номер мобільного телефону")
    .typeError("Введіть номер мобільного телефону"),
  password: Yup.string()
    .min(6, 'Мінімально кількість символів - 6')
    .required("Обов'язкове поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Паролі повинні співпадати')
    .required("Обов'язкове поле"),
});

const RegistrationForm = (props) => {
  const [modalContent, setModalContent] = useState("")
  const dispatch = useDispatch()
  const {formStatus} = props
  

  const onSubmit = async (values, { resetForm }) => {
    const data = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      region: 'test',
      volunteerType: 'test',
      town: 'test',
      password: values.password,
    }
    const result = await $api.post('/users/registration', data)
    console.log(result.data)
    if(result.data === 'duplicate') {
      setModalContent('Спробуйте інший email')
      dispatch(isModal(true))
    }else{
      setModalContent('Реєстрацію успішно завершено')
      dispatch(isModal(true))
      resetForm();
      setTimeout(() => {
        dispatch(isModal(false))
        formStatus('Enter')
      }, 1200);
    }
    
  };

  const handleClick = () => {
    console.log('click')
  }

  return (
    <>
      <div className={s.formWrapper}>
    <Modal modalContent={modalContent}/>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className={s.form}>

            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="name">
                Прізвище та ім’я
              </label>
              <Field
                className={s.form_input_text}
                type="text"
                id="name"
                name="name"
                placeholder="Введіть текст..."
              />
              <ErrorMessage name="name" component="div" className={s.error} />
            </div>

            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="email">
                Електронна адреса
              </label>
              <Field
                className={s.form_input_text}
                type="email"
                id="email"
                name="email"
                placeholder="yourmail@gmail.com"
              />
              <ErrorMessage name="email" component="div" className={s.error} />
            </div>

       

            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="phone">
                Номер телефону
              </label>
              <Field name="phone">
                {({ field }) => (
                  <InputMask
                    {...field}
                    mask="+38(999) 999-99-99"
                    maskChar="_"
                    type="text"
                    id="phone"
                    className={s.form_input_text}
                    placeholder="+38(___) ___-__-__"
                  />
                )}
              </Field>
              <ErrorMessage name="phone" component="div" className={s.error} />
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
                placeholder="Введіть текст..."
              />
              <ErrorMessage name="password" component="div" className={s.error} />
            </div>
            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="confirmPassword">
                Підтвердження пароля
              </label>
              <Field
                className={s.form_input_text}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Введіть текст..."
              />
              <ErrorMessage name="confirmPassword" component="div" className={s.error} />
            </div>


            <div className={s.buttonsBlock}>
              <button className={s.buttonsBlock_button1} type="submit">
                Зареєструватися
              </button>
              <button className={s.buttonsBlock_button2} type='reset' onClick={handleClick}>
                Очистити форму
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default RegistrationForm;

