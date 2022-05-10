import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { AnyObject, ApiResponse } from '@/types/index';

export default function validate(rules: ValidationChain[]) {
  return async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    // Apply rules
    for (let i = 0; i < rules.length; i++) {
      await rules[i].run(req);
    }
    // Validate rules
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors: AnyObject = {};

    // Parse the error messages
    errors.array().forEach((err) => {
      // extractedErrors[err.param] = err.msg; // One error at one time.
      if (extractedErrors[err.param]) {
        extractedErrors[err.param].push(err.msg);
      } else {
        extractedErrors[err.param] = [];
        extractedErrors[err.param].push(err.msg);
      }
    });

    // Return error response
    return res.status(422).json({
      message: 'The given data is invalid',
      errors: extractedErrors,
    });
  };
}
