const { body } = require("express-validator");


const loginSanitizer = [

  body("email")
    .exists().withMessage("Email is mandatory")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .exists({ checkFalsy: true }).withMessage("Password is mandatory")
    .isLength({ min: 8, max: 20 }).withMessage("Password must be 8–20 characters long")
]

module.exports = {loginSanitizer}