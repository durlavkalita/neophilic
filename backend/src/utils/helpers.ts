import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";

export const getRootDir = () => {
  // console.log(import.meta.url);
  // console.log(fileURLToPath(import.meta.url));
  // console.log(path.dirname(fileURLToPath(import.meta.url)));
  const rootPath = path.dirname(fileURLToPath(import.meta.url));

  return rootPath;
};

function generateUniqueFileName(file: Express.Multer.File): string {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  const sanitizedOriginalName = file.originalname.replace(/\s+/g, "-");
  return `${timestamp}-${randomSuffix}-${sanitizedOriginalName}`;
}

// Product Image Storage
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(getRootDir(), "../uploads/products"));
  },
  filename: (req, file, cb) => {
    cb(null, generateUniqueFileName(file));
  },
});

// User Profile Image Storage
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(getRootDir(), "../uploads/users"));
  },
  filename: (req, file, cb) => {
    cb(null, generateUniqueFileName(file));
  },
});

// Multer Instances
export const uploadProductImage = multer({ storage: productStorage });
export const uploadUserImage = multer({ storage: userStorage });
