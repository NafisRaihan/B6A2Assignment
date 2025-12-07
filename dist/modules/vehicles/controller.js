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
exports.deleteVehicleHandler = exports.updateVehicleHandler = exports.getVehicleByIdHandler = exports.getAllVehiclesHandler = exports.createVehicleHandler = void 0;
const vehicleService = __importStar(require("./service"));
const createVehicleHandler = async (req, res) => {
    try {
        const vehicle = await vehicleService.createVehicle(req.body);
        res.status(201).json({
            success: true,
            message: 'Vehicle created successfully',
            data: vehicle,
        });
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            success: false,
            message: 'Failed to create vehicle',
            errors: err.message,
        });
    }
};
exports.createVehicleHandler = createVehicleHandler;
const getAllVehiclesHandler = async (req, res) => {
    try {
        const vehicles = await vehicleService.getAllVehicles();
        const message = vehicles.length === 0 ? 'No vehicles found' : 'Vehicles retrieved successfully';
        res.status(200).json({
            success: true,
            message,
            data: vehicles,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve vehicles',
            errors: err.message,
        });
    }
};
exports.getAllVehiclesHandler = getAllVehiclesHandler;
const getVehicleByIdHandler = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.vehicleId);
        const vehicle = await vehicleService.getVehicleById(vehicleId);
        res.status(200).json({
            success: true,
            message: 'Vehicle retrieved successfully',
            data: vehicle,
        });
    }
    catch (error) {
        const err = error;
        const statusCode = err.message.includes('not found') ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: 'Failed to retrieve vehicle',
            errors: err.message,
        });
    }
};
exports.getVehicleByIdHandler = getVehicleByIdHandler;
const updateVehicleHandler = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.vehicleId);
        const vehicle = await vehicleService.updateVehicle(vehicleId, req.body);
        res.status(200).json({
            success: true,
            message: 'Vehicle updated successfully',
            data: vehicle,
        });
    }
    catch (error) {
        const err = error;
        const statusCode = err.message.includes('not found') ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: 'Failed to update vehicle',
            errors: err.message,
        });
    }
};
exports.updateVehicleHandler = updateVehicleHandler;
const deleteVehicleHandler = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.vehicleId);
        await vehicleService.deleteVehicle(vehicleId);
        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully',
        });
    }
    catch (error) {
        const err = error;
        const statusCode = err.message.includes('not found') ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: 'Failed to delete vehicle',
            errors: err.message,
        });
    }
};
exports.deleteVehicleHandler = deleteVehicleHandler;
//# sourceMappingURL=controller.js.map