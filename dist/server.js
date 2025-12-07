"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
require("./config/database");
const routes_1 = __importDefault(require("./modules/auth/routes"));
const routes_2 = __importDefault(require("./modules/users/routes"));
const routes_3 = __importDefault(require("./modules/vehicles/routes"));
const routes_4 = __importDefault(require("./modules/bookings/routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({
        message: 'Vehicle Rental System API',
        status: 'running',
    });
});
app.use('/api/v1/auth', routes_1.default);
app.use('/api/v1/users', routes_2.default);
app.use('/api/v1/vehicles', routes_3.default);
app.use('/api/v1/bookings', routes_4.default);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        errors: 'The requested endpoint does not exist',
    });
});
app.listen(config_1.config.port, () => {
    console.log(`Server is running on port ${config_1.config.port}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map