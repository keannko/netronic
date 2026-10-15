import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import $api from "../../http";
import dateFormatter from "../../tools/dateFormatter";
import s from "./ArticlePage.module.scss";

const ArticlePage = () => {
  const [articleData, setArticleData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await $api.get(`/blog/${id}`);
        setArticleData(response.data[0]);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);

  const formatContent = (content) => {
    return content.split("\n").map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <>
      {articleData ? (
        <div className={s.wrapper}>
          <div>
            <NavLink to="/">
              <button className={s.articlePage_backButton}>Назад</button>
            </NavLink>
          </div>
          <div className={s.articleBlock}>
            <h1 className={s.articleBlock_title}>{articleData.title}</h1>
            <img
              className={s.articleBlock_image}
              src={articleData.imgLink}
              alt=""
            />
            {/* <div className={s.articleInfoBlock}>
              <p>{articleData.creator}</p>
              <p>{dateFormatter(articleData.date)}</p>
            </div> */}
            <p className={s.articleContent}>
              {formatContent(articleData.content)}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ArticlePage;
