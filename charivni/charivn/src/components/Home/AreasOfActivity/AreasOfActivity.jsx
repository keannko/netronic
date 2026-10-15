import s from "./AreasOfActivity.module.scss";

const AreasOfActivity = () => {
  return (
    <>
      <div className={s.AreasOfActivity} id='areasOfActivity'>
        <div className={s.AreasOfActivity_title}>
          Основні напрямки діяльності
        </div>
        <div className={s.AreasOfActivity_subtitle}>
          Ми допомагаємо тим, хто має потребу, просто завдяки своєму хоббі та
          <br />
          таланту і даруємо тепло і затишок навіть на відстані.
        </div>
        <div className={s.AreasOfActivity_imgsBlock}>
          <div className={s.AreasOfActivity_imgsBlock_item}>
            <img src="/areas1.png" alt="" />
            <div className={s.AreasOfActivity_imgsBlock_title}>
              Благодійність
            </div>
            <div className={s.AreasOfActivity_imgsBlock_content}>
              Ми співпрацюємо з інтернатами, дитячими будинками, геріатричними
              пансіонатами, Центрами матері та дитини, Центрами реабілітації
              дітей, соціальними центрами. Допомагаємо онкохворим дітям, дітям
              ВПО та військовим.
            </div>
          </div>
          <div className={s.AreasOfActivity_imgsBlock_item}>
            <img src="/areas2.png" alt="" />
            <div className={s.AreasOfActivity_imgsBlock_title}>
              Марафони Добра
            </div>
            <div className={s.AreasOfActivity_imgsBlock_content}>
              Проводимо “Марафони Добра” - тематичні навчальні онлайн-зустрічі,
              з метою залучення волонтерів до нашої дружньої команди. В кінці
              марафону ті, хто пройшов з нами до кінця, можуть отримати
              заохочувальний приз.
            </div>
          </div>
          <div className={s.AreasOfActivity_imgsBlock_item}>
            <img src="/areas3.png" alt="" />
            <div className={s.AreasOfActivity_imgsBlock_title}>
              Уроки майстерності
            </div>
            <div className={s.AreasOfActivity_imgsBlock_content}>
              Проводимо цікаві майстер-класи із в’язання для дітей з інтернатів,
              онкоцентрів, а також для дітей та жінок, які постраждали від війни
              ( з метою їх психологічної реабілітації, розвитку здібностей та
              творчого потенціалу).
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AreasOfActivity;
