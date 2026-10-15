import { NavLink } from "react-router-dom";
import s from "./AddToOurTeam.module.scss";

const AddToOurTeam = () => {
  return (
    <>
      <div className={s.AddToOurTeamWrapper} id='ourTeam'>
        <img className={s.bgImg} src="./illustrationAddToOurTeam.png" alt="" />
        <div className={s.AddToOurTeam_title}>Долучайся до нашої команди</div>
        <div className={s.AddToOurTeam_content}>
          Ми хочемо огорнути теплом всю Україну, щоб жоден куточок не залишився
          без нашої допомоги. Якщо ти - відповідальна людина з добрим серцем, то
          ми потребуємо саме тебе!
        </div>
        <div className={s.AddToOurTeam_content2}>
          ЗАПОВНИ ПРОСТУ ФОРМУ РЕЄСТРАЦІЇ І З ТОБОЮ ЗВ’ЯЖЕТЬСЯ НАШ КООРДИНАТОР
        </div>
        <NavLink to={"/questionnaire"}>
          <button className={s.AddToOurTeam_btn}>Заповнити анкету</button>
        </NavLink>
      </div>
    </>
  );
};

export default AddToOurTeam;
