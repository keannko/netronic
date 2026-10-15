import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import InputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { request } from "../../tools/Axios/request";
import { isModal } from "../../redux/slices/modalSlice";
import s from "./QuestionnairePage.module.scss";
import { useNavigate } from "react-router-dom";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  region: "",
  town: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Обов'язкове поле"),
  email: Yup.string()
    .email("Невірний формат email")
    .required("Обов'язкове поле"),
  phone: Yup.string()
    .required("Введіть номер мобільного телефону")
    .typeError("Введіть номер мобільного телефону"),
  region: Yup.string().required("Обов'язкове поле").typeError("Помилка"),
  town: Yup.string().required("Обов'язкове поле").typeError("Помилка"),
});

const regions = [
  { id: "kyiv", name: "Київська область" },
  { id: "vinntsa", name: "Вінницька область" },
  { id: "volyn", name: "Волинська область" },
  { id: "dniper", name: "Дніпропетровська область" },
  { id: "donetsk", name: "Донецька область" },
  { id: "gitomer", name: "Житомирська область" },
  { id: "zakarpat", name: "Закарпатська область" },
  { id: "zaporiz", name: "Запорізька область" },
  { id: "ivanofrank", name: "Івано-Франківська область" },
  { id: "kirovograd", name: "Кіровоградська область" },
  { id: "lygansk", name: "Луганська область" },
  { id: "lviv", name: "Львівська область" },
  { id: "mikolaev", name: "Миколаївська область" },
  { id: "odessa", name: "Одеська область" },
  { id: "poltava", name: "Полтавська область" },
  { id: "rivne", name: "Рівненська область" },
  { id: "symu", name: "Сумська область" },
  { id: "ternopol", name: "Тернопільська область" },
  { id: "kharkiv", name: "Харківська область" },
  { id: "herson", name: "Херсонська область" },
  { id: "hmelnizk", name: "Хмельницька область" },
  { id: "cherkasu", name: "Черкаська область" },
  { id: "chernivcu", name: "Чернівецька область" },
  { id: "chernigiv", name: "Чернігівська область" },
  { id: "krum", name: "АР Крим" },
];

const QuestionnairePage = () => {
  const [emailError, setEmailError] = useState("");
  const [volunteerType, setvolunteerType] = useState();
  const [status, setStatus] = useState(false);
  const [statusInputValue, setStatusInputValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleCheckboxChange = (value, text) => {
    setStatus(false);
    if (value.checked && text === "radio") {
      setvolunteerType(value.value);
    } else {
      setvolunteerType("");
    }
  };

  const handleStatus = (e) => {
    setStatus(e);
    setvolunteerType(statusInputValue);
  };

  const handleStatusInput = (e) => {
    setStatusInputValue(e);
    if (status) {
      setvolunteerType(e);
    } else {
      setvolunteerType("");
    }
  };

  const onSubmit = async (values, { resetForm }) => {
    values.volunteerType = volunteerType;
    const resp = await request(
      "https://api.charivnyci-dobra.com.ua/users/registration",
      "post",
      values
    );
    if (resp === "duplicate") {
      setEmailError("Користувач з такою поштовою адресою вже зареєстрован");
    } else {
      // resetForm();
      dispatch(isModal(true));
      setTimeout(() => {
        dispatch(isModal(false));
        navigate('/')
      }, 1500);
    }
  };

  return (
    <>
      <div className={s.formWrapper}>
        <h1 className={s.formTitle}>Анкета волонтера</h1>

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
              {emailError && <div className={s.error}>{emailError}</div>}
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
              <label className={s.form_input_label} htmlFor="region">
                Місце проживання
              </label>
              <Field as="select" name="region" className={s.form_input_text}>
                <option value="">Вибрати область</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="region" component="div" className={s.error} />
            </div>

            <div className={s.form_input}>
              <label className={s.form_input_label} htmlFor="town">
                Вибрати населений пункт
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

            <div className={s.checkBoxBlock}>
              <p className={s.checkBoxBlock_title}>Готовий допомагати як:</p>
              <label className={s.checkBox_item}>
                <input
                  type="radio"
                  name="volunteerType"
                  value={"Волонтер-координатор"}
                  onChange={(e) => {
                    handleCheckboxChange(e.target, "radio");
                  }}
                />
                Волонтер-координатор
              </label>
              <label className={s.checkBox_item}>
                <input
                  type="radio"
                  name="volunteerType"
                  value={"Волонтерство в’язанням"}
                  onChange={(e) => {
                    handleCheckboxChange(e.target, "radio");
                  }}
                />
                Волонтерство в’язанням
              </label>
              <label className={s.checkBox_item}>
                <input
                  type="radio"
                  name="volunteerType"
                  value={"Волонтер на заходах фонду"}
                  onChange={(e) => {
                    handleCheckboxChange(e.target, "radio");
                  }}
                />
                Волонтер на заходах фонду
              </label>
              <label className={s.checkBox_item}>
                <input
                  type="radio"
                  name="volunteerType"
                  onChange={(e) => {
                    handleStatus(e.target.checked);
                  }}
                />
                <input
                  className={s.inputOther}
                  type="text"
                  placeholder="Інше"
                  onChange={(e) => handleStatusInput(e.target.value)}
                />
              </label>
            </div>

            <div className={s.buttonsBlock}>
              <button className={s.buttonsBlock_button1} type="submit">
                Очистити
              </button>
              <button className={s.buttonsBlock_button2} type="submit">
                Надіслати
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default QuestionnairePage;
