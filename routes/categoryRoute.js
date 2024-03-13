import express from "express";
import { requireSignIn, isAdmin } from "./../middlewares/authMiddleware.js";
import {
  categoryController,
  createCatgoryController,
  deleteCategoryController,
  singleCategory,
  updateCategoryController,
} from "./../controllers/categoryController.js";
const router = express.Router();

//routes
//create-category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCatgoryController
);

//update category

router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//All Categories
router.get("/get-category", categoryController);

//Single Category
router.get("/single-category/:slug", singleCategory);

//Delete Category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);
export default router;
