import express from "express";
import {
  addFile,
  addVersion,
  getAllFiles,
  getSingleFile,
 
} from "../controllers/fileController";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), addFile);
router.get("/", getAllFiles);
router.get("/:id", getSingleFile);
router.post("/:id",upload.single("file"),addVersion)

export default router;
