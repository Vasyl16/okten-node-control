import { checkExact, body } from 'express-validator';

export const validateUpdateCurrentUser = checkExact([
  body().custom((_, { req }) => {
    const { firstName, lastName, phone } = req.body ?? {};
    const hasAtLeastOneField =
      firstName !== undefined || lastName !== undefined || phone !== undefined;

    if (!hasAtLeastOneField) {
      throw new Error(
        'At least one field is required: firstName, lastName, or phone',
      );
    }

    return true;
  }),
  body('firstName')
    .optional({ nullable: true })
    .isString()
    .withMessage('firstName must be a string or null'),
  body('lastName')
    .optional({ nullable: true })
    .isString()
    .withMessage('lastName must be a string or null'),
  body('phone')
    .optional({ nullable: true })
    .isString()
    .withMessage('phone must be a string or null'),
]);

