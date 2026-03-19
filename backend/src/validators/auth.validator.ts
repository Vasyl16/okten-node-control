import { check, checkExact } from 'express-validator';

export const validateSignUpUser = checkExact([
  check('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('lastName is required'),
  check('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('firstName is required'),
  check('email')
    .trim()
    .isLength({ min: 1 })
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('email must be valid'),
  check('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
    .bail()
    .isStrongPassword()
    .withMessage('Password must be strong'),
  check('phone')
    .notEmpty()
    .withMessage('Phone is required')
    .bail()
    .isMobilePhone('any')
    .withMessage('Phone must be valid and required'),
  check('role')
    .optional()
    .isIn(['buyer', 'seller'])
    .withMessage('role must be either buyer or seller'),
]);

export const validateLoginUser = [
  check('email').notEmpty().withMessage('email is required'),
  check('password').notEmpty().withMessage('Password is required'),
];
