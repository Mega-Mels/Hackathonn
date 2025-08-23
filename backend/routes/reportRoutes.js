import express from "express";
import { createReport, getReports } from "../controllers/reportController.js";
import multer from "multer";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to store images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Updated route to accept image upload
router.post("/", upload.single("image"), createReport);
router.get("/", getReports);

export default router;
