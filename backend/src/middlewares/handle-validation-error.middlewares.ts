import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { ValidationError } from '../errors/errors';

export const handleValidationError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  const formattedErrors = errors.array().map((error) => {
    const field = 'path' in error ? error.path : '';
    return {
      name: field || (error.type as string),
      message: error.msg as string,
    };
  });

  next(new ValidationError(formattedErrors[0].message, formattedErrors));
  return;
};
