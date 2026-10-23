import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $api from "../../http";
import s from "./Blog.module.scss";

const Blog = () => {
  const [articlesList, setArticlesList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await $api.get(`/blog`);
        setArticlesList(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 670) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1000) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextArticles = () => {
    if (currentIndex + cardsToShow < articlesList.length) {
      setCurrentIndex(currentIndex + cardsToShow);
    }
  };

  const prevArticles = () => {
    if (currentIndex - cardsToShow >= 0) {
      setCurrentIndex(currentIndex - cardsToShow);
    }
  };

  const displayedArticles = articlesList.slice(
    currentIndex,
    currentIndex + cardsToShow
  );

  return (
    <div className={s.wrapper}>
      <div className={s.posts_list}>
      {displayedArticles.length > 0 ? (
  displayedArticles.map((el) => (
    <div key={el.articleId} className={s.posts_list_card}>
      <Link to={`/blog/${el.articleId}`}>
        <div className={s.card_image_container}>
          <img className={s.card_image} src={el.imgLink} alt={el.title} />
        </div>
      </Link>
      <section className={s.card_description}>
        <h2 className={s.card_description_title}>
          {el.title.length > 30
            ? `${el.title.slice(0, 30)}...`
            : el.title}
        </h2>
        <div className={s.card_description_content}>
          <p>
            {el.content.length > 50
              ? `${el.content.slice(0, 50)}...`
              : el.content}
          </p>
        </div>
      </section>
      <Link
        to={`/blog/${el.articleId}`}
        className={s.card_more_button}
        title="Read more about this article"
      >
        Детальніше...
      </Link>
    </div>
  ))
) : (
  <p>Loading...</p>
)}

      </div>
      {articlesList.length > cardsToShow && (
        <div className={s.navigation_buttons}>
          <button
            onClick={prevArticles}
            disabled={currentIndex === 0}
            className={s.navigation_buttons_item}
          >
            &#8592; Назад
          </button>
          <button
            onClick={nextArticles}
            disabled={currentIndex + cardsToShow >= articlesList.length}
            className={s.navigation_buttons_item}
          >
            Вперед &#8594;
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
