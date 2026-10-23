import { NavLink } from "react-router-dom";
import Blog from "../../components/Blog/Blog";
import AboutUs from "../../components/Home/AboutUs/AboutUs";
import AddToOurTeam from "../../components/Home/AddToOurTeam/AddToOurTeam";
import AreasOfActivity from "../../components/Home/AreasOfActivity/AreasOfActivity";
import OurResults from "../../components/Home/OurResults/OurResults";
import Sponsors from "../../components/Home/Sponsors/Sponsors";
import s from "./Home.module.scss";

const Home = () => {
  return (
    <>
      <div className={s.mainScreenWrapper}>
        <h1 className={s.mainScreenWrapper_title}>
          Дарувати <br /> тепло легко
        </h1>
        <div className={s.mainScreenWrapper_title_hide}>
          Дарувати тепло легко
        </div>
        <div className={s.mainScreenWrapper_subtitle}>
          Бажаєш допомогти тому, хто має потребу і маєш можливість це робити?
          <br />
          Тоді ми запрошуємо тебе до нашої дружньої команди.
        </div>
        <div className={s.mainScreenWrapper_buttonsBlock}>
          <NavLink to={"/help"}>
            <button className={`${s.mainScreenWrapper_button} ${s.firstButton}`}>
              Допомогти фонду
            </button>
          </NavLink>
          <NavLink to={"/shop"}>
            <button className={s.mainScreenWrapper_button}>
              Перейти у крамницю добра
            </button>
          </NavLink>
        </div>
      </div>
      <Blog />
      <AboutUs />
      <AreasOfActivity />
      <OurResults />
      <AddToOurTeam />
      <Sponsors />
    </>
  );
};

export default Home;
