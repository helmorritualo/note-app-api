import { Hono } from "hono";
import authenticate from "@/middlewares/authentication";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.controller";

const categoryRouter = new Hono();

categoryRouter.get("/categories", authenticate, getAllCategories);
categoryRouter.get("/categories/:id", authenticate, getCategoryById);
categoryRouter.post("/categories", authenticate, createCategory);
categoryRouter.put("/categories/:id", authenticate, updateCategory);
categoryRouter.delete("/categories/:id", authenticate, deleteCategory);

export default categoryRouter;
