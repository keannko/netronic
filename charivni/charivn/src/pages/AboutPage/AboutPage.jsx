import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import OrderForm from "../../components/AboutPage/OrderForm/OrderForm";
import ConfirmOrderModal from "../../components/ConfirmOrderModal/ConfirmOrderModal";
import { request } from "../../tools/Axios/request";
import s from "./AboutPage.module.scss";

const AboutPage = () => {
  const [product, setProduct] = useState({});
  const { id } = useParams();


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await request(
          `https://api.charivnyci-dobra.com.ua/products/${id}`
        );
        setProduct(response[0]);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    fetchProduct();
  }, [id]);
console.log(product)


  return (
    <>
      <div className={s.wrapper}>
        <div className={s.aboutPage_titleBlock}>
          <NavLink to="/shop"><button className={s.aboutPage_titleBlock_button}>Назад</button></NavLink>
          <p className={s.aboutPage_titleBlock_title}>{product?.title}</p>
        </div>
        <div className={s.aboutPage}>
          <img className={s.aboutPage_img} src={product?.img} alt="" />
          <div className={s.aboutPage_content}>
              <div>{product?.description}</div>
              <div>В наявності: {product?.quantity}шт.</div>
            <OrderForm />
            <ConfirmOrderModal />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
