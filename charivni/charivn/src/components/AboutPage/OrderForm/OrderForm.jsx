import { Formik, Field, Form, ErrorMessage } from "formik";
import InputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { isConfirmModal } from "../../../redux/slices/modalSlice";
import { request } from "../../../tools/Axios/request";
import s from "./OrderForm.module.scss";

const initialValues = {
  name: "",
  phone: "",
  town: "",
  novapost: "",
  comment: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Обов'язкове поле"),
  phone: Yup.string()
    .required("Введіть номер мобільного телефону")
    .typeError("Введіть номер мобільного телефону"),
  town: Yup.string().required("Обов'язкове поле").typeError("Помилка"),
  novapost: Yup.string().required("Обов'язкове поле").typeError("Помилка"),
  comment: Yup.string().typeError("Помилка"),
});

const OrderForm = () => {
  const dispatch = useDispatch()
  const { id } = useParams();

  const onSubmit =async (values, { resetForm }) => {
  values.productId = id
  await request('https://api.charivnyci-dobra.com.ua/orders/create', 'post', values)
    dispatch(isConfirmModal(true))
    resetForm();
  };

  const handleClick = () => {
    console.log('click')
  }

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
              <label className={s.form_input_label} htmlFor="town">
                Місто доставки
              </label>
              <Field
                className={s.form_input_text}
                type="text"
                id="town"
                name="town"
                placeholder="Введіть назву міста"
              />
              <ErrorMessage name="town" component="div" className={s.error} />
            </div>

            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="novapost">
                Відділення Нової Пошти
              </label>
              <Field
                className={s.form_input_text}
                type="text"
                id="novapost"
                name="novapost"
                placeholder="Введіть назву міста"
              />
              <ErrorMessage
                name="novapost"
                component="div"
                className={s.error}
              />
            </div>

            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="comment">
                Коментар
              </label>
              <Field
                className={s.form_input_text}
                type="text"
                id="comment"
                name="comment"
                placeholder="Введіть назву міста"
              />
              <ErrorMessage
                name="comment"
                component="div"
                className={s.error}
              />
            </div>

            <div className={s.buttonsBlock}>
              <button className={s.buttonsBlock_button1} type="submit">
                Оформити замовлення
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

export default OrderForm;
