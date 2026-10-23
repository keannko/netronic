import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import $api from "../../../http";
import AdminPage from "./AdminPage/AdminPage";
import MyData from "./MyData/MyData";
import s from "./PrivateCabinet.module.scss";

const PrivateCabinet = () => {
  const [selectListItem, setSelectListItem] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const navigate = useNavigate();
  let content;

  const handleClick = () => {
    $api.post("users/logout");
    navigate("/auth");
  };

  const handleMenuItemClick = (item) => {
    setSelectListItem(item);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await $api.get("/users/bytoken");
      setUserInfo(data.data[0]);
    }
    fetchData();
  }, []);

  {
    switch (selectListItem) {
      case "Мої дані":
        content = <MyData userInfo={userInfo} />;
        break;
      case "Інше":
        content = "Інше";
        break;
      default:
        content = <MyData userInfo={userInfo} />;
    }
  }

  return (
    <>
      <div className={s.wrapper}>
        <p className={s.cabinetTitle}>Особистий кабінет</p>
        <div>
          <button className={s.backButton} onClick={handleClick}>
            Вихід
          </button>
        </div>
        {userInfo?.role === "user" ? (
          <div className={s.cabinetSidebar}>
            <ul className={s.cabinetSidebar_list}>
              <li onClick={() => handleMenuItemClick("Мої дані")}>Мої дані</li>
              <li onClick={() => handleMenuItemClick("Інше")}>Інше</li>
            </ul>

            <div className={s.cabinetSidebar_content}>{content}</div>
          </div>
        ) : (
          <AdminPage userInfo={userInfo} />
        )}
      </div>
    </>
  );
};

export default PrivateCabinet;
