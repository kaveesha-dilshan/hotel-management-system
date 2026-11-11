import { body } from "express-validator";

export const validateStaff = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 50})
        .withMessage("Name must be between 3 and 50 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail({ all_lowercase: true }),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 8, max: 64 })
        .withMessage("Password must be between 8 and 64 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character"),

    body("role")
        .optional()
        .isIn(["manager", "receptionist", "staff"])
        .withMessage("Role must be manager, receptionist or staff")
]


// validateStaffUpdate
export const validateStaffUpdate = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ min: 3, max: 50})
        .withMessage("Name must be between 3 and 50 characters"),
    
    body("email")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .bail()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail({ all_lowercase: true }),

    body("password")
        .optional()
        .notEmpty()
        .withMessage("Password cannot be empty")
        .bail()
        .withMessage("Password must be between 8 and 64 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character"),

    body("role")
        .optional()
        .isIn(["manager", "receptionist", "staff"])
        .withMessage("Invalid staff role")
]