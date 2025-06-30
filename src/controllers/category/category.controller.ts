import Category from "@/models/category.model";
import { Context } from "hono";
import { BadRequestError, NotFoundError } from "@/utils/error";

export const getAllCategories = async (c: Context) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      throw new NotFoundError("No categories found");
    }

    return c.json(
      {
        success: true,
        data: {
          categories,
        },
      },
      200
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const getCategoryById = async (c: Context) => {
  try {
    const categoryId = c.req.param("id");
    if (!categoryId) {
      throw new NotFoundError("Category not found");
    }

    const category = await Category.findById(categoryId);

    return c.json(
      {
        success: true,
        data: {
          category,
        },
      },
      200
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const createCategory = async (c: Context) => {
  try {
    const body = await c.req.json();

    const category = new Category(body);

    if (!category) {
      throw new BadRequestError("Failed to create category");
    }

    await category.save();

    return c.json(
      {
        success: true,
        message: "Category created successfully",
        data: {
          category,
        },
      },
      201
    );
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const updateCategory = async (c: Context) => {
  try {
    const categoryId = c.req.param("id");
    if (!categoryId) {
      throw new NotFoundError("Category not found");
    }

    const body = c.req.json();

    const category = await Category.findByIdAndUpdate(categoryId, body);
    if (!category) {
      throw new BadRequestError("Failed to update the category");
    }

    return c.json(
      {
        success: true,
        message: "Category updated successfully",
        data: {
          category,
        },
      },
      201
    );
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const deleteCategory = async (c: Context) => {
  try {
    const categoryId = c.req.param("id");
    if (!categoryId) {
      throw new NotFoundError("Category not found");
    }

    await Category.findByIdAndDelete(categoryId);

    return c.json(
      {
        success: true,
        message: "Category successfully deleted",
      },
      201
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};
