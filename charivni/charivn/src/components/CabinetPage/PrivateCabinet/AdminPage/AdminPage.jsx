import { useEffect, useState } from "react";
import $api from "../../../../http";
import AddArticleModal from "../../AddArticleModalWindow/AddArticleModal";
import AddProductsModal from "../../AddProductsModalWindow/AddProductsModal";
import ArticleModal from "../../ArticleModalWindow/ArticleModal";
import ProductsModal from "../../ProductsModalWindow/ProductsModal";
import s from "./AdminPage.module.scss";

const AdminPage = (props) => {
  const [articlesList, setArticlesList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [listUpdate, setListUpdate] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [showArticles, setShowArticles] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [isAddProductsModalOpen, setIsAddProductsModalOpen] = useState(false);

  const { userInfo } = props;

  useEffect(() => {
    const fetchData = async () => {
      const allArticles = await $api.get("/blog");
      setArticlesList(allArticles.data);
    };
    fetchData();
  }, [isModalOpen, listUpdate, isAddModalOpen]);

  useEffect(() => {
    const productsData = async () => {
      const allProducts = await $api.get("/products");
      setProductsList(allProducts.data);
    };
    productsData();
  }, [isProductsModalOpen, isAddProductsModalOpen]);

  useEffect(() => {
    const usersData = async () => {
      const allUsers = await $api.get("/users");
      setUsersList(allUsers.data);
    };
    usersData();
  }, []);

  useEffect(() => {
    const usersData = async () => {
      const allOrders = await $api.get("/orders");
      setOrdersList(allOrders.data);
    };
    usersData();
  }, []);

  const handleArticlesButtonClick = () => {
    setShowArticles((prevShowArticles) => !prevShowArticles);
  };

  const handleProductsButtonClick = () => {
    setShowProducts((prevShowProducts) => !prevShowProducts);
  };

  const handleAddArticlesButtonClick = () => {
    setIsAddModalOpen(true);
  };
  const handleAddProductsButtonClick = () => {
    setIsAddProductsModalOpen(true);
  };

  const handleArticleClick = (articleId) => {
    setSelectedArticle(articleId);
    setIsModalOpen(true);
  };

  const handleProductClick = (productId) => {
    setSelectedProduct(productId);
    setIsProductsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setListUpdate((prevUpdate) => !prevUpdate); // Обновляем список статей после закрытия модального окна добавления статьи
  };

  const handleCloseProductsModal = () => {
    setIsProductsModalOpen(false);
  };

  const handleCloseAddProductsModal = () => {
    setIsAddProductsModalOpen(false);
  };

  const handleDeleteArticleButtonClick = async (id) => {
    try {
      await $api.get(`/blog/delete/${id}`);
      setArticlesList((prevArticles) =>
        prevArticles.filter((article) => article.articleId !== id)
      );
    } catch (error) {
      console.error("Ошибка при удалении статьи:", error);
    }
  };

  const handleDeleteProductButtonClick = async (id) => {
    try {
      await $api.get(`/products/delete/${id}`);
      setProductsList((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Ошибка при удалении товара:", error);
    }
  };

  return (
    <>
      <div className={s.wrapper}>
        <ArticleModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          article={selectedArticle}
        />
        <AddArticleModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
        />
        <ProductsModal
          isOpen={isProductsModalOpen}
          onClose={handleCloseProductsModal}
          product={selectedProduct}
        />
        <AddProductsModal
          isOpen={isAddProductsModalOpen}
          onClose={handleCloseAddProductsModal}
        />
        <div className={s.aboutVersion}>
          <p>ver 0.0.1</p>
        </div>
        <div className={s.blockWrapper}>
          <p>Мої дані</p>
          <div>
            <ul className={s.myDataList}>
              <li>
                <p>
                  Ім'я: <span>{userInfo?.name}</span>
                </p>
              </li>
              <li>
                <p>
                  Пошта: <span>{userInfo?.email}</span>
                </p>
              </li>
              <li>
                <p>
                  Телефон: <span>{userInfo?.phone}</span>
                </p>
              </li>
              <li>
                <p>
                  Регіон: <span>{userInfo?.region}</span>
                </p>
              </li>
              <li>
                <p>
                  Місто: <span>{userInfo?.town}</span>
                </p>
              </li>
              <li>
                <p>
                  Тип: <span>{userInfo?.volunteerType}</span>
                </p>
              </li>
              <li>
                <p>
                  Роль: <span>{userInfo?.role}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className={s.blockWrapper}>
          <p>Статті:</p>
          <button onClick={handleAddArticlesButtonClick}>Додати статтю</button>
          <button onClick={handleArticlesButtonClick}>Всі статті</button>

          {showArticles && (
            <div className={s.articlesList}>
              <ul className={s.allArticlesList}>
                {articlesList.map((el) => (
                  <div
                    className={s.allArticlesList_item_wrapper}
                    key={el.articleId}
                  >
                    <li
                      className={s.allArticlesList_item}
                      onClick={() => handleArticleClick(el.articleId)}
                    >
                      <p>{el.title}</p>
                    </li>
                    <button
                      onClick={() =>
                        handleDeleteArticleButtonClick(el.articleId)
                      }
                    >
                      видалити запис
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={s.blockWrapper}>
          <p>Магазин:</p>
          <button onClick={handleAddProductsButtonClick}>Додати товар</button>
          <button onClick={handleProductsButtonClick}>Всі товари</button>

          {showProducts && (
            <div className={s.articlesList}>
              <ul className={s.allArticlesList}>
                {productsList.map((el) => (
                  <div className={s.allArticlesList_item_wrapper} key={el.id}>
                    <li
                      className={s.allArticlesList_item}
                      onClick={() => handleProductClick(el.id)}
                    >
                      <p>{el.title}</p>
                    </li>
                    <button
                      onClick={() => handleDeleteProductButtonClick(el.id)}
                    >
                      видалити запис
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={s.blockWrapper}>
          <p>Список замовлень:</p>
          <div className={s.usersListWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Ім'я</th>
                  <th>Телефон</th>
                  <th>Місто</th>
                  <th>НП</th>
                  <th>Коментар</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.map((el) => (
                  <tr key={el.id}>
                    <td>{el.customerName}</td>
                    <td>{el.customerPhone}</td>
                    <td>{el.town}</td>
                    <td>{el.postInfo}</td>
                    <td>{el.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={s.blockWrapper}>
          <p>Зареєстровані користувачі:</p>
          <div className={s.usersListWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Ім'я</th>
                  <th>Телефон</th>
                  <th>Пошта</th>
                  <th>Роль</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((el) => (
                  <tr key={el.userID}>
                    <td>{el.name}</td>
                    <td>{el.phone}</td>
                    <td>{el.email}</td>
                    <td>{el.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
