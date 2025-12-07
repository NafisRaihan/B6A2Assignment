import { Request, Response } from 'express';
import * as userService from './service';

export const getAllUsersHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      errors: err.message,
    });
  }
};

export const updateUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const requesterId = req.user!.id;
    const requesterRole = req.user!.role;

    const user = await userService.updateUser(userId, req.body, requesterId, requesterRole);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('not found') ? 404 : 
                       err.message.includes('only') || err.message.includes('Only') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to update user',
      errors: err.message,
    });
  }
};

export const deleteUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);

    await userService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to delete user',
      errors: err.message,
    });
  }
};
