import { pool } from '../../config/database';
import { User } from '../../types';
import { hashPassword, comparePassword, generateToken } from '../../utils/auth';
import { validateEmail, validatePassword, validateRole } from '../../utils/validation';

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

interface SigninData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const { name, email, password, phone, role } = data;

  if (!name || !email || !password || !phone || !role) {
    throw new Error('All fields are required');
  }

  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!validatePassword(password)) {
    throw new Error('Password must be at least 6 characters');
  }

  if (!validateRole(role)) {
    throw new Error('Role must be either admin or customer');
  }

  const emailCheck = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (emailCheck.rows.length > 0) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, name, email, phone, role, created_at, updated_at`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );

  return result.rows[0];
};

export const signin = async (data: SigninData) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0] as User;

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};
