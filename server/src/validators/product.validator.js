import { body } from "express-validator";

export const createProductValidation = [

    body("title")
        .notEmpty()
        .isLength({ min: 3 }),

    body("price")
        .isNumeric()
        .isFloat({ min: 1 }),

    body("stock")
        .isInt({ min: 1 })

];