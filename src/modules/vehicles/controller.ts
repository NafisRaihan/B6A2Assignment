import { Request, Response } from 'express';
import * as vehicleService from './service';

export const createVehicleHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle,
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      message: 'Failed to create vehicle',
      errors: err.message,
    });
  }
};

export const getAllVehiclesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicles = await vehicleService.getAllVehicles();

    const message = vehicles.length === 0 ? 'No vehicles found' : 'Vehicles retrieved successfully';

    res.status(200).json({
      success: true,
      message,
      data: vehicles,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve vehicles',
      errors: err.message,
    });
  }
};

export const getVehicleByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    const vehicle = await vehicleService.getVehicleById(vehicleId);

    res.status(200).json({
      success: true,
      message: 'Vehicle retrieved successfully',
      data: vehicle,
    });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to retrieve vehicle',
      errors: err.message,
    });
  }
};

export const updateVehicleHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    const vehicle = await vehicleService.updateVehicle(vehicleId, req.body);

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
    });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to update vehicle',
      errors: err.message,
    });
  }
};

export const deleteVehicleHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    await vehicleService.deleteVehicle(vehicleId);

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to delete vehicle',
      errors: err.message,
    });
  }
};
