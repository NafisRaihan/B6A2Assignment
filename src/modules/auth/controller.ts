import { Request, Response } from 'express';
import * as authService from './service';

export const signupHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      message: 'Registration failed',
      errors: err.message,
    });
  }
};

export const signinHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.signin(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      message: 'Login failed',
      errors: err.message,
    });
  }
};
