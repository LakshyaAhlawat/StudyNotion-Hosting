const Category = require("../models/Category")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" })
    }
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    })
    console.log(CategorysDetails)
    return res.status(200).json({
      success: true,
      message: "Categorys Created Successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    })
  }
}

// Get all categories. If none exist (fresh database), seed a few sensible defaults
// so that the course creation flow always has options.
exports.showAllCategories = async (req, res) => {
  try {
    let allCategorys = await Category.find()

    // Seed default categories on a fresh database so instructors always
    // see some options in the "Course Category" dropdown.
    if (allCategorys.length === 0) {
      const defaultCategories = [
        {
          name: "Web Development",
          description: "Courses related to building websites and web applications.",
        },
        {
          name: "Programming Fundamentals",
          description: "Core concepts of programming and problem solving.",
        },
        {
          name: "Data Structures & Algorithms",
          description: "Courses focused on DSA and coding interviews.",
        },
      ]

      allCategorys = await Category.insertMany(defaultCategories)
    }

    return res.status(200).json({
      success: true,
      data: allCategorys,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec()

    console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }
    // If there are no courses in this category yet, log and continue.
    // The frontend will simply render an empty course list instead of failing.
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category. Returning empty list.")
    }

    // Get courses for other categories (if any exist)
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })

    let differentCategory = null
    if (categoriesExceptSelected.length > 0) {
      const randomCategory =
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]

      if (randomCategory) {
        differentCategory = await Category.findById(randomCategory._id)
          .populate({
            path: "courses",
            match: { status: "Published" },
          })
          .exec()
      }
    }
    console.log()
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
