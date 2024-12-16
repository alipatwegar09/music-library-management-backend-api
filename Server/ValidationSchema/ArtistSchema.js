import { check } from "express-validator";

export const ArtistSchema = [
    check('name')
        .notEmpty().withMessage('Name is required.')
        .isString().withMessage('Name must be a string.'), 

    check('grammy')
        .notEmpty().withMessage('Grammy is required.')
        .isInt({ min: 0 }).withMessage('Grammy must be a non-negative integer.'),

    check('hidden')
        .notEmpty().withMessage('Hidden is required.')
        .isBoolean().withMessage('Hidden must be true or false.'),
];
