import express from "express";
import {
  getDashboardMetrics,
  getTopSellingProducts, 
  getRevenueChartData
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/metrics", getDashboardMetrics);
router.get("/topselling", getTopSellingProducts)
router.get("/revenue-chart", getRevenueChartData)

export default router;