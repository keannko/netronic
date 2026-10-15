import { pool } from "../database.js";
import iconv from "iconv-lite";

export const getProductsDataAccess = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM products";
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Error executing the query:", err);
        reject(err); // Отклоняем промис в случае ошибки
      } else {
        resolve(results); // Разрешаем промис и передаем результат
      }
    });
  });
};

export const getOneProductDataAccess = async (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM products WHERE id = ${id}`;
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Error executing the query:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

export const createProductDataAccess = async (newProductData) => {
  const promisePool = pool.promise();

  const { title, description, price, quantity, availability, img } =
    newProductData;

  try {
    const query = `INSERT INTO products (title, description, price, quantity, availability, img) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [title, description, price, quantity, availability, img];

    const [createResult] = await promisePool.query(query, values);

    return createResult;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const deleteProductDataAccess = async (id) => {
  const promisePool = pool.promise();

  try {
    const query = `DELETE FROM products WHERE id = ?`;
    const values = [id];

    const [deleteResult] = await promisePool.query(query, values);

    return "Successfully";
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateProductDataAccess = async (updateProductData) => {
  const promisePool = pool.promise();

  const { title, description, price, quantity, availability, img, id } =
    updateProductData;
  try {
    const query = `UPDATE products SET title = ?, description = ?, price = ?, quantity = ?, availability = ?, img = ? WHERE id = ?`;
    const values = [title, description, price, quantity, availability, img, id];

    const [updateResult] = await promisePool.query(query, values);

    return updateResult;
  } catch (error) {
    console.error(error);
    return null;
  }
};
