"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = void 0;
const database_1 = require("../../config/database");
const auth_1 = require("../../utils/auth");
const validation_1 = require("../../utils/validation");
const getAllUsers = async () => {
    const result = await database_1.pool.query('SELECT id, name, email, phone, role, created_at, updated_at FROM users ORDER BY id');
    return result.rows;
};
exports.getAllUsers = getAllUsers;
const updateUser = async (userId, data, requesterId, requesterRole) => {
    const { name, email, phone, role, password } = data;
    if (requesterRole !== 'admin' && userId !== requesterId) {
        throw new Error('You can only update your own profile');
    }
    if (role && requesterRole !== 'admin') {
        throw new Error('Only admins can change user roles');
    }
    const userCheck = await database_1.pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
        throw new Error('User not found');
    }
    if (email && !(0, validation_1.validateEmail)(email)) {
        throw new Error('Invalid email format');
    }
    if (role && !(0, validation_1.validateRole)(role)) {
        throw new Error('Invalid role');
    }
    if (email) {
        const emailCheck = await database_1.pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email.toLowerCase(), userId]);
        if (emailCheck.rows.length > 0) {
            throw new Error('Email already exists');
        }
    }
    const updates = [];
    const values = [];
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
        const hashedPassword = await (0, auth_1.hashPassword)(password);
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
    const result = await database_1.pool.query(query, values);
    return result.rows[0];
};
exports.updateUser = updateUser;
const deleteUser = async (userId) => {
    const userCheck = await database_1.pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
        throw new Error('User not found');
    }
    const bookingCheck = await database_1.pool.query('SELECT id FROM bookings WHERE customer_id = $1 AND status = $2', [userId, 'active']);
    if (bookingCheck.rows.length > 0) {
        throw new Error('Cannot delete user with active bookings');
    }
    await database_1.pool.query('DELETE FROM users WHERE id = $1', [userId]);
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=service.js.map