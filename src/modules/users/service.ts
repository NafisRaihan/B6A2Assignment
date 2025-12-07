import { pool } from '../../config/database';
import { User } from '../../types';
import { hashPassword } from '../../utils/auth';
import { validateEmail, validateRole } from '../../utils/validation';

export const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, name, email, phone, role, created_at, updated_at FROM users ORDER BY id'
  );
  return result.rows;
};

export const updateUser = async (userId: number, data: Partial<User>, requesterId: number, requesterRole: string) => {
  const { name, email, phone, role, password } = data;

  if (requesterRole !== 'admin' && userId !== requesterId) {
    throw new Error('You can only update your own profile');
  }

  if (role && requesterRole !== 'admin') {
    throw new Error('Only admins can change user roles');
  }

  const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
  if (userCheck.rows.length === 0) {
    throw new Error('User not found');
  }

  if (email && !validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (role && !validateRole(role)) {
    throw new Error('Invalid role');
  }

  if (email) {
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email.toLowerCase(), userId]
    );
    if (emailCheck.rows.length > 0) {
      throw new Error('Email already exists');
    }
  }

  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (name) {
    updates.push(`name = $${paramCount}`);
    values.push(name);
    paramCount++;
  }
  if (email) {
    updates.push(`email = $${paramCount}`);
    values.push(email.toLowerCase());
    paramCount++;
  }
  if (phone) {
    updates.push(`phone = $${paramCount}`);
    values.push(phone);
    paramCount++;
  }
  if (role && requesterRole === 'admin') {
    updates.push(`role = $${paramCount}`);
    values.push(role);
    paramCount++;
  }
  if (password) {
    const hashedPassword = await hashPassword(password);
    updates.push(`password = $${paramCount}`);
    values.push(hashedPassword);
    paramCount++;
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(userId);

  const query = `
    UPDATE users 
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, name, email, phone, role, created_at, updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteUser = async (userId: number) => {
  const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
  if (userCheck.rows.length === 0) {
    throw new Error('User not found');
  }

  const bookingCheck = await pool.query(
    'SELECT id FROM bookings WHERE customer_id = $1 AND status = $2',
    [userId, 'active']
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error('Cannot delete user with active bookings');
  }

  await pool.query('DELETE FROM users WHERE id = $1', [userId]);
};
