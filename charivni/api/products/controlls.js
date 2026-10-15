import {
  createProductService,
  deleteProductService,
  getOneProductService,
  getProductService,
  updateProductService,
} from "./services.js";

export const getProductsController = async (req, res) => {
  try {
    const data = await getProductService();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOneProductController = async (req, res) => {
  try {
    const data = await getOneProductService(req.params.id);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProductController = async (req, res) => {
  try {
    const data = await createProductService(req.body);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const data = await deleteProductService(req.params.id);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const data = await updateProductService(req.body);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
