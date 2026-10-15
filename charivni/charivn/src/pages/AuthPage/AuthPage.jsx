import { useState } from "react";
import EnterForm from "../../components/AuthPage/EnterForm/EnterForm";
import RegistrationForm from "../../components/AuthPage/RegistrationForm/RegistrationForm";
import s from "./AuthPage.module.scss";

const AuthPage = () => {
  const [authFormStatus, setAuthFormStatus] = useState('Enter');

  const handleEnterClick = () => {
    setAuthFormStatus('Enter')
  }

  const handleRegistrationClick = () => {
    setAuthFormStatus('Registration')
  }
  
  return (
    <>
      <div className={s.wrapper}>
        <div className={s.registrationForm}>
          <p className={s.registrationForm_title}>Особистий кабінет</p>
          <div className={s.registrationForm_variants}>
          <p className={authFormStatus === 'Enter' ? ` ${s.active}` : s.registrationForm_variants_text} onClick={handleEnterClick}>Вхід</p>
          <p className={authFormStatus === 'Registration' ? `${s.active}` : s.registrationForm_variants_text} onClick={handleRegistrationClick}>Реєстрація</p>
          </div>
          <div>
            {
              authFormStatus === 'Enter' ? <EnterForm /> : <RegistrationForm formStatus={setAuthFormStatus}/>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
