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
exports.deleteUserHandler = exports.updateUserHandler = exports.getAllUsersHandler = void 0;
const userService = __importStar(require("./service"));
const getAllUsersHandler = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve users',
            errors: err.message,
        });
    }
};
exports.getAllUsersHandler = getAllUsersHandler;
const updateUserHandler = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const requesterId = req.user.id;
        const requesterRole = req.user.role;
        const user = await userService.updateUser(userId, req.body, requesterId, requesterRole);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user,
        });
    }
    catch (error) {
        const err = error;
        const statusCode = err.message.includes('not found') ? 404 :
            err.message.includes('only') || err.message.includes('Only') ? 403 : 400;
        res.status(statusCode).json({
            success: false,
            message: 'Failed to update user',
            errors: err.message,
        });
    }
};
exports.updateUserHandler = updateUserHandler;
const deleteUserHandler = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        await userService.deleteUser(userId);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        const err = error;
        const statusCode = err.message.includes('not found') ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: 'Failed to delete user',
            errors: err.message,
        });
    }
};
exports.deleteUserHandler = deleteUserHandler;
//# sourceMappingURL=controller.js.map