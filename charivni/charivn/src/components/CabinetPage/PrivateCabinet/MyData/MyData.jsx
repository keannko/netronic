import s from "./MyData.module.scss";

import { useEffect } from "react";

const MyData = (props) => {
  const { userInfo } = props;
  useEffect(() => {}, []);

  return (
    <>
      <div className={s.myDataList_title}>Мої дані:</div>

      <ul className={s.myDataList}>
        <li>
          <p>
            Ім'я: <span>{userInfo.name}</span>
          </p>
        </li>
        <li>
          <p>
            Пошта: <span>{userInfo.email}</span>
          </p>
        </li>
        <li>
          <p>
            Телефон: <span>{userInfo.phone}</span>
          </p>
        </li>   
      </ul>

      {/* <p>{userInfo.region}</p>
      <p>{userInfo.role}</p>
      <p>{userInfo.town}</p>
      <p>{userInfo.volunteerType}</p> */}
    </>
  );
};

export default MyData;
