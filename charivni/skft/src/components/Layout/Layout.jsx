import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import s from './Layout.module.scss'

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/'; 

  return (
    <div className={`${isHomePage ? s.layoutWrapper : ''}`}>
      <div>
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
