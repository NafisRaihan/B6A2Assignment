"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const index_1 = require("./index");
exports.pool = index_1.config.database.connectionString
    ? new pg_1.Pool({
        connectionString: index_1.config.database.connectionString,
        ssl: index_1.config.database.ssl,
    })
    : new pg_1.Pool({
        host: index_1.config.database.host,
        port: index_1.config.database.port,
        user: index_1.config.database.user,
        password: index_1.config.database.password,
        database: index_1.config.database.database,
        ssl: index_1.config.database.ssl,
    });
exports.pool.on('connect', () => {
    console.log('Database connected successfully');
});
exports.pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
});
//# sourceMappingURL=database.js.map