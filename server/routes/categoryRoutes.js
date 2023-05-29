// routes/categoryRoutes.js
import express from "express";
import {
    createCategory,
    deleteCategory,
    getArtworkCategories,
    getCategories,
    getCategoriesWithSubcategories,
    getFrameCategories,
    updateCategory,
} from "../controllers/categoryController.js";
const router = express.Router();

// categories controllers
router.get("/", getCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);
router.patch("/categories/:id", updateCategory);
// subcategories controller
router.get("/art", getArtworkCategories);
router.get("/frame", getFrameCategories);

router.get("/categories-with-subcategories", getCategoriesWithSubcategories);
// ... other routes
export default router;
