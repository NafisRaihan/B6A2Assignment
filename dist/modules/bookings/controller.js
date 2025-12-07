"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingHandler = exports.getAllBookingsHandler = exports.createBookingHandler = void 0;
const bookingService = __importStar(require("./service"));
const createBookingHandler = async (req, res) => {
    try {
        const booking = await bookingService.createBooking(req.body);
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking,
        });
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            success: false,
            message: 'Failed to create booking',
            errors: err.message,
        });
    }
};
exports.createBookingHandler = createBookingHandler;
const getAllBookingsHandler = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const bookings = await bookingService.getAllBookings(userId, userRole);
        const message = userRole === 'admin'
            ? 'Bookings retrieved successfully'
            : 'Your bookings retrieved successfully';
        res.status(200).json({
            success: true,
            message,
            data: bookings,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve bookings',
            errors: err.message,
        });
    }
};
exports.getAllBookingsHandler = getAllBookingsHandler;
const updateBookingHandler = async (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const userId = req.user.id;
        const userRole = req.user.role;
        const booking = await bookingService.updateBooking(bookingId, req.body, userId, userRole);
        const message = req.body.status === 'cancelled'
            ? 'Booking cancelled successfully'
            : 'Booking marked as returned. Vehicle is now available';
        res.status(200).json({
            success: true,
            message,
            data: booking,
        });
    }
    catch (error) {
        const err = error;
        const statusCode = err.message.includes('not found') ? 404 :
            err.message.includes('Unauthorized') || err.message.includes('Only') || err.message.includes('can only') ? 403 : 400;
        res.status(statusCode).json({
            success: false,
            message: 'Failed to update booking',
            errors: err.message,
        });
    }
};
exports.updateBookingHandler = updateBookingHandler;
//# sourceMappingURL=controller.js.map