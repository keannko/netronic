import { useState } from "react";
import s from "./Sponsors.module.scss";

const Sponsors = () => {
  const [allImages, setallImages] = useState([1, 2, 3, 4, 5]);
  const [showImages, setshowImages] = useState([1, 2, 3, 4]);

  const handleLeftArrowClick = () => {
    if (allImages.length > 4) {
      const firstImages = allImages.slice(0, 3);
      const lastImages = allImages.slice(3);
      const removedItem = lastImages.pop();
      firstImages.unshift(removedItem);
      setshowImages(firstImages);
      setallImages(firstImages.concat(lastImages));
    }
  };

  const handleRightArrowClick = () => {
    if (allImages.length > 4) {
      const firstImages = allImages.slice(0, 4);
      const lastImages = allImages.slice(4);
      const removedItem = lastImages.shift(); 
      const removedItem2 = firstImages.shift(); 
      firstImages.push(removedItem); 
      lastImages.push(removedItem2); 
      setshowImages(firstImages);
      setallImages(firstImages.concat(lastImages));
    }
  };

  return (
    <div className={s.sponsorsWrapper}>
      <div className={s.sponsors_title}>Організації, які нас підтримують</div>
      <div className={s.sponsors_imgsBlock}>
        <span className={s.leftArrow} onClick={handleLeftArrowClick}></span>
        {showImages.map((x) => (
          <div key={`sponsor${x}`}>
            <img
              src={`./sponsors/sponsor${x}.png`}
              alt="sponsorLogo"
            />
          </div>
        ))}
        <span className={s.rightArrow} onClick={handleRightArrowClick}></span>
      </div>
    </div>
  );
};

export default Sponsors;
