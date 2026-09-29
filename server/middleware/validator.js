const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const registerValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validate,
];

const loginValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const postValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),
  body("body").trim().notEmpty().withMessage("Body content is required").isLength({ min: 5 }).withMessage("Body content must be at least 5 characters long"),
  validate,
];

const commentValidator = [
  body("content").trim().notEmpty().withMessage("Comment content cannot be empty"),
  validate,
];

const categoryValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required").isLength({ min: 2 }).withMessage("Category name must be at least 2 characters long"),
  validate,
];

const profileValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name cannot be empty"),
  validate,
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  postValidator,
  commentValidator,
  categoryValidator,
  profileValidator,
};
