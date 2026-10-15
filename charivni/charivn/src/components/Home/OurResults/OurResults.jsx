import s from "./OurResults.module.scss";

const OurResults = () => {
  return (
    <>
      <div className={s.ourResultsWrapper} id='ourResults'>
        <div className={s.ourResults_title}>Результати нашої роботи</div>
        <div className={s.ourResults_content}>
          <div className={s.ourResults_content_item}>
            <div className={s.ourResults_content_result}>0</div>
            <div className={s.ourResults_content_text}>організацій, центрів, онколікарень отримали нашу допомогу</div>
          </div>
          <div className={s.ourResults_content_item}>
            <div className={s.ourResults_content_result}>0</div>
            <div className={s.ourResults_content_text}>кілограм спонсорських ниток для в’язання зібрано</div>
          </div>
          <div className={s.ourResults_content_item}>
            <div className={s.ourResults_content_result}>0</div>
            <div className={s.ourResults_content_text}>одиниць в’язаних виробів (одяг, іграшки) зібрано</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurResults;
