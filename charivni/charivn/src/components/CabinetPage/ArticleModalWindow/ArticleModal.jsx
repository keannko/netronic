import axios from "axios";
import React, { useEffect, useState } from "react";
import $api from "../../../http";
import s from "./ArticleModal.module.scss";

const ArticleModal = ({ isOpen, onClose, article }) => {
  const [formData, setFormData] = useState({
    title: "",
    imgLink: "",
    content: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const articleData = await $api.get(`/blog/${article}`);
      setFormData({
        title: articleData.data[0]?.title,
        imgLink: articleData.data[0]?.imgLink,
        content: articleData.data[0]?.content,
      });
    };
    fetchData();
  }, [article]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: article,
      imgLink: formData.imgLink,
      content: formData.content,
      title: formData.title,
    };
    $api.post("/blog/edit", data);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const fileData = new FormData();
      console.log(fileData)
      fileData.append("file", file);
      console.log(fileData)
      try {
        const response = await axios.post("https://api.charivnyci-dobra.com.ua/upload", fileData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setFormData((prevData) => ({
          ...prevData,
          imgLink: response.data.fileUrl,
        }));
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  

  return (
    <div className={s.modalOverlay}>
      <div className={s.modalContent}>
        <button className={s.closeButton} onClick={onClose}>
          X
        </button>
        <div>Modal Window</div>
        <p>
          article <span>{article}</span>
        </p>
        <div>
          <form className={s.articleData} onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
            />
            <input
              type="file"
              name="imgLink"
              id="imgLink"
              // value={formData.imgLink}
              onChange={handleFileChange}
            />
            <textarea
              name="content"
              id="content"
              rows="30"
              cols="100"
              value={formData.content}
              onChange={handleChange}
            />
            <div>
              <button type="submit">Зберегти</button>
              <button type="button" onClick={onClose}>
                Закрити
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
