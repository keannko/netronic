import { NavLink } from "react-router-dom";
import Modal from "../Modal/Modal";
import HamburgerMenu from "./HamburgerMenu/HamburgerMenu";
import s from "./Header.module.scss";

const Header = () => {
  return (
    <>
      <div className={s.headerWrapper}>
        <div>
          <NavLink to={"/"}>
            <img className={s.headerLogo} src="/Logo.png" alt="" />
          </NavLink>
        </div>
        <div>
          <ul className={s.headerList}>
            <li className={s.headerListItem}><a className={s.linkToSection} href="/#aboutUs">Про нас</a></li>
            <li className={s.headerListItem}><a className={s.linkToSection} href="/#areasOfActivity">Проекти</a></li>
            <li className={s.headerListItem}><a className={s.linkToSection} href="/#ourResults">Кому допомогли</a></li>
            <li className={s.headerListItem}><a className={s.linkToSection} href="/#ourTeam">Команда</a></li>
            <li className={s.headerListItem}><a className={s.linkToSection} href="/#footer">Контакти</a></li>
            <li className={s.headerListItem}><a className={s.linkToSection} href="/auth">Кабінет</a></li>
          </ul>
        </div>
        <Modal modalContent={'Анкету успішно відправлено'}/>
        <HamburgerMenu />
      </div>
    </>
  );
};

export default Header;
