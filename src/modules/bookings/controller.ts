import { Request, Response } from 'express';
import * as bookingService from './service';

export const createBookingHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await bookingService.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      message: 'Failed to create booking',
      errors: err.message,
    });
  }
};

export const getAllBookingsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const bookings = await bookingService.getAllBookings(userId, userRole);

    const message = userRole === 'admin' 
      ? 'Bookings retrieved successfully' 
      : 'Your bookings retrieved successfully';

    res.status(200).json({
      success: true,
      message,
      data: bookings,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      errors: err.message,
    });
  }
};

export const updateBookingHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = parseInt(req.params.bookingId);
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const booking = await bookingService.updateBooking(bookingId, req.body, userId, userRole);

    const message = req.body.status === 'cancelled' 
      ? 'Booking cancelled successfully'
      : 'Booking marked as returned. Vehicle is now available';

    res.status(200).json({
      success: true,
      message,
      data: booking,
    });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message.includes('not found') ? 404 : 
                       err.message.includes('Unauthorized') || err.message.includes('Only') || err.message.includes('can only') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: 'Failed to update booking',
      errors: err.message,
    });
  }
};
