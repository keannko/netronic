import { useState } from "react";
import s from "./HamburgerMenu.module.scss";

const HamburgerMenu = () => {
  const [menuActive, setMenuActive] = useState(false);

  const handleClick = () => {
    setMenuActive(!menuActive)
  }
  return (
    <>
   <div className={s.wrapper}>
      <nav role="navigation">
        <div className={s.menuToggle}>
      <input type="checkbox" checked={menuActive}  onChange={handleClick}/>
      <span></span>
      <span></span>
      <span></span>
      <ul className={s.menu} onClick={handleClick}>
              <li ><a  href="/#aboutUs">Про нас</a></li>
              <li ><a  href="/#areasOfActivity">Проекти</a></li>
              <li ><a  href="/#ourResults">Кому допомогли</a></li>
              <li ><a  href="/#ourTeam">Команда</a></li>
              <li ><a  href="/#footer">Контакти</a></li>
              <li ><a  href="/auth">Кабінет</a></li>
            </ul>
    </div>
  </nav>
   </div>
    </>
  );
};

export default HamburgerMenu;


