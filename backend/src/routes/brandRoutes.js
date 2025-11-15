import express from "express";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandBySlug,
} from "../controllers/brandController.js";

const router = express.Router();

router.get("/", getBrands);
router.get("/:slug", getBrandBySlug);
router.post("/", createBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;