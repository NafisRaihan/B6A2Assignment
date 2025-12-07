"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const database_1 = require("../../config/database");
const auth_1 = require("../../utils/auth");
const validation_1 = require("../../utils/validation");
const signup = async (data) => {
    const { name, email, password, phone, role } = data;
    if (!name || !email || !password || !phone || !role) {
        throw new Error('All fields are required');
    }
    if (!(0, validation_1.validateEmail)(email)) {
        throw new Error('Invalid email format');
    }
    if (!(0, validation_1.validatePassword)(password)) {
        throw new Error('Password must be at least 6 characters');
    }
    if (!(0, validation_1.validateRole)(role)) {
        throw new Error('Role must be either admin or customer');
    }
    const emailCheck = await database_1.pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (emailCheck.rows.length > 0) {
        throw new Error('Email already exists');
    }
    const hashedPassword = await (0, auth_1.hashPassword)(password);
    const result = await database_1.pool.query(`INSERT INTO users (name, email, password, phone, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, name, email, phone, role, created_at, updated_at`, [name, email.toLowerCase(), hashedPassword, phone, role]);
    return result.rows[0];
};
exports.signup = signup;
const signin = async (data) => {
    const { email, password } = data;
    if (!email || !password) {
        throw new Error('Email and password are required');
    }
    const result = await database_1.pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
    }
    const user = result.rows[0];
    const isPasswordValid = await (0, auth_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    const token = (0, auth_1.generateToken)({
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
exports.signin = signin;
//# sourceMappingURL=service.js.map