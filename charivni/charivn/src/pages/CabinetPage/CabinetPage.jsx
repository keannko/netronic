// import s from "./CabinetPage.module.scss";

import { useSelector } from "react-redux";
import PrivateCabinet from "../../components/CabinetPage/PrivateCabinet/PrivateCabinet";

const CabinetPage = () => {
  const Auth = useSelector((state) => state.user.isAuth);
  return <>{Auth ? <PrivateCabinet /> : <div>unregister</div>}</>;
};

export default CabinetPage;
