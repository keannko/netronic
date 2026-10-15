import { useEffect, useState } from "react";
import ProductCard from "../../components/Shop/ProductCard/ProductCard";
import $api from "../../http";
import { request } from "../../tools/Axios/request";
import s from "./ShopPage.module.scss";

const ShopPage = () => {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await request('https://api.charivnyci-dobra.com.ua/products');
        const response = await $api.get("/products");
        const cleanData = response.data.filter((el) => el.quantity > 0);
        setProductsList(cleanData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className={s.wrapper}>
        <p className={s.shopTitle}>Крамниця добра</p>
        <div className={s.productsList}>
          {productsList.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopPage;
