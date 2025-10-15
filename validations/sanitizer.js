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

const clientSanitizer = [

  body("firstname")
    .trim()
    .notEmpty().withMessage("First name is mandatory")
    .isLength({ min: 2, max: 50 }).withMessage("First name must be 2–50 characters long")
    .matches(/^[a-zA-Z\s'-]+$/).withMessage("First name must only contain letters and spaces")
    .escape(),

  body("surname")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Surname must be 2–50 characters long")
    .matches(/^[a-zA-Z\s'-]+$/).withMessage("Surname must only contain letters and spaces")
    .escape(),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is mandatory")
    .matches(/^[0-9]{10,15}$/).withMessage("Phone must be 10–15 digits")
    .escape(),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is mandatory")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("company")
    .trim()
    .notEmpty().withMessage("Company name is mandatory")
    .isLength({ min: 2, max: 100 }).withMessage("Company name must be 2–100 characters long")
    .escape(),

  body("position")
    .trim()
    .notEmpty().withMessage("Position is mandatory")
    .isLength({ min: 2, max: 100 }).withMessage("Position must be 2–100 characters long")
    .matches(/^[a-zA-Z\s'-]+$/).withMessage("Position must only contain letters and spaces")
    .escape(),

  body("staffId")
    .optional({ checkFalsy: true }) // ✅ only validates if provided and not falsy
    .trim()
    .isInt({ min: 1 }).withMessage("Invalid Staff ID")
    .toInt()
];

const serviceSanitizer = [

  body("service")
    .trim()
    .notEmpty().withMessage("Service is mandatory")
    .isLength({ min: 2, max: 100 }).withMessage("Service must be 2–100 characters long")
]

const staffSanitizer = [

  body("firstname")
    .trim()
    .notEmpty().withMessage("First name is mandatory")
    .isLength({ min: 2, max: 50 }).withMessage("First name must be 2–50 characters long")
    .matches(/^[a-zA-Z\s'-]+$/).withMessage("First name must only contain letters and spaces")
    .escape(),

  body("surname")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Surname must be 2–50 characters long")
    .matches(/^[a-zA-Z\s'-]+$/).withMessage("Surname must only contain letters and spaces")
    .escape(),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is mandatory")
    .matches(/^[0-9]{10,15}$/).withMessage("Phone must be 10–15 digits")
    .escape(),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is mandatory")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail()
];

const pipelineSanitizer = [

  // Single client ID (integer)
  body("clientId")
    .notEmpty().withMessage("Please select a client.")
    .isInt({ min: 1 }).withMessage("Invalid client selection.")
    .toInt(),

  // One or more service IDs (array or single value)
  body("serviceIDs")
    .notEmpty().withMessage("Please select at least one service.")
    .custom(value => {
      if (Array.isArray(value)) {
        // Ensure all elements are numeric
        return value.every(v => Number.isInteger(Number(v)));
      }
      // If single value
      return Number.isInteger(Number(value));
    })
    .withMessage("Invalid service ID(s).")
    .customSanitizer(value => {
      // Convert to array of integers
      return Array.isArray(value)
        ? value.map(v => parseInt(v, 10))
        : [parseInt(value, 10)];
    }),

  body("agenda")
    .trim()
    .notEmpty().withMessage("Agenda is required.")
    .isLength({ min: 5, max: 500 }).withMessage("Agenda must be between 5 and 500 characters long.")
];

module.exports = { loginSanitizer, clientSanitizer, serviceSanitizer, staffSanitizer, pipelineSanitizer }