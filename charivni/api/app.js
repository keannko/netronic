import express from "express";
import cors from "cors";
import { productsRouter } from "./products/routes.js";
import { usersRouter } from "./users/routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { ordersRouter } from "./orders/routes.js";
import { blogRouter } from "./blog/routes.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authMiddleware from "./middlewares/auth-middleware.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/blog", blogRouter);

app.get("/", (req, res) => {
  res.send("API charivnyci-dobra");
});

const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Маршрут для загрузки файла
app.post("/upload", upload.single("file"), (req, res) => {

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const fileUrl = `https://api.charivnyci-dobra.com.ua/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

// Маршрут для доступа к загруженным файлам
app.use("/uploads", express.static(UPLOADS_DIR));
const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
