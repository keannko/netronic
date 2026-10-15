import { createProductDataAccess, deleteProductDataAccess, getOneProductDataAccess, getProductsDataAccess, updateProductDataAccess } from "./dataAccess.js";

export const getProductService = async () => {
  const data = await getProductsDataAccess();

  return data
};

export const getOneProductService = async (id) => {
  const data = await getOneProductDataAccess(id);

  return data;
};



export const createProductService = async (newProductData) => {
  const data = await createProductDataAccess(newProductData);

  return data;
};
export const deleteProductService = async (id) => {
  const data = await deleteProductDataAccess(id);

  return data;
};
export const updateProductService = async (updateProductData) => {
  const data = await updateProductDataAccess(updateProductData);

  return data;
};
