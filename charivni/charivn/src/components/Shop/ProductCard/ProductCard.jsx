/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import s from "./ProductCard.module.scss";

const ProductCard = ({ product }) => {
  return (
    <>
      <div className={s.productCard}>
        <img
          className={s.productCard_img}
          src={product.img}
          alt="productImage"
        />
        <div className={s.productCard_priceBlock}>
          <p>Ціна товару:</p>
          <p>{product.price}грн.</p>
        </div>
        <div className={s.productCard_buttonsBlock}>
          <NavLink to={`/about/${product.id}`}>
            <button className={s.productCard_button}>Купити</button>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
