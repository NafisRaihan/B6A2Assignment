import { pool } from '../../config/database';
import { Vehicle } from '../../types';
import { validateVehicleType, validateAvailabilityStatus } from '../../utils/validation';

interface CreateVehicleData {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}

export const createVehicle = async (data: CreateVehicleData) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = data;

  if (!vehicle_name || !type || !registration_number || !daily_rent_price || !availability_status) {
    throw new Error('All fields are required');
  }

  if (!validateVehicleType(type)) {
    throw new Error('Invalid vehicle type. Must be car, bike, van, or SUV');
  }

  if (!validateAvailabilityStatus(availability_status)) {
    throw new Error('Invalid availability status. Must be available or booked');
  }

  if (daily_rent_price <= 0) {
    throw new Error('Daily rent price must be positive');
  }

  const regCheck = await pool.query(
    'SELECT id FROM vehicles WHERE registration_number = $1',
    [registration_number]
  );

  if (regCheck.rows.length > 0) {
    throw new Error('Registration number already exists');
  }

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  return result.rows[0];
};

export const getAllVehicles = async () => {
  const result = await pool.query(
    'SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at FROM vehicles ORDER BY id'
  );
  return result.rows;
};

export const getVehicleById = async (vehicleId: number) => {
  const result = await pool.query(
    'SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at FROM vehicles WHERE id = $1',
    [vehicleId]
  );

  if (result.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  return result.rows[0];
};

export const updateVehicle = async (vehicleId: number, data: Partial<Vehicle>) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = data;

  const vehicleCheck = await pool.query('SELECT id FROM vehicles WHERE id = $1', [vehicleId]);
  if (vehicleCheck.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  if (type && !validateVehicleType(type)) {
    throw new Error('Invalid vehicle type');
  }

  if (availability_status && !validateAvailabilityStatus(availability_status)) {
    throw new Error('Invalid availability status');
  }

  if (daily_rent_price && daily_rent_price <= 0) {
    throw new Error('Daily rent price must be positive');
  }

  if (registration_number) {
    const regCheck = await pool.query(
      'SELECT id FROM vehicles WHERE registration_number = $1 AND id != $2',
      [registration_number, vehicleId]
    );
    if (regCheck.rows.length > 0) {
      throw new Error('Registration number already exists');
    }
  }

  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (vehicle_name) {
    updates.push(`vehicle_name = $${paramCount}`);
    values.push(vehicle_name);
    paramCount++;
  }
  if (type) {
    updates.push(`type = $${paramCount}`);
    values.push(type);
    paramCount++;
  }
  if (registration_number) {
    updates.push(`registration_number = $${paramCount}`);
    values.push(registration_number);
    paramCount++;
  }
  if (daily_rent_price) {
    updates.push(`daily_rent_price = $${paramCount}`);
    values.push(daily_rent_price);
    paramCount++;
  }
  if (availability_status) {
    updates.push(`availability_status = $${paramCount}`);
    values.push(availability_status);
    paramCount++;
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(vehicleId);

  const query = `
    UPDATE vehicles 
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status, created_at, updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteVehicle = async (vehicleId: number) => {
  const vehicleCheck = await pool.query('SELECT id FROM vehicles WHERE id = $1', [vehicleId]);
  if (vehicleCheck.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  const bookingCheck = await pool.query(
    'SELECT id FROM bookings WHERE vehicle_id = $1 AND status = $2',
    [vehicleId, 'active']
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error('Cannot delete vehicle with active bookings');
  }

  await pool.query('DELETE FROM vehicles WHERE id = $1', [vehicleId]);
};
