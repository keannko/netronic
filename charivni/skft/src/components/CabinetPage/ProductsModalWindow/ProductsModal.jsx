import axios from "axios";
import React, { useEffect, useState } from "react";
import $api from "../../../http";
import s from "./ProductsModal.module.scss";

const ProductsModal = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    availability: "",
    img: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const productData = await $api.get(`/products/${product}`);
      setFormData({
        title: productData.data[0]?.title || "",
        description: productData.data[0]?.description || "",
        price: productData.data[0]?.price || "",
        quantity: productData.data[0]?.quantity || "",
        availability: productData.data[0]?.availability || "",
        img: productData.data[0]?.img || "",
      });
    };
    fetchData();
  }, []);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: product,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      quantity: formData.quantity,
      availability: formData.availability,
      img: formData.img,
    };
    $api.post("products/update", data);
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
      fileData.append("file", file);
      try {
        const response = await axios.post(
          "https://api.charivnyci-dobra.com.ua/upload",
          fileData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setFormData((prevData) => ({
          ...prevData,
          img: response.data.fileUrl,
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
        <div>Дані про товар</div>

        <div>
          <form className={s.articleData} onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Назва</label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Опис</label>
              <input
                type="text"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Ціна</label>
              <input
                type="text"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Кількість</label>
              <input
                type="text"
                name="quantity"
                id="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="availability">Доступність</label>
              <input
                type="text"
                name="availability"
                id="availability"
                value={formData.availability}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="img">Зображення</label>
              <input
                type="file"
                name="img"
                id="img"
                onChange={handleFileChange}
              />
            </div>

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

export default ProductsModal;
