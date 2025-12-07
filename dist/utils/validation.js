"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDays = exports.validateAvailabilityStatus = exports.validateBookingStatus = exports.validateVehicleType = exports.validateRole = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    return password.length >= 6;
};
exports.validatePassword = validatePassword;
const validateRole = (role) => {
    return ['admin', 'customer'].includes(role);
};
exports.validateRole = validateRole;
const validateVehicleType = (type) => {
    return ['car', 'bike', 'van', 'SUV'].includes(type);
};
exports.validateVehicleType = validateVehicleType;
const validateBookingStatus = (status) => {
    return ['active', 'cancelled', 'returned'].includes(status);
};
exports.validateBookingStatus = validateBookingStatus;
const validateAvailabilityStatus = (status) => {
    return ['available', 'booked'].includes(status);
};
exports.validateAvailabilityStatus = validateAvailabilityStatus;
const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
exports.calculateDays = calculateDays;
//# sourceMappingURL=validation.js.map