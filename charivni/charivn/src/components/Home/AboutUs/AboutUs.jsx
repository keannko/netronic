import s from "./AboutUs.module.scss";

const AboutUs = () => {
  return (
    <>
      <div className={s.aboutUsBlock} id='aboutUs'>
        <div className={s.aboutUsBlock_title}>Про благодійну організацію</div>
        <div className={s.aboutUsBlock_about}>
          БО “Благодійний фонд “Чарівниці Добра” - є продовженням волонтерської<br />
          діяльності Благодійного клубу “40 петель Добра. Україна”, створеного у
          2018<br /> році. Основним напрямком нашої діяльності є благодійне в’язання
          та<br /> рукоділля.
        </div>
        <img className={s.aboutUsBlock_img} src="/aboutUsImg.png" alt="" />
      </div>
    </>
  );
};

export default AboutUs;
