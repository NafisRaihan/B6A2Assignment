import { pool } from '../../config/database';
import { Booking } from '../../types';
import { validateBookingStatus, calculateDays } from '../../utils/validation';

interface CreateBookingData {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

export const createBooking = async (data: CreateBookingData) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error('All fields are required');
  }

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (endDate <= startDate) {
    throw new Error('End date must be after start date');
  }

  const vehicleResult = await pool.query(
    'SELECT id, daily_rent_price, availability_status FROM vehicles WHERE id = $1',
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== 'available') {
    throw new Error('Vehicle is not available for booking');
  }

  const days = calculateDays(startDate, endDate);
  const total_price = vehicle.daily_rent_price * days;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const bookingResult = await client.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active']
    );

    await client.query(
      'UPDATE vehicles SET availability_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['booked', vehicle_id]
    );

    await client.query('COMMIT');

    const booking = bookingResult.rows[0];

    const vehicleData = await client.query(
      'SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1',
      [vehicle_id]
    );

    return {
      ...booking,
      vehicle: vehicleData.rows[0],
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getAllBookings = async (userId: number, userRole: string) => {
  if (userRole === 'admin') {
    const result = await pool.query(
      `SELECT b.*, 
              u.name as customer_name, u.email as customer_email,
              v.vehicle_name, v.registration_number
       FROM bookings b
       JOIN users u ON b.customer_id = u.id
       JOIN vehicles v ON b.vehicle_id = v.id
       ORDER BY b.id`
    );

    return result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: parseFloat(row.total_price),
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));
  } else {
    const result = await pool.query(
      `SELECT b.*, 
              v.vehicle_name, v.registration_number, v.type
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.customer_id = $1
       ORDER BY b.id`,
      [userId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: parseFloat(row.total_price),
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
        type: row.type,
      },
    }));
  }
};

export const updateBooking = async (
  bookingId: number,
  data: { status: string },
  userId: number,
  userRole: string
) => {
  const { status } = data;

  if (!status) {
    throw new Error('Status is required');
  }

  if (!validateBookingStatus(status)) {
    throw new Error('Invalid status. Must be active, cancelled, or returned');
  }

  const bookingResult = await pool.query(
    'SELECT * FROM bookings WHERE id = $1',
    [bookingId]
  );

  if (bookingResult.rows.length === 0) {
    throw new Error('Booking not found');
  }

  const booking = bookingResult.rows[0];

  if (status === 'cancelled') {
    if (userRole !== 'customer' && userRole !== 'admin') {
      throw new Error('Unauthorized');
    }

    if (userRole === 'customer' && booking.customer_id !== userId) {
      throw new Error('You can only cancel your own bookings');
    }

    const startDate = new Date(booking.rent_start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate <= today) {
      throw new Error('Cannot cancel booking that has already started');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        ['cancelled', bookingId]
      );

      await client.query(
        'UPDATE vehicles SET availability_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['available', booking.vehicle_id]
      );

      await client.query('COMMIT');

      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  if (status === 'returned') {
    if (userRole !== 'admin') {
      throw new Error('Only admins can mark bookings as returned');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        ['returned', bookingId]
      );

      await client.query(
        'UPDATE vehicles SET availability_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['available', booking.vehicle_id]
      );

      await client.query('COMMIT');

      const vehicleData = await client.query(
        'SELECT availability_status FROM vehicles WHERE id = $1',
        [booking.vehicle_id]
      );

      return {
        ...result.rows[0],
        vehicle: vehicleData.rows[0],
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  throw new Error('Invalid status update');
};
